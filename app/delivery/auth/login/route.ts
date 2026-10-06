import { NextRequest, NextResponse } from "next/server";
import { getNeonSql } from "@/lib/neon";
import { getMySqlPool } from "@/lib/mysql";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/crypto";
import { signJwt } from "@/lib/jwt";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  // Brute-force protection: 10 attempts per 15 minutes per IP
  const limiter = rateLimit(req, { limit: 10, windowMs: 900000, endpointKey: "rider-login" });
  if (!limiter.allowed && limiter.response) {
    return limiter.response;
  }

  try {
    const body = await req.json().catch(() => ({}));
    const identifier = (body.email || body.username || body.phone || "").toString().trim().toLowerCase();
    const password = (body.password || "").toString();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Email/Phone and Password are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    let user: any = null;

    // 1. Try Neon PostgreSQL
    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT 
            id,
            full_name as "fullName",
            email,
            phone,
            role,
            password_hash as "passwordHash",
            is_active as "isActive"
          FROM users
          WHERE LOWER(email) = ${identifier} OR phone = ${identifier}
          LIMIT 1
        `;
        if (rows.length > 0) {
          user = rows[0];
        }
      }
    } catch (neonErr) {
      console.warn("[POST /delivery/auth/login] Neon query fallback to MySQL/Prisma:", neonErr);
    }

    // 2. Try MySQL Pool
    if (!user) {
      try {
        const pool = getMySqlPool();
        if (pool) {
          const [rows]: any = await pool.query(
            `SELECT id, full_name as fullName, email, phone, role, password_hash as passwordHash, is_active as isActive
             FROM users
             WHERE LOWER(email) = ? OR phone = ?
             LIMIT 1`,
            [identifier, identifier]
          );
          if (Array.isArray(rows) && rows.length > 0) {
            user = rows[0];
          }
        }
      } catch (mysqlErr) {
        console.warn("[POST /delivery/auth/login] MySQL query fallback to Prisma:", mysqlErr);
      }
    }

    // 3. Try Prisma
    if (!user) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phone: identifier },
            ],
          },
        });
        if (dbUser) {
          user = {
            id: dbUser.id.toString(),
            fullName: dbUser.fullName,
            email: dbUser.email,
            phone: dbUser.phone,
            role: dbUser.role,
            passwordHash: dbUser.passwordHash,
            isActive: dbUser.isActive,
          };
        }
      } catch (prismaErr) {
        console.warn("[POST /delivery/auth/login] Prisma query error:", prismaErr);
      }
    }

    if (!user || !user.passwordHash || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials or account is inactive." },
        { status: 401, headers: corsHeaders }
      );
    }

    // Verify Role: Must be RIDER, or ADMIN/SUPERADMIN
    if (user.role !== "RIDER" && user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Access restricted. Only delivery rider accounts can log in here." },
        { status: 403, headers: corsHeaders }
      );
    }

    // Verify Password using PBKDF2 constant time verification
    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email/phone or password credentials." },
        { status: 401, headers: corsHeaders }
      );
    }

    // Issue JWT token
    const token = signJwt({
      userId: user.id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Welcome back, ${user.fullName}!`,
        token,
        user: {
          id: user.id.toString(),
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || "",
          role: user.role,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[POST /delivery/auth/login] Exception:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication service failed." },
      { status: 500, headers: corsHeaders }
    );
  }
}
