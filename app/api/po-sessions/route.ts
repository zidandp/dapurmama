import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdminAuth } from "@/lib/auth-utils";

// Schema validasi untuk POSession
const poSessionSchema = z
  .object({
    name: z.string().min(1, "Nama sesi PO tidak boleh kosong"),
    description: z.string().optional(),
    startDate: z.string().datetime("Format tanggal mulai tidak valid"),
    endDate: z.string().datetime("Format tanggal selesai tidak valid"),
    status: z.enum(["DRAFT", "ACTIVE", "CLOSED"]).default("DRAFT"),
    productIds: z
      .array(z.string().uuid("ID produk tidak valid"))
      .min(1, "Minimal pilih 1 produk"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

// GET all PO sessions
export async function GET() {
  try {
    const poSessions = await prisma.pOSession.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        poSessionProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    // Transform data untuk frontend
    const transformedSessions = poSessions.map((session) => ({
      id: session.id,
      name: session.name,
      description: session.description,
      startDate: session.startDate.toISOString(),
      endDate: session.endDate.toISOString(),
      status: session.status,
      createdBy: session.createdBy,
      products: session.poSessionProducts.map((psp) => ({
        id: psp.product.id,
        name: psp.product.name,
        price: Number(psp.product.price),
        image: psp.product.imageUrl,
        category: psp.product.category,
      })),
      totalOrders: session._count.orders,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));

    return NextResponse.json(transformedSessions);
  } catch (error) {
    console.error("Failed to fetch PO sessions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST create new PO session - REQUIRES AUTHENTICATION
export async function POST(request: NextRequest) {
  try {
    // 1. AUTHENTICATE USER FIRST
    const currentUser = await getCurrentUser(request);
    const adminUser = requireAdminAuth(currentUser);

    // 2. VALIDATE REQUEST BODY
    const body = await request.json();
    const validation = poSessionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, description, startDate, endDate, status, productIds } =
      validation.data;

    // 3. CREATE PO SESSION WITH AUTHENTICATED USER ID
    const newPOSession = await prisma.$transaction(async (tx) => {
      // Buat POSession dengan user ID dari JWT token
      const poSession = await tx.pOSession.create({
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status,
          createdById: adminUser.id, // Use authenticated user ID
        },
      });

      // Buat relasi dengan produk
      await tx.pOSessionProduct.createMany({
        data: productIds.map((productId) => ({
          poSessionId: poSession.id,
          productId,
        })),
      });

      return poSession;
    });

    // 4. FETCH COMPLETE DATA FOR RESPONSE
    const fullPOSession = await prisma.pOSession.findUnique({
      where: { id: newPOSession.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        poSessionProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                category: true,
              },
            },
          },
        },
      },
    });

    // 5. TRANSFORM FOR RESPONSE
    const transformedSession = {
      id: fullPOSession!.id,
      name: fullPOSession!.name,
      description: fullPOSession!.description,
      startDate: fullPOSession!.startDate.toISOString(),
      endDate: fullPOSession!.endDate.toISOString(),
      status: fullPOSession!.status,
      createdBy: fullPOSession!.createdBy,
      products: fullPOSession!.poSessionProducts.map((psp) => ({
        id: psp.product.id,
        name: psp.product.name,
        price: Number(psp.product.price),
        image: psp.product.imageUrl,
        category: psp.product.category,
      })),
      totalOrders: 0,
      createdAt: fullPOSession!.createdAt,
      updatedAt: fullPOSession!.updatedAt,
    };

    return NextResponse.json(transformedSession, { status: 201 });
  } catch (error) {
    console.error("Failed to create PO session:", error);

    // Handle authentication errors
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          { error: "Token tidak valid atau sudah expired" },
          { status: 401 }
        );
      }
      if (error.message === "Admin access required") {
        return NextResponse.json(
          { error: "Akses admin diperlukan" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
