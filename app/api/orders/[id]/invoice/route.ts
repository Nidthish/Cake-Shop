import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/orders";
import { generateInvoiceHtml, generateInvoicePdf } from "@/lib/invoice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = decodeURIComponent(id);
    const order = await orderStore.get(orderId);

    if (!order) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>Order Not Found</h2>
          <p>We could not locate an order with ID: <strong>${orderId}</strong>.</p>
          <a href="/" style="display:inline-block; margin-top:20px; color:#802B52;">Return to Home</a>
        </body></html>`,
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get("download") === "1";
    const format = searchParams.get("format");

    // Allow explicit HTML format only if specifically asked via ?format=html
    if (format === "html") {
      const isPrint = searchParams.get("print") === "1";
      const html = generateInvoiceHtml(order, { autoPrint: isPrint });
      const headers: Record<string, string> = {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      };
      if (isDownload) {
        headers["Content-Disposition"] = `attachment; filename="Lollipop-Invoice-${order.id}.html"`;
      }
      return new NextResponse(html, { headers });
    }

    // Default: Professional Official PDF Tax Invoice
    const pdfBytes = generateInvoicePdf(order);
    const disposition = isDownload ? "attachment" : "inline";

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="Lollipop-Invoice-${order.id}.pdf"`,
        "Content-Length": String(pdfBytes.byteLength),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("[GET /api/orders/[id]/invoice] Error:", error);
    return new NextResponse("Failed to generate invoice", { status: 500 });
  }
}

