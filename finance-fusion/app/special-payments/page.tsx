"use client";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface SpecialPayment {
  id: string;
  paidAmount: number;
  paidDate: Date;
  reason?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpecialPaymentPage = () => {
  const [payments, setPayments] = useState<SpecialPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<SpecialPayment[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Partial<SpecialPayment>>(
    {
      paidAmount: 0,
      paidDate: new Date(),
      reason: "",
      userId: localStorage.getItem("userId")!,
    }
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch all special payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/special-payments");
        if (!response.ok) throw new Error("Failed to fetch payments");
        const data = await response.json();
        setPayments(
          data.filter(
            (payment: SpecialPayment) =>
              payment.userId === localStorage.getItem("userId")
          )
        );
        setFilteredPayments(data);
      } catch (error) {
        toast.error("Error loading payments");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on search term
  useEffect(() => {
    const filtered = payments.filter((payment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.reason?.toLowerCase().includes(searchLower) ||
        payment.paidAmount.toString().includes(searchLower) ||
        format(new Date(payment.paidDate), "PPP")
          .toLowerCase()
          .includes(searchLower)
      );
    });
    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPayment((prev) => ({
      ...prev,
      [name]: name === "paidAmount" ? parseFloat(value) : value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!currentPayment.paidAmount || currentPayment.paidAmount <= 0) {
      toast.error("Payment amount must be positive");
      return false;
    }
    if (!currentPayment.paidDate) {
      toast.error("Payment date is required");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const url = isEditMode
        ? `/api/special-payments/${currentPayment.id}`
        : "/api/special-payments";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paidAmount: currentPayment.paidAmount,
          reason: currentPayment.reason,
          paidDate: currentPayment.paidDate?.toISOString(),
          userId: localStorage.getItem("userId"),
        }),
      });

      if (!response.ok) throw new Error("Operation failed");

      const data = await response.json();
      toast.success(
        isEditMode
          ? "Payment updated successfully"
          : "Payment created successfully"
      );

      // Update local state
      if (isEditMode) {
        setPayments((prev) =>
          prev.map((p) => (p.id === currentPayment.id ? data : p))
        );
      } else {
        setPayments((prev) => [...prev, data]);
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error processing payment");
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/special-payments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Payment deleted successfully");
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Error deleting payment");
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentPayment({
      paidAmount: 0,
      paidDate: new Date(),
      reason: "",
    });
    setIsEditMode(false);
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Define colors
    const primaryBlue = "#0d3b66";
    const lightBlue = "#4a90e2";
    const white = "#ffffff";
    const darkGray = "#333333";
    const lightGray = "#f5f5f5";

    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ===== HEADER =====
    doc.setFillColor(primaryBlue);
    doc.rect(0, 0, pageWidth, 30, "F");

    // Company logo as text
    doc.setTextColor(white);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("FinanceFusion", 14, 15);

    // AI Enhanced badge
    doc.setFillColor(lightBlue);
    doc.roundedRect(pageWidth - 70, 8, 60, 14, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(white);
    doc.text("AI ENHANCED", pageWidth - 40, 16, { align: "center" });

    // ===== DOCUMENT TITLE =====
    const title = "Special Payments Report";
    doc.setTextColor(darkGray);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 45);

    // Metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 55);

    // Decorative line
    doc.setDrawColor(primaryBlue);
    doc.setLineWidth(0.5);
    doc.line(14, 60, pageWidth - 14, 60);

    // ===== TABLE =====
    const headers = [["Amount", "Date", "Reason"]];
    const data = filteredPayments.map((payment) => [
      `$${payment.paidAmount.toFixed(2)}`,
      format(new Date(payment.paidDate), "PPP"),
      payment.reason || "-",
    ]);

    autoTable(doc, {
      startY: 70,
      head: headers,
      body: data,
      theme: "grid",
      headStyles: {
        fillColor: primaryBlue,
        textColor: white,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      styles: {
        overflow: "linebreak",
        cellPadding: 5,
      },
      margin: { top: 70, right: 14, bottom: 30, left: 14 },
      didDrawPage: (data) => {
        // Add header to continuation pages if needed
        if (data.pageNumber > 1) {
          doc.setFillColor(primaryBlue);
          doc.rect(0, 0, pageWidth, 20, "F");
          doc.setTextColor(white);
          doc.setFontSize(14);
          doc.text("FinanceFusion - Special Payments Report", 14, 12);
        }

        // ===== FOOTER =====
        doc.setDrawColor(primaryBlue);
        doc.setLineWidth(0.5);
        doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

        doc.setTextColor(primaryBlue);
        doc.setFontSize(10);
        doc.text(
          "FinanceFusion - AI Enhanced Financial Solutions",
          14,
          pageHeight - 15
        );
        doc.text(`Page ${data.pageNumber}`, pageWidth - 14, pageHeight - 15, {
          align: "right",
        });

        doc.setFontSize(8);
        doc.text(
          "This document contains confidential financial information.",
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      },
    });

    // Save the PDF with branded filename
    doc.save("special-payments-report.pdf");
  };

  // Open edit dialog
  const openEditDialog = (payment: SpecialPayment) => {
    setCurrentPayment({
      ...payment,
      paidDate: new Date(payment.paidDate),
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Special Payments</h1>
          <div className="flex gap-4">
            <Button
              onClick={generatePDF}
              variant="outline"
              className="border-gray-700 hover:bg-gray-700/50 text-black"
            >
              Generate PDF
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {isEditMode ? "Edit Payment" : "Add New Payment"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="paidAmount"
                      className="text-right text-white"
                    >
                      Amount
                    </Label>
                    <Input
                      id="paidAmount"
                      name="paidAmount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={currentPayment.paidAmount || ""}
                      onChange={handleInputChange}
                      className="col-span-3 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paidDate" className="text-right text-white">
                      Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !currentPayment.paidDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {currentPayment.paidDate ? (
                            format(currentPayment.paidDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={currentPayment.paidDate}
                          onSelect={(date) =>
                            setCurrentPayment((prev) => ({
                              ...prev,
                              paidDate: date || new Date(),
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right text-white">
                      Reason
                    </Label>
                    <Input
                      id="reason"
                      name="reason"
                      value={currentPayment.reason || ""}
                      onChange={handleInputChange}
                      className="col-span-3 text-white"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSubmit}>
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {searchTerm
                ? "No matching payments found"
                : "No payments recorded yet"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Reason</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      ${payment.paidAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(payment.paidDate), "PPP")}
                    </TableCell>
                    <TableCell>{payment.reason || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(payment.createdAt), "PP")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-700 text-black"
                        onClick={() => openEditDialog(payment)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(payment.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialPaymentPage;
