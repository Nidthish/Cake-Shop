import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    let token = "";
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication token missing." },
        { status: 401, headers: corsHeaders }
      );
    }

    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session token." },
        { status: 401, headers: corsHeaders }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: BigInt(payload.userId) },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    if (!dbUser || !dbUser.isActive) {
      return NextResponse.json(
        { success: false, error: "Account not found or inactive." },
        { status: 401, headers: corsHeaders }
      );
    }

    if (dbUser.role !== "RIDER" && dbUser.role !== "ADMIN" && dbUser.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Access restricted to delivery personnel." },
        { status: 403, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: dbUser.id.toString(),
          fullName: dbUser.fullName,
          email: dbUser.email,
          phone: dbUser.phone || "",
          role: dbUser.role,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch rider profile." },
      { status: 500, headers: corsHeaders }
    );
  }
}
