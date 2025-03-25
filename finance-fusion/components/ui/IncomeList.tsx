import { Income } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  createIncome,
  updateIncome,
  deleteIncome,
} from "@/services/income.service";
import { useState } from "react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { incomeSchema } from "@/schemas/income.schema";
import { z } from "zod";
import { IncomeForm } from "./IncomeForm";
import { IncomeCard } from "./IncomeCard";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface IncomeListProps {
  initialIncomes: Income[];
  userId: string;
}

export const IncomeList = ({ initialIncomes, userId }: IncomeListProps) => {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [filter, setFilter] = useState<string>("");
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredIncomes = incomes.filter((income) =>
    income.source.toLowerCase().includes(filter.toLowerCase())
  );

  const refreshIncomes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/incomes?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIncomes(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error refreshing incomes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateIncome = async (
    data: z.infer<typeof incomeSchema>
  ) => {
    try {
      setIsLoading(true);
      if (editingIncome) {
        await updateIncome(editingIncome.id, data);
        toast.success("Income updated successfully");
      } else {
        await createIncome({ ...data, userId });
        toast.success("Income created successfully");
      }
      setIsDialogOpen(false);
      setEditingIncome(null);
      await refreshIncomes();
    } catch (error) {
      console.error(error);
      toast.error("Error saving income");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income?")) return;
    try {
      setIsLoading(true);
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((income) => income.id !== id));
      toast.success("Income deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete income");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Income Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);
    autoTable(doc, {
      startY: 40,
      head: [["Amount ($)", "Source", "Date"]],
      body: filteredIncomes.map((income) => [
        income.amount.toFixed(2),
        income.source,
        new Date(income.date).toLocaleDateString(),
      ]),
    });
    doc.save("incomes.pdf");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Filter by source"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-2">
          <Button
            onClick={generatePDF}
            variant="outline"
            disabled={isLoading || filteredIncomes.length === 0}
          >
            Generate PDF
          </Button>
          <Button
            onClick={refreshIncomes}
            variant="outline"
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>Add Income</Button>
            </DialogTrigger>
            <DialogContent>
              <IncomeForm
                onSubmit={handleCreateOrUpdateIncome}
                defaultValues={editingIncome || undefined}
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
      {!isLoading && filteredIncomes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center my-4 p-8 border border-dashed rounded-lg"
        >
          {filter
            ? "No incomes match your filter"
            : "No incomes yet. Add your first income!"}
        </motion.div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
      >
        <AnimatePresence>
          {filteredIncomes.map((income) => (
            <motion.div
              key={income.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <IncomeCard
                income={income}
                onEdit={() => {
                  {
                    setEditingIncome(income);
                    setIsDialogOpen(true);
                  }
                }}
                onDelete={handleDeleteIncome}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
