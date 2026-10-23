import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/users — Fetch all Admin & Superadmin users (SUPERADMIN only)
export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json({ success: false, error: "Access denied. Only Super Admins can manage users." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "SUPERADMIN", "STAFF", "RIDER"] },
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

// POST /api/admin/users — Create a new Admin or Delivery Rider user (SUPERADMIN only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json({ success: false, error: "Access denied. Only Super Admins can create user accounts." }, { status: 403 });
    }

    const body = await req.json();
    const { fullName, email, password, role, phone } = body;

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
    let assignedRole: "SUPERADMIN" | "ADMIN" | "STAFF" | "RIDER" = "ADMIN";
    if (role === "SUPERADMIN") assignedRole = "SUPERADMIN";
    else if (role === "RIDER") assignedRole = "RIDER";
    else if (role === "STAFF") assignedRole = "STAFF";

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        passwordHash,
        phone: phone ? phone.trim() : null,
        role: assignedRole,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        newUser.role === "RIDER"
          ? `New Delivery Rider "${newUser.fullName}" created successfully! They can now log in directly to the mobile app.`
          : `New Admin user "${newUser.fullName}" created successfully!`,
      user: {
        id: newUser.id.toString(),
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("[POST /api/admin/users] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/users — Delete admin/rider user(s) and revoke sessions immediately (SUPERADMIN only)
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Super Admins can delete users." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const deleteAllNonSuper = searchParams.get("all") === "true";

    const body = await req.json().catch(() => ({}));
    const targetId = idParam || body.id || body.userId;

    // Bulk deletion mode: Delete all non-superadmin users (or all users except self)
    if (deleteAllNonSuper) {
      const currentAdminId = BigInt(admin.userId);
      const usersToDelete = await prisma.user.findMany({
        where: {
          id: { not: currentAdminId },
          role: { in: ["ADMIN", "RIDER", "STAFF"] },
        },
        select: { id: true, fullName: true, email: true },
      });

      if (usersToDelete.length === 0) {
        return NextResponse.json({
          success: true,
          message: "No other admin or rider accounts found to delete.",
          deletedCount: 0,
        });
      }

      const idsToDelete = usersToDelete.map((u) => u.id);

      // Nullify foreign key references so referential integrity doesn't block deletion
      await prisma.customCakeRequest.updateMany({
        where: { userId: { in: idsToDelete } },
        data: { userId: null },
      });
      await prisma.order.updateMany({
        where: { userId: { in: idsToDelete } },
        data: { userId: null },
      });
      await prisma.auditLog.updateMany({
        where: { userId: { in: idsToDelete } },
        data: { userId: null },
      });

      const deleteResult = await prisma.user.deleteMany({
        where: { id: { in: idsToDelete } },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${deleteResult.count} user account(s). All their sessions have been permanently terminated.`,
        deletedCount: deleteResult.count,
      });
    }

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "User ID is required for deletion." },
        { status: 400 }
      );
    }

    const targetUserIdStr = String(targetId);
    if (targetUserIdStr === String(admin.userId)) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own active Super Admin account." },
        { status: 400 }
      );
    }

    const targetIdBigInt = BigInt(targetUserIdStr);
    const existing = await prisma.user.findUnique({
      where: { id: targetIdBigInt },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "User not found or already deleted." },
        { status: 404 }
      );
    }

    // Nullify foreign key references so referential integrity doesn't block deletion
    await prisma.customCakeRequest.updateMany({
      where: { userId: targetIdBigInt },
      data: { userId: null },
    });
    await prisma.order.updateMany({
      where: { userId: targetIdBigInt },
      data: { userId: null },
    });
    await prisma.auditLog.updateMany({
      where: { userId: targetIdBigInt },
      data: { userId: null },
    });

    // Delete user from Database — this immediately terminates all active sessions
    await prisma.user.delete({
      where: { id: targetIdBigInt },
    });

    return NextResponse.json({
      success: true,
      message: `User "${existing.fullName}" (${existing.email}) has been permanently deleted and their sessions have been revoked.`,
    });
  } catch (error: any) {
    console.error("[DELETE /api/admin/users] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
