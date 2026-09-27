import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";

export const runtime = "nodejs";

// GET /api/admin/users — Fetch all Admin & Superadmin users (SUPERADMIN only)
export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json({ success: false, error: "Access denied. Only Super Admins can manage users." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "SUPERADMIN", "STAFF"] },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        id: u.id.toString(),
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("[GET /api/admin/users] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/users — Create a new Admin user (SUPERADMIN only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json({ success: false, error: "Access denied. Only Super Admins can create new admin accounts." }, { status: 403 });
    }

    const body = await req.json();
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Full Name, Email, and Password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);
    const assignedRole = role === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN";

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        passwordHash,
        role: assignedRole,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `New Admin user "${newUser.fullName}" created successfully!`,
      user: {
        id: newUser.id.toString(),
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("[POST /api/admin/users] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
