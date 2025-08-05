import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.STACK_SECRET_SERVER_KEY || "fallback-secret-key";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getCurrentUser(
  request: NextRequest
): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get fresh user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export function requireAuth(user: AuthUser | null) {
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export function requireAdminAuth(user: AuthUser | null) {
  const authenticatedUser = requireAuth(user);

  if (
    authenticatedUser.role !== "ADMIN" &&
    authenticatedUser.role !== "SUPER_ADMIN"
  ) {
    throw new Error("Admin access required");
  }

  return authenticatedUser;
}
