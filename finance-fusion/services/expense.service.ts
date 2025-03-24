import { expenseSchema } from "@/schemas/expense.schema";
import { Expense } from "@prisma/client";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create a new expense
export const createExpense = async (
  expenseData: z.infer<typeof expenseSchema>
): Promise<Expense> => {
  try {
    // Validate data before sending
    const validData = expenseSchema.parse(expenseData);

    const response = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create expense");
    }

    return response.json();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  }
};

// Get all expenses for a user
export const getExpensesByUserId = async (
  userId: string
): Promise<Expense[]> => {
  const response = await fetch(`${API_URL}/expenses?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return response.json();
};

// Update an expense
export const updateExpense = async (
  id: string,
  expenseData: Partial<z.infer<typeof expenseSchema>>
): Promise<Expense> => {
  try {
    // Create a partial schema for updates
    const updateSchema = expenseSchema.partial();
    const validData = updateSchema.parse(expenseData);

    const response = await fetch(`${API_URL}/expenses?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update expense");
    }

    return response.json();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/expenses?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete expense");
  }
};
