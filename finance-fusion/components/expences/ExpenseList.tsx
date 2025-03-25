import { Expense } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/services/expense.service";
import { useState } from "react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { expenseSchema } from "@/schemas/expense.schema";
import { z } from "zod";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseCard } from "./ExpenseCard";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface ExpenseListProps {
  initialExpenses: Expense[];
  userId: string;
}

export const ExpenseList = ({ initialExpenses, userId }: ExpenseListProps) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<string>("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredExpenses = expenses.filter((expense) =>
    expense.category.toLowerCase().includes(filter.toLowerCase())
  );

  const refreshExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/expenses?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error refreshing expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateExpense = async (
    data: z.infer<typeof expenseSchema>
  ) => {
    try {
      setIsLoading(true);
      if (editingExpense) {
        await updateExpense(editingExpense.id, data);
        toast.success("Expense updated successfully");
      } else {
        await createExpense({ ...data, userId });
        toast.success("Expense created successfully");
      }
      setIsDialogOpen(false);
      setEditingExpense(null);
      await refreshExpenses();
    } catch (error) {
      console.error(error);
      toast.error("Error saving expense");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      setIsLoading(true);
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);
    autoTable(doc, {
      startY: 40,
      head: [["Amount ($)", "Category", "Date", "Reason"]],
      body: filteredExpenses.map((expense) => [
        expense.amount.toFixed(2),
        expense.category,
        new Date(expense.date).toLocaleDateString(),
        expense.reason || "",
      ]),
    });
    doc.save("expenses.pdf");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-2">
          <Button
            onClick={generatePDF}
            variant="outline"
            disabled={isLoading || filteredExpenses.length === 0}
          >
            Generate PDF
          </Button>
          <Button
            onClick={refreshExpenses}
            variant="outline"
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <ExpenseForm
                onSubmit={handleCreateOrUpdateExpense}
                defaultValues={editingExpense || undefined}
                userId={userId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center my-4"
        >
          Loading...
        </motion.div>
      )}
      {!isLoading && filteredExpenses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center my-4 p-8 border border-dashed rounded-lg"
        >
          {filter
            ? "No expenses match your filter"
            : "No expenses yet. Add your first expense!"}
        </motion.div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
      >
        <AnimatePresence>
          {filteredExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <ExpenseCard
                expense={expense}
                onEdit={() => {
                  setEditingExpense(expense);
                  setIsDialogOpen(true);
                }}
                onDelete={handleDeleteExpense}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};