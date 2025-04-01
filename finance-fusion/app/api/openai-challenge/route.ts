import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ObjectId } from "bson";
import { CreateChallengeSchema } from "@/schemas/challenge";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { userId } = await req.json();

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Valid user ID is required" },
        { status: 400 }
      );
    }

    // Fetch user's financial data
    const [expenses, incomes] = await Promise.all([
      prisma.expense.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 100, // Limit to recent 100 expenses
      }),
      prisma.income.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 50, // Limit to recent 50 incomes
      }),
    ]);

    if (expenses.length === 0 && incomes.length === 0) {
      return NextResponse.json(
        { error: "Not enough financial data to generate challenges" },
        { status: 400 }
      );
    }

    // Prepare data for OpenAI
    const financialSummary = {
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
      totalIncome: incomes.reduce((sum, i) => sum + i.amount, 0),
      expenseCategories: Array.from(new Set(expenses.map((e) => e.category))),
      frequentExpenses: expenses.slice(0, 5).map((e) => ({
        amount: e.amount,
        category: e.category,
        date: e.date.toISOString().split("T")[0],
        reason: e.reason || "",
      })),
      recentIncomes: incomes.slice(0, 3).map((i) => ({
        amount: i.amount,
        source: i.source,
        date: i.date.toISOString().split("T")[0],
      })),
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a financial advisor that creates personalized saving challenges based on user's financial data.
          
          Analyze the user's expenses and incomes and suggest 3 practical challenges that would help them save money.
          
          Return a JSON array of challenge objects with these fields:
          - challenge (string, required): The challenge description (e.g., "Reduce dining out expenses by 30% this month")
          - challengeEnd (string in YYYY-MM-DD format): Suggested end date for the challenge
          
          Guidelines:
          1. Make challenges specific to the user's spending patterns
          2. Suggest realistic timeframes (1 week to 3 months)
          3. Focus on their largest expense categories
          4. Include one income-related challenge if possible
          5. Make challenges measurable and actionable
          
          Example response:
          [
            {
              "challenge": "Limit coffee shop purchases to twice per week",
              "challengeEnd": "2023-12-31"
            },
            {
              "challenge": "Save 15% of each paycheck this month",
              "challengeEnd": "2023-12-31"
            }
          ]`,
        },
        {
          role: "user",
          content: JSON.stringify(financialSummary),
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const parsedContent = JSON.parse(content);
    const suggestedChallenges = parsedContent.challenges || parsedContent;

    if (
      !Array.isArray(suggestedChallenges) ||
      suggestedChallenges.length === 0
    ) {
      throw new Error("Invalid challenges format from OpenAI");
    }

    // Save challenges to database
    const savedChallenges = await Promise.all(
      suggestedChallenges.map(async (challenge) => {
        const baseChallenge = {
          challenge: challenge.challenge,
          challengeEnd: challenge.challengeEnd
            ? new Date(challenge.challengeEnd)
            : null,
          userId,
        };

        // Validate against our schema
        const validatedChallenge = CreateChallengeSchema.parse(baseChallenge);

        // Save to database
        const savedChallenge = await prisma.challenge.create({
          data: {
            challenge: validatedChallenge.challenge,
            challengeEnd: validatedChallenge.challengeEnd,
            userId: validatedChallenge.userId,
          },
        });

        return savedChallenge;
      })
    );

    return NextResponse.json(savedChallenges, { status: 201 });
  } catch (error) {
    console.error("Error generating challenges:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate challenges",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
