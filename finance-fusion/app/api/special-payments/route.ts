import { NextResponse } from "next/server";

import { CreateSpecialPaymentSchema } from "@/schemas/special-payment";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all special payments
export async function GET() {
  try {
    const specialPayments = await prisma.specialPayment.findMany({
      orderBy: { paidDate: "desc" },
    });
    return NextResponse.json(specialPayments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new special payment
export async function POST(request: Request) {
  const body = await request.json();
  const validation = CreateSpecialPaymentSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const specialPayment = await prisma.specialPayment.create({
      data: validation.data,
    });

    return NextResponse.json(specialPayment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
