import { NextResponse } from "next/server";

import { CreateChallengeSchema } from "@/schemas/challenge";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all challenges
export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(challenges);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new challenge
export async function POST(request: Request) {
  const body = await request.json();
  const validation = CreateChallengeSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const challenge = await prisma.challenge.create({
      data: validation.data,
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
