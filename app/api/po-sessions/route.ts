import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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

    // Transform data untuk frontend dengan type safety
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

// POST create new PO session
export async function POST(request: Request) {
  try {
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

    // TODO: Ambil user ID dari JWT token (sementara hardcode untuk development)
    const createdById = await getFirstAdminUser();

    // Buat POSession dengan transaction untuk memastikan konsistensi data
    const newPOSession = await prisma.$transaction(async (tx) => {
      // Buat POSession
      const poSession = await tx.pOSession.create({
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status,
          createdById,
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

    // Fetch data lengkap untuk response
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

    // Transform untuk response dengan type safety
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function getFirstAdminUser(): Promise<string> {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      // Buat admin default jika belum ada
      const newAdmin = await prisma.user.create({
        data: {
          email: "admin@dapurmama.com",
          name: "Admin Dapur Mama",
          password: "$2b$10$defaulthashedpassword", // Temporary
          role: "ADMIN",
        },
      });
      return newAdmin.id;
    }

    return adminUser.id;
  } catch (error) {
    throw new Error("Failed to get admin user");
  }
}
