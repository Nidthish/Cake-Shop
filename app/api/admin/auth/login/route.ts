import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { signJwt } from "@/lib/jwt";

import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Brute-force protection: Max 5 login attempts per 15 minutes per IP
  const limiter = rateLimit(req, { limit: 5, windowMs: 900000, endpointKey: "admin-login" });
  if (!limiter.allowed && limiter.response) {
    return limiter.response;
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Auto-seed initial Super Admin if default admin email does not exist yet
    const initialAdminEmail = (process.env.INITIAL_ADMIN_EMAIL || "admin@lollipopcakeshop.com").trim().toLowerCase();
    const initialAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@123456";

    let existingDefaultAdmin = null;
    try {
      existingDefaultAdmin = await prisma.user.findUnique({
        where: { email: initialAdminEmail },
      });
    } catch (err: any) {
      console.warn("[POST /api/admin/auth/login] DB retry after cold-start pause...", err?.message);
      await new Promise((r) => setTimeout(r, 600));
      existingDefaultAdmin = await prisma.user.findUnique({
        where: { email: initialAdminEmail },
      });
    }

    if (!existingDefaultAdmin) {
      console.log(`🌱 Auto-seeding initial Super Admin user (${initialAdminEmail})...`);
      const defaultPasswordHash = hashPassword(initialAdminPassword);
      await prisma.user.create({
        data: {
          email: initialAdminEmail,
          fullName: "Master Super Admin",
          passwordHash: defaultPasswordHash,
          role: "SUPERADMIN",
          isActive: true,
        },
      });
    } else if (cleanEmail === initialAdminEmail && password === initialAdminPassword) {
      const isValid = verifyPassword(password, existingDefaultAdmin.passwordHash || "");
      if (!isValid) {
        console.log(`🔄 Updating Super Admin password to match INITIAL_ADMIN_PASSWORD...`);
        const updatedPasswordHash = hashPassword(initialAdminPassword);
        await prisma.user.update({
          where: { email: initialAdminEmail },
          data: {
            passwordHash: updatedPasswordHash,
            isActive: true,
            role: "SUPERADMIN",
          },
        });
      }
    }

    // Find User in MySQL
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.passwordHash || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid email credentials or inactive account." },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Verify Password using PBKDF2 Constant-Time Comparison
    const isValidPassword = verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password credentials." },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const userPayload = {
      userId: user.id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const token = signJwt(userPayload);

    // Create HTTP-Only Cookie Response
    const response = NextResponse.json({
      success: true,
      message: "Admin login successful!",
      user: userPayload,
      token,
    });

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error("[POST /api/admin/auth/login] Error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed server error." },
      { status: 500 }
    );
  }
}
