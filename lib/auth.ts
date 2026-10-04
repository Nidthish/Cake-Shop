import { NextRequest } from "next/server";
import { verifyJwt, JwtPayload } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedAdmin(req: NextRequest): Promise<JwtPayload | null> {
  try {
    // 1. Check HTTP-Only Cookie
    let token = req.cookies.get("admin_token")?.value;

    // 2. Check Authorization Header fallback (Bearer token)
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) return null;

    // 3. Verify JWT
    const payload = verifyJwt(token);
    if (!payload || !payload.userId) return null;

    // 4. Verify Admin user exists in Database and is active
    const userIdBigInt = BigInt(payload.userId);
    let dbUser = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: userIdBigInt },
      });
    } catch (err: any) {
      console.warn("[getAuthenticatedAdmin] DB query error on first attempt, retrying in 600ms...", err?.message);
      await new Promise((r) => setTimeout(r, 600));
      dbUser = await prisma.user.findUnique({
        where: { id: userIdBigInt },
      });
    }

    if (!dbUser || !dbUser.isActive) return null;
    if (dbUser.role !== "ADMIN" && dbUser.role !== "SUPERADMIN") return null;

    return {
      userId: dbUser.id.toString(),
      email: dbUser.email,
      fullName: dbUser.fullName,
      role: dbUser.role,
    };
  } catch (error) {
    console.error("[getAuthenticatedAdmin] Verification Error:", error);
    return null;
  }
}
