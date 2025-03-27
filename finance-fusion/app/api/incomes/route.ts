import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { incomeSchema } from "@/schemas/income.schema";

const prisma = new PrismaClient();

// Create a new income
export async function POST(request: Request) {
  const body = await request.json();
  const validation = incomeSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const income = await prisma.income.create({
    data: validation.data,
  });

  return NextResponse.json(income, { status: 201 });
}

// Get all incomes
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const incomes = await prisma.income.findMany({
    where: { userId },
  });

  return NextResponse.json(incomes, { status: 200 });
}

// Update an income
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Income ID is required" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const validation = incomeSchema.partial().safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const income = await prisma.income.update({
    where: { id },
    data: validation.data,
  });

  return NextResponse.json(income, { status: 200 });
}

// Delete an income
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Income ID is required" },
      { status: 400 }
    );
  }

  await prisma.income.delete({
    where: { id },
  });

  return NextResponse.json(
    { message: "Income deleted successfully" },
    { status: 200 }
  );
}
