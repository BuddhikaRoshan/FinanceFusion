"use client";

import { IncomeList } from "@/components/icomes/IncomeList";
import Navbar from "@/components/Navbar";
import { getIncomesByUserId } from "@/services/income.service";
import { Income } from "@prisma/client";
import React, { useEffect, useState, useMemo } from "react";

const IncomesPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedUserId = localStorage.getItem("userId");

        if (!storedUserId) {
          setIsLoading(false);
          setError("User ID not found. Please log in again.");
          return;
        }

        setUserId(storedUserId);

        const fetchedIncomes = await getIncomesByUserId(storedUserId);
        setIncomes(fetchedIncomes);
      } catch (err) {
        console.error("Failed to fetch incomes:", err);
        setError("Failed to load incomes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const memoizedIncomes = useMemo(() => incomes, [incomes]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading incomes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userId) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4 max-w-md">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error || "User ID not found. Please log in again."}</p>
            </div>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-8 lg:p-16">
        <h1 className="text-2xl font-bold mb-6">My Incomes</h1>
        <IncomeList initialIncomes={memoizedIncomes} userId={userId} />
      </div>
    </div>
  );
};

export default IncomesPage;
