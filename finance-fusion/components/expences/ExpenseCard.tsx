// components/ExpenseCard.tsx
import { Expense } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { useState } from "react";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard = ({
  expense,
  onEdit,
  onDelete,
}: ExpenseCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(expense.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format amount to 2 decimal places
  const formattedAmount =
    typeof expense.amount === "number"
      ? expense.amount.toFixed(2)
      : expense.amount;

  // Make sure date is properly formatted
  const formattedDate =
    expense.date instanceof Date
      ? expense.date.toLocaleDateString()
      : new Date(expense.date).toLocaleDateString();

  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-lg">${formattedAmount}</p>
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
            {expense.category}
          </span>
        </div>
        <p className="text-sm text-gray-500">{formattedDate}</p>
        {expense.reason && <p className="text-sm">{expense.reason}</p>}
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => onEdit(expense)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};
