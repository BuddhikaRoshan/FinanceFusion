import { NextResponse } from "next/server";
import { UpdateSpecialPaymentSchema } from "@/schemas/special-payment";
import { ObjectId } from "bson";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET special payment by ID
export async function GET(
  request: Request,
  { params }: { params: { id: Promise<string> } }
) {
  const id = await params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid special payment ID" },
      { status: 400 }
    );
  }

  try {
    const specialPayment = await prisma.specialPayment.findUnique({
      where: { id: id },
    });

    if (!specialPayment) {
      return NextResponse.json(
        { message: "Special payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(specialPayment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update special payment
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid special payment ID" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const validation = UpdateSpecialPaymentSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const updatedSpecialPayment = await prisma.specialPayment.update({
      where: { id: id },
      data: validation.data,
    });

    return NextResponse.json(updatedSpecialPayment);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes("RecordNotFound")) {
      return NextResponse.json(
        { message: "Special payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE special payment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid special payment ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.specialPayment.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Special payment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes("RecordNotFound")) {
      return NextResponse.json(
        { message: "Special payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
