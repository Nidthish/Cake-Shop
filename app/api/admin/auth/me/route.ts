import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin(req);

  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized admin session." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: admin,
  });
}
