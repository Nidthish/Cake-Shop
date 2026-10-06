import { getNeonSql } from "./neon";
import { getMySqlPool } from "./mysql";
import { prisma } from "./prisma";
import type { Order, OrderLineItem } from "@/types";

export interface OrderStore {
  create(order: Order): Promise<Order>;
  get(orderId: string): Promise<Order | null>;
  search(query: string): Promise<Order[]>;
  getByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null>;
  getByIdempotencyKey(key: string): Promise<Order | null>;
  registerIdempotencyKey(key: string, orderId: string): Promise<void>;
  update(orderId: string, patch: Partial<Order>): Promise<Order | null>;
}

class HybridOrderStore implements OrderStore {
  private memoryOrders = new Map<string, Order>();
  private idempotencyMap = new Map<string, string>();
  private rzpIndex = new Map<string, string>();

  async create(order: Order): Promise<Order> {
    // 0. Ensure 4-digit delivery OTP is always generated and present
    if (!order.deliveryOtp) {
      order.deliveryOtp = generateDeliveryOtp();
    }
    if (order.deliveryOtpVerified === undefined) {
      order.deliveryOtpVerified = false;
    }

    // 1. Store in memory for instant synchronous lookup
    this.memoryOrders.set(order.id, order);
    if (order.razorpayOrderId) {
      this.rzpIndex.set(order.razorpayOrderId, order.id);
    }

    const hasEggless = order.items.some(
      (i) =>
        i.eggPreference === "eggless" ||
        i.weight?.toLowerCase().includes("eggless") ||
        i.name?.toLowerCase().includes("eggless")
    );

    const paymentMethodEnum =
      order.paymentMethod === "DIRECT" || order.paymentMethod === "COD" ? "COD" : "RAZORPAY";
    const paymentStatusEnum =
      order.paymentStatus === "PAID"
        ? "PAID"
        : order.paymentStatus === "PAYMENT_INITIATED"
        ? "INITIATED"
        : "PENDING";

    // 2. Persist directly to Neon PostgreSQL (HTTP protocol — zero firewall/5432 blocks)
    let neonSucceeded = false;
    for (let attempt = 0; attempt < 2 && !neonSucceeded; attempt++) {
      try {
        const sql = getNeonSql();
        if (sql) {
          // Upsert User
          const userRows = await sql`
            INSERT INTO users (email, full_name, phone, role, is_active, updated_at)
            VALUES (${order.customer.email}, ${order.customer.fullName}, ${order.customer.phone}, 'CUSTOMER', true, NOW())
            ON CONFLICT (email) 
            DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, updated_at = NOW()
            RETURNING id
          `;
          const neonUserId = userRows[0]?.id;

          // Check if order already exists
          const existingOrder = await sql`SELECT id FROM orders WHERE order_number = ${order.id} LIMIT 1`;
          let neonOrderId: string | number;

          if (existingOrder.length > 0) {
            neonOrderId = existingOrder[0].id;
            await sql`
              UPDATE orders 
              SET delivery_otp = COALESCE(delivery_otp, ${order.deliveryOtp || null}),
                  delivery_otp_verified = COALESCE(delivery_otp_verified, ${Boolean(order.deliveryOtpVerified)})
              WHERE id = ${neonOrderId}
            `;
          } else {
            const orderRows = await sql`
              INSERT INTO orders (
                order_number, user_id, customer_name, customer_email, customer_phone,
                street_address, city, pincode, state,
                delivery_date, delivery_time_slot, delivery_notes, has_eggless_items,
                subtotal, sgst, cgst, tax_amount, delivery_fee, discount_amount, total_amount, status,
                delivery_otp, delivery_otp_verified,
                updated_at
              ) VALUES (
                ${order.id}, ${neonUserId}, ${order.customer.fullName}, ${order.customer.email}, ${order.customer.phone},
                ${order.address.street}, ${order.address.city}, ${order.address.pincode}, 'Tamil Nadu',
                ${new Date(order.schedule.date)}, ${order.schedule.timeSlot}, ${order.specialInstructions || null}, ${hasEggless},
                ${order.subtotal}, ${order.sgst}, ${order.cgst}, ${order.tax}, ${order.deliveryFee}, 0.00, ${order.total}, ${order.orderStatus || "CONFIRMED"},
                ${order.deliveryOtp || null}, ${Boolean(order.deliveryOtpVerified)},
                NOW()
              )
              RETURNING id
            `;
            neonOrderId = orderRows[0]?.id;
          }

          // Insert Order Items
          if (neonOrderId) {
            for (const item of order.items) {
              const pRows = await sql`
                SELECT id, product_code FROM products 
                WHERE slug = ${item.productId} OR product_code = ${item.productId} OR name ILIKE ${item.name}
                LIMIT 1
              `;
              const prodId = pRows.length > 0 ? pRows[0].id : 1;
              const prodCode = pRows.length > 0 ? pRows[0].product_code : (item.productId || "LLP-PRD");
              const isEgglessItem = item.eggPreference === "eggless" || item.weight?.toLowerCase().includes("eggless");

              await sql`
                INSERT INTO order_items (
                  order_id, product_id, product_code, product_name, variant_name,
                  is_eggless, quantity, unit_price, line_total, cake_message
                ) VALUES (
                  ${neonOrderId}, ${prodId}, ${prodCode}, ${item.name}, ${item.weight},
                  ${isEgglessItem}, ${item.quantity}, ${item.unitPrice}, ${item.lineTotal}, ${item.cakeMessage || null}
                )
              `;
            }

            // Insert / Upsert Payment
            await sql`
              INSERT INTO payments (
                order_id, payment_method, payment_status, currency, amount, razorpay_order_id, paid_at, updated_at
              ) VALUES (
                ${neonOrderId}, ${paymentMethodEnum}, ${paymentStatusEnum}, 'INR', ${order.total},
                ${order.razorpayOrderId || null}, ${paymentStatusEnum === "PAID" ? new Date() : null}, NOW()
              )
              ON CONFLICT (order_id)
              DO UPDATE SET 
                payment_status = EXCLUDED.payment_status,
                razorpay_order_id = COALESCE(EXCLUDED.razorpay_order_id, payments.razorpay_order_id),
                paid_at = COALESCE(EXCLUDED.paid_at, payments.paid_at),
                updated_at = NOW()
            `;
            console.log(`✅ [Neon DB Store] Order ${order.id} saved to PostgreSQL successfully!`);
            neonSucceeded = true;
          }
        }
      } catch (neonErr: any) {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 400));
        } else {
          console.warn("⚠️ [Neon DB Store Notice]:", neonErr?.message || neonErr);
        }
      }
    }

    // 3. Persist to MySQL Database (localhost:3306 lollipop_db)
    try {
      const mysqlPool = getMySqlPool();
      if (mysqlPool) {
        // Upsert User in MySQL
        await mysqlPool.query(`
          INSERT INTO lollipop_db.users (email, full_name, phone, role, is_active, updated_at)
          VALUES (?, ?, ?, 'CUSTOMER', 1, NOW())
          ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone), updated_at = NOW()
        `, [order.customer.email, order.customer.fullName, order.customer.phone]);

        const [[mysqlUser]]: any = await mysqlPool.query(
          "SELECT id FROM lollipop_db.users WHERE email = ? LIMIT 1",
          [order.customer.email]
        );

        // Check if order already exists
        const [existingMySql]: any = await mysqlPool.query(
          "SELECT id FROM lollipop_db.orders WHERE order_number = ? LIMIT 1",
          [order.id]
        );
        let mysqlOrderId: number;

        if (existingMySql.length > 0) {
          mysqlOrderId = existingMySql[0].id;
          await mysqlPool.query(
            "UPDATE lollipop_db.orders SET delivery_otp = COALESCE(delivery_otp, ?) WHERE id = ?",
            [order.deliveryOtp || null, mysqlOrderId]
          );
        } else {
          const [orderRes]: any = await mysqlPool.query(`
            INSERT INTO lollipop_db.orders (
              order_number, user_id, customer_name, customer_email, customer_phone,
              street_address, city, pincode, state,
              delivery_date, delivery_time_slot, delivery_notes, has_eggless_items,
              subtotal, sgst, cgst, tax_amount, delivery_fee, discount_amount, total_amount, status,
              delivery_otp, delivery_otp_verified,
              created_at, updated_at
            ) VALUES (
              ?, ?, ?, ?, ?,
              ?, ?, ?, 'Tamil Nadu',
              ?, ?, ?, ?,
              ?, ?, ?, ?, ?, 0.00, ?, ?,
              ?, ?,
              NOW(), NOW()
            )
          `, [
            order.id, mysqlUser?.id || null, order.customer.fullName, order.customer.email, order.customer.phone,
            order.address.street, order.address.city, order.address.pincode,
            new Date(order.schedule.date), order.schedule.timeSlot, order.specialInstructions || null, hasEggless ? 1 : 0,
            order.subtotal, order.sgst, order.cgst, order.tax, order.deliveryFee, order.total, order.orderStatus || "CONFIRMED",
            order.deliveryOtp || null, order.deliveryOtpVerified ? 1 : 0
          ]);
          mysqlOrderId = orderRes.insertId;
        }

        if (mysqlOrderId) {
          for (const item of order.items) {
            const [pRows]: any = await mysqlPool.query(
              "SELECT id, product_code FROM lollipop_db.products WHERE slug = ? OR product_code = ? OR name = ? LIMIT 1",
              [item.productId, item.productId, item.name]
            );
            const prodId = pRows.length > 0 ? pRows[0].id : 1;
            const prodCode = pRows.length > 0 ? pRows[0].product_code : (item.productId || "LLP-PRD");
            const isEgglessItem = item.eggPreference === "eggless" || item.weight?.toLowerCase().includes("eggless") ? 1 : 0;

            await mysqlPool.query(`
              INSERT INTO lollipop_db.order_items (
                order_id, product_id, product_code, product_name, variant_name,
                is_eggless, quantity, unit_price, line_total, cake_message, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
              mysqlOrderId, prodId, prodCode, item.name, item.weight,
              isEgglessItem, item.quantity, item.unitPrice, item.lineTotal, item.cakeMessage || null
            ]);
          }

          await mysqlPool.query(`
            INSERT INTO lollipop_db.payments (
              order_id, payment_method, payment_status, currency, amount, razorpay_order_id, paid_at, created_at, updated_at
            ) VALUES (?, ?, ?, 'INR', ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
              payment_status = VALUES(payment_status),
              razorpay_order_id = COALESCE(VALUES(razorpay_order_id), razorpay_order_id),
              paid_at = COALESCE(VALUES(paid_at), paid_at),
              updated_at = NOW()
          `, [
            mysqlOrderId, paymentMethodEnum, paymentStatusEnum, order.total,
            order.razorpayOrderId || null, paymentStatusEnum === "PAID" ? new Date() : null
          ]);
          console.log(`✅ [MySQL DB Store] Order ${order.id} saved to MySQL successfully!`);
        }
      }
    } catch (mysqlErr: any) {
      console.warn("⚠️ [MySQL DB Store Notice]:", mysqlErr?.message || mysqlErr);
    }

    return order;
  }

  async get(orderId: string): Promise<Order | null> {
    const memory = this.memoryOrders.get(orderId);
    if (memory) return memory;

    // Check Neon PostgreSQL
    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT o.*, 
                 p.payment_method, p.payment_status, p.razorpay_order_id, p.razorpay_payment_id,
                 COALESCE(
                   json_agg(
                     json_build_object(
                       'productId', i.product_code,
                       'name', i.product_name,
                       'weight', i.variant_name,
                       'quantity', i.quantity,
                       'unitPrice', i.unit_price,
                       'lineTotal', i.line_total,
                       'eggPreference', CASE WHEN i.is_eggless THEN 'eggless' ELSE 'egg' END,
                       'cakeMessage', i.cake_message
                     )
                   ) FILTER (WHERE i.id IS NOT NULL), '[]'
                 ) as items
          FROM orders o
          LEFT JOIN payments p ON p.order_id = o.id
          LEFT JOIN order_items i ON i.order_id = o.id
          WHERE o.order_number = ${orderId} OR o.id::text = ${orderId}
          GROUP BY o.id, p.id
          LIMIT 1
        `;

        if (rows.length > 0) {
          const o = rows[0];
          return {
            id: o.order_number,
            items: o.items || [],
            customer: {
              fullName: o.customer_name,
              email: o.customer_email,
              phone: o.customer_phone,
            },
            address: {
              street: o.street_address,
              city: o.city,
              pincode: o.pincode,
            },
            schedule: {
              date: new Date(o.delivery_date).toISOString().split("T")[0],
              timeSlot: o.delivery_time_slot,
            },
            subtotal: Number(o.subtotal),
            sgst: Number(o.sgst),
            cgst: Number(o.cgst),
            tax: Number(o.tax_amount),
            deliveryFee: Number(o.delivery_fee),
            total: Number(o.total_amount),
            orderStatus: o.status,
            paymentStatus: o.payment_status || "PENDING",
            paymentMethod: o.payment_method || "COD",
            razorpayOrderId: o.razorpay_order_id || undefined,
            deliveryOtp: o.delivery_otp || undefined,
            deliveryOtpVerified: Boolean(o.delivery_otp_verified),
            deliveryPartnerName: o.delivery_partner_name || undefined,
            deliveryPartnerPhone: o.delivery_partner_phone || undefined,
            cancellationReason: o.cancellation_reason || undefined,
            cancelledAt: o.cancelled_at ? new Date(o.cancelled_at).toISOString() : undefined,
            deliveredAt: o.delivered_at ? new Date(o.delivered_at).toISOString() : undefined,
            assignedAt: o.assigned_at ? new Date(o.assigned_at).toISOString() : undefined,
            createdAt: new Date(o.created_at).toISOString(),
            updatedAt: new Date(o.updated_at).toISOString(),
          };
        }
      }
    } catch {}

    // Check MySQL
    try {
      const mysqlPool = getMySqlPool();
      if (mysqlPool) {
        const [orders]: any = await mysqlPool.query(
          "SELECT o.*, p.payment_method, p.payment_status, p.razorpay_order_id, p.razorpay_payment_id FROM lollipop_db.orders o LEFT JOIN lollipop_db.payments p ON p.order_id = o.id WHERE o.order_number = ? OR o.id = ? LIMIT 1",
          [orderId, orderId]
        );
        if (orders.length > 0) {
          const o = orders[0];
          const [items]: any = await mysqlPool.query(
            "SELECT * FROM lollipop_db.order_items WHERE order_id = ?",
            [o.id]
          );

          return {
            id: o.order_number,
            items: items.map((i: any) => ({
              productId: i.product_code,
              name: i.product_name,
              weight: i.variant_name,
              quantity: i.quantity,
              unitPrice: Number(i.unit_price),
              lineTotal: Number(i.line_total),
              eggPreference: i.is_eggless ? "eggless" : "egg",
              cakeMessage: i.cake_message || undefined,
            })),
            customer: {
              fullName: o.customer_name,
              email: o.customer_email,
              phone: o.customer_phone,
            },
            address: {
              street: o.street_address,
              city: o.city,
              pincode: o.pincode,
            },
            schedule: {
              date: new Date(o.delivery_date).toISOString().split("T")[0],
              timeSlot: o.delivery_time_slot,
            },
            subtotal: Number(o.subtotal),
            sgst: Number(o.sgst),
            cgst: Number(o.cgst),
            tax: Number(o.tax_amount),
            deliveryFee: Number(o.delivery_fee),
            total: Number(o.total_amount),
            orderStatus: o.status,
            paymentStatus: o.payment_status || "PENDING",
            paymentMethod: o.payment_method || "COD",
            razorpayOrderId: o.razorpay_order_id || undefined,
            deliveryOtp: o.delivery_otp || undefined,
            deliveryOtpVerified: Boolean(o.delivery_otp_verified),
            deliveryPartnerName: o.delivery_partner_name || undefined,
            deliveryPartnerPhone: o.delivery_partner_phone || undefined,
            cancellationReason: o.cancellation_reason || undefined,
            cancelledAt: o.cancelled_at ? new Date(o.cancelled_at).toISOString() : undefined,
            deliveredAt: o.delivered_at ? new Date(o.delivered_at).toISOString() : undefined,
            assignedAt: o.assigned_at ? new Date(o.assigned_at).toISOString() : undefined,
            createdAt: new Date(o.created_at).toISOString(),
            updatedAt: new Date(o.updated_at).toISOString(),
          };
        }
      }
    } catch {}

    return null;
  }

  async getByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
    const memoryId = this.rzpIndex.get(razorpayOrderId);
    if (memoryId) return this.get(memoryId);

    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT o.order_number FROM payments p
          JOIN orders o ON o.id = p.order_id
          WHERE p.razorpay_order_id = ${razorpayOrderId}
          LIMIT 1
        `;
        if (rows.length > 0) {
          return this.get(rows[0].order_number);
        }
      }
    } catch {}

    try {
      const mysqlPool = getMySqlPool();
      if (mysqlPool) {
        const [rows]: any = await mysqlPool.query(
          "SELECT o.order_number FROM lollipop_db.payments p JOIN lollipop_db.orders o ON o.id = p.order_id WHERE p.razorpay_order_id = ? LIMIT 1",
          [razorpayOrderId]
        );
        if (rows.length > 0) {
          return this.get(rows[0].order_number);
        }
      }
    } catch {}

    return null;
  }

  async search(query: string): Promise<Order[]> {
    const clean = query.trim();
    if (!clean) return [];

    const resultsMap = new Map<string, Order>();

    // 1. Search in-memory
    for (const ord of this.memoryOrders.values()) {
      if (
        ord.id.toLowerCase().includes(clean.toLowerCase()) ||
        ord.customer.phone.includes(clean) ||
        ord.customer.email.toLowerCase().includes(clean.toLowerCase()) ||
        ord.customer.fullName.toLowerCase().includes(clean.toLowerCase())
      ) {
        resultsMap.set(ord.id, ord);
      }
    }

    // 2. Search Neon PostgreSQL
    try {
      const sql = getNeonSql();
      if (sql) {
        const pattern = `%${clean}%`;
        const rows = await sql`
          SELECT o.*, 
                 p.payment_method, p.payment_status, p.razorpay_order_id, p.razorpay_payment_id,
                 COALESCE(
                   json_agg(
                     json_build_object(
                       'productId', i.product_code,
                       'name', i.product_name,
                       'weight', i.variant_name,
                       'quantity', i.quantity,
                       'unitPrice', i.unit_price,
                       'lineTotal', i.line_total,
                       'eggPreference', CASE WHEN i.is_eggless THEN 'eggless' ELSE 'egg' END,
                       'cakeMessage', i.cake_message
                     )
                   ) FILTER (WHERE i.id IS NOT NULL), '[]'
                 ) as items
          FROM orders o
          LEFT JOIN payments p ON p.order_id = o.id
          LEFT JOIN order_items i ON i.order_id = o.id
          WHERE o.order_number ILIKE ${pattern}
             OR o.customer_phone ILIKE ${pattern}
             OR o.customer_email ILIKE ${pattern}
             OR o.customer_name ILIKE ${pattern}
          GROUP BY o.id, p.id
          ORDER BY o.created_at DESC
          LIMIT 20
        `;

        for (const o of rows) {
          if (!resultsMap.has(o.order_number)) {
            resultsMap.set(o.order_number, {
              id: o.order_number,
              items: o.items || [],
              customer: {
                fullName: o.customer_name,
                email: o.customer_email,
                phone: o.customer_phone,
              },
              address: {
                street: o.street_address,
                city: o.city,
                pincode: o.pincode,
              },
              schedule: {
                date: new Date(o.delivery_date).toISOString().split("T")[0],
                timeSlot: o.delivery_time_slot,
              },
              subtotal: Number(o.subtotal),
              sgst: Number(o.sgst),
              cgst: Number(o.cgst),
              tax: Number(o.tax_amount),
              deliveryFee: Number(o.delivery_fee),
              total: Number(o.total_amount),
              orderStatus: o.status,
              paymentStatus: o.payment_status || "PENDING",
              paymentMethod: o.payment_method || "COD",
              razorpayOrderId: o.razorpay_order_id || undefined,
              deliveryOtp: o.delivery_otp || undefined,
              deliveryOtpVerified: Boolean(o.delivery_otp_verified),
              deliveryPartnerName: o.delivery_partner_name || undefined,
              deliveryPartnerPhone: o.delivery_partner_phone || undefined,
              cancellationReason: o.cancellation_reason || undefined,
              cancelledAt: o.cancelled_at ? new Date(o.cancelled_at).toISOString() : undefined,
              deliveredAt: o.delivered_at ? new Date(o.delivered_at).toISOString() : undefined,
              assignedAt: o.assigned_at ? new Date(o.assigned_at).toISOString() : undefined,
              createdAt: new Date(o.created_at).toISOString(),
              updatedAt: new Date(o.updated_at).toISOString(),
            });
          }
        }
      }
    } catch (e: any) {
      console.warn("⚠️ [Neon Search Notice]:", e?.message || e);
    }

    return Array.from(resultsMap.values());
  }

  async getByIdempotencyKey(key: string): Promise<Order | null> {
    const orderId = this.idempotencyMap.get(key);
    if (!orderId) return null;
    return this.get(orderId);
  }

  async registerIdempotencyKey(key: string, orderId: string): Promise<void> {
    this.idempotencyMap.set(key, orderId);
  }

  async update(orderId: string, patch: Partial<Order>): Promise<Order | null> {
    const existing = this.memoryOrders.get(orderId);
    if (existing) {
      const updated: Order = {
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      this.memoryOrders.set(orderId, updated);
      if (updated.razorpayOrderId) {
        this.rzpIndex.set(updated.razorpayOrderId, updated.id);
      }
    }

    const payStatus = patch.paymentStatus === "PAID" ? "PAID" : patch.paymentStatus;
    const paidAt = patch.paymentStatus === "PAID" ? new Date() : null;

    // 1. Update Neon PostgreSQL
    let neonUpdateDone = false;
    for (let attempt = 0; attempt < 2 && !neonUpdateDone; attempt++) {
      try {
        const sql = getNeonSql();
        if (sql) {
          const isNum = /^\d+$/.test(orderId);
          const deliveredAtVal = patch.deliveredAt ? new Date(patch.deliveredAt) : (patch.orderStatus === "DELIVERED" ? new Date() : null);
          const cancelledAtVal = patch.cancelledAt ? new Date(patch.cancelledAt) : (patch.orderStatus === "CANCELLED" ? new Date() : null);
          const assignedAtVal = patch.assignedAt ? new Date(patch.assignedAt) : (patch.orderStatus === "OUT_FOR_DELIVERY" ? new Date() : null);

          // Update order status & delivery fields
          if (isNum) {
            await sql`
              UPDATE orders 
              SET 
                status = COALESCE(${patch.orderStatus || null}, status),
                delivery_otp = COALESCE(${patch.deliveryOtp || null}, delivery_otp),
                delivery_otp_verified = CASE 
                  WHEN ${patch.deliveryOtpVerified !== undefined} THEN ${Boolean(patch.deliveryOtpVerified)} 
                  ELSE delivery_otp_verified 
                END,
                delivery_partner_name = COALESCE(${patch.deliveryPartnerName || null}, delivery_partner_name),
                delivery_partner_phone = COALESCE(${patch.deliveryPartnerPhone || null}, delivery_partner_phone),
                cancellation_reason = COALESCE(${patch.cancellationReason || null}, cancellation_reason),
                cancelled_at = COALESCE(${cancelledAtVal}, cancelled_at),
                delivered_at = COALESCE(${deliveredAtVal}, delivered_at),
                assigned_at = COALESCE(${assignedAtVal}, assigned_at),
                updated_at = NOW() 
              WHERE order_number = ${orderId} OR id = ${Number(orderId)}
            `;
          } else {
            await sql`
              UPDATE orders 
              SET 
                status = COALESCE(${patch.orderStatus || null}, status),
                delivery_otp = COALESCE(${patch.deliveryOtp || null}, delivery_otp),
                delivery_otp_verified = CASE 
                  WHEN ${patch.deliveryOtpVerified !== undefined} THEN ${Boolean(patch.deliveryOtpVerified)} 
                  ELSE delivery_otp_verified 
                END,
                delivery_partner_name = COALESCE(${patch.deliveryPartnerName || null}, delivery_partner_name),
                delivery_partner_phone = COALESCE(${patch.deliveryPartnerPhone || null}, delivery_partner_phone),
                cancellation_reason = COALESCE(${patch.cancellationReason || null}, cancellation_reason),
                cancelled_at = COALESCE(${cancelledAtVal}, cancelled_at),
                delivered_at = COALESCE(${deliveredAtVal}, delivered_at),
                assigned_at = COALESCE(${assignedAtVal}, assigned_at),
                updated_at = NOW() 
              WHERE order_number = ${orderId}
            `;
          }

          if (patch.paymentStatus || patch.razorpayPaymentId) {
            if (isNum) {
              await sql`
                UPDATE payments 
                SET payment_status = COALESCE(${payStatus}, payment_status),
                    razorpay_payment_id = COALESCE(${patch.razorpayPaymentId || null}, razorpay_payment_id),
                    paid_at = COALESCE(${paidAt}, paid_at),
                    updated_at = NOW()
                WHERE order_id = (SELECT id FROM orders WHERE order_number = ${orderId} OR id = ${Number(orderId)} LIMIT 1)
              `;
            } else {
              await sql`
                UPDATE payments 
                SET payment_status = COALESCE(${payStatus}, payment_status),
                    razorpay_payment_id = COALESCE(${patch.razorpayPaymentId || null}, razorpay_payment_id),
                    paid_at = COALESCE(${paidAt}, paid_at),
                    updated_at = NOW()
                WHERE order_id = (SELECT id FROM orders WHERE order_number = ${orderId} LIMIT 1)
              `;
            }
          }
          neonUpdateDone = true;
        }
      } catch (e: any) {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 400));
        } else {
          console.warn("⚠️ [Neon Update Notice]:", e?.message || e);
        }
      }
    }

    // 2. Update MySQL
    try {
      const mysqlPool = getMySqlPool();
      if (mysqlPool) {
        const isNumeric = /^\d+$/.test(orderId);
        const deliveredAtVal = patch.deliveredAt ? new Date(patch.deliveredAt) : (patch.orderStatus === "DELIVERED" ? new Date() : null);
        const cancelledAtVal = patch.cancelledAt ? new Date(patch.cancelledAt) : (patch.orderStatus === "CANCELLED" ? new Date() : null);
        const assignedAtVal = patch.assignedAt ? new Date(patch.assignedAt) : (patch.orderStatus === "OUT_FOR_DELIVERY" ? new Date() : null);

        const mysqlUpdateQuery = `
          UPDATE lollipop_db.orders 
          SET 
            status = COALESCE(?, status),
            delivery_otp = COALESCE(?, delivery_otp),
            delivery_otp_verified = CASE WHEN ? IS NOT NULL THEN ? ELSE delivery_otp_verified END,
            delivery_partner_name = COALESCE(?, delivery_partner_name),
            delivery_partner_phone = COALESCE(?, delivery_partner_phone),
            cancellation_reason = COALESCE(?, cancellation_reason),
            cancelled_at = COALESCE(?, cancelled_at),
            delivered_at = COALESCE(?, delivered_at),
            assigned_at = COALESCE(?, assigned_at),
            updated_at = NOW()
          WHERE ${isNumeric ? "order_number = ? OR id = ?" : "order_number = ?"}
        `;

        const otpVerifiedParam = patch.deliveryOtpVerified !== undefined ? (patch.deliveryOtpVerified ? 1 : 0) : null;
        const mysqlParams = [
          patch.orderStatus || null,
          patch.deliveryOtp || null,
          otpVerifiedParam,
          otpVerifiedParam,
          patch.deliveryPartnerName || null,
          patch.deliveryPartnerPhone || null,
          patch.cancellationReason || null,
          cancelledAtVal,
          deliveredAtVal,
          assignedAtVal,
          orderId,
          ...(isNumeric ? [Number(orderId)] : []),
        ];

        await mysqlPool.query(mysqlUpdateQuery, mysqlParams);

        if (patch.paymentStatus || patch.razorpayPaymentId) {
          if (isNumeric) {
            await mysqlPool.query(`
              UPDATE lollipop_db.payments 
              SET payment_status = COALESCE(?, payment_status),
                  razorpay_payment_id = COALESCE(?, razorpay_payment_id),
                  paid_at = COALESCE(?, paid_at),
                  updated_at = NOW()
              WHERE order_id = (SELECT id FROM lollipop_db.orders WHERE order_number = ? OR id = ? LIMIT 1)
            `, [payStatus || null, patch.razorpayPaymentId || null, paidAt, orderId, Number(orderId)]);
          } else {
            await mysqlPool.query(`
              UPDATE lollipop_db.payments 
              SET payment_status = COALESCE(?, payment_status),
                  razorpay_payment_id = COALESCE(?, razorpay_payment_id),
                  paid_at = COALESCE(?, paid_at),
                  updated_at = NOW()
              WHERE order_id = (SELECT id FROM lollipop_db.orders WHERE order_number = ? LIMIT 1)
            `, [payStatus || null, patch.razorpayPaymentId || null, paidAt, orderId]);
          }
        }
      }
    } catch (e: any) {
      console.warn("⚠️ [MySQL Update Notice]:", e?.message || e);
    }

    return this.get(orderId);
  }
}

const globalForOrders = globalThis as unknown as {
  __lollipopOrderStore?: OrderStore;
};

export const orderStore: OrderStore =
  globalForOrders.__lollipopOrderStore ??
  (globalForOrders.__lollipopOrderStore = new HybridOrderStore());

export function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LLP-${dateStr}-${rand}`;
}

export function generateDeliveryOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function getOrGenerateDeliveryOtp(orderId: string): Promise<{ otp: string; order: Order } | null> {
  const order = await orderStore.get(orderId);
  if (!order) return null;

  if (order.deliveryOtp) {
    return { otp: order.deliveryOtp, order };
  }

  const newOtp = generateDeliveryOtp();
  const updated = await orderStore.update(orderId, {
    deliveryOtp: newOtp,
    deliveryOtpVerified: false,
  });

  return { otp: newOtp, order: updated || order };
}

export async function verifyAndDeliverOrder(
  orderId: string,
  options: {
    otp?: string;
    partnerName?: string;
    partnerPhone?: string;
    bypassOtp?: boolean;
  } = {}
): Promise<{ success: boolean; error?: string; order?: Order | null }> {
  const order = await orderStore.get(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  if (order.orderStatus === "DELIVERED") {
    return { success: true, order, error: "Order is already marked as DELIVERED" };
  }

  if (order.orderStatus === "CANCELLED") {
    return { success: false, error: "Cannot deliver a cancelled order" };
  }

  // OTP check
  if (!options.bypassOtp) {
    if (!options.otp) {
      return { success: false, error: "Delivery OTP is required for confirmation" };
    }
    const cleanInput = options.otp.trim();
    if (!order.deliveryOtp || order.deliveryOtp !== cleanInput) {
      return { success: false, error: "Invalid delivery OTP. Please verify with the customer." };
    }
  }

  // Update order to DELIVERED
  const patch: Partial<Order> = {
    orderStatus: "DELIVERED",
    deliveryOtpVerified: true,
    deliveredAt: new Date().toISOString(),
    ...(options.partnerName && { deliveryPartnerName: options.partnerName }),
    ...(options.partnerPhone && { deliveryPartnerPhone: options.partnerPhone }),
  };

  // If COD, mark payment as completed upon cash delivery
  if (order.paymentMethod === "COD" || order.paymentStatus !== "PAID") {
    patch.paymentStatus = "PAID";
  }

  const updated = await orderStore.update(orderId, patch);
  return { success: true, order: updated };
}

export async function cancelDeliveryOrder(
  orderId: string,
  reason: string,
  partnerName?: string
): Promise<{ success: boolean; error?: string; order?: Order | null }> {
  const order = await orderStore.get(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  if (order.orderStatus === "DELIVERED") {
    return { success: false, error: "Cannot cancel an already delivered order" };
  }

  const updated = await orderStore.update(orderId, {
    orderStatus: "CANCELLED",
    cancellationReason: reason || "Cancelled by delivery partner",
    cancelledAt: new Date().toISOString(),
    ...(partnerName && { deliveryPartnerName: partnerName }),
  });

  return { success: true, order: updated };
}

