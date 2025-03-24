const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create a new income
export const createIncome = async (incomeData: {
  amount: number;
  source: string;
  date: Date;
  userId: string;
}) => {
  const response = await fetch(`${API_URL}/incomes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incomeData),
  });

  if (!response.ok) {
    throw new Error("Failed to create income");
  }

  return response.json();
};

// Get all incomes for a user
export const getIncomesByUserId = async (userId: string) => {
  const response = await fetch(`${API_URL}/incomes?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch incomes");
  }

  return response.json();
};

// Update an income
export const updateIncome = async (
  id: string,
  incomeData: {
    amount?: number;
    source?: string;
    date?: Date;
  }
) => {
  const response = await fetch(`${API_URL}/incomes?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incomeData),
  });

  if (!response.ok) {
    throw new Error("Failed to update income");
  }

  return response.json();
};

// Delete an income
export const deleteIncome = async (id: string) => {
  const response = await fetch(`${API_URL}/incomes?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete income");
  }

  return response.json();
};
