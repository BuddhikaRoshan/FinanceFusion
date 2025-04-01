"use client";
import React from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CurrencyConverter from "../components/currencyConverter";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Navigation Bar */}
      <Navbar />



      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              FinanceFusion
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Text and Voice-Enabled Expense and Income Management with Smart
            Analytics
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="bg-black bg-opacity-70 backdrop-blur rounded-xl shadow-xl p-6 md:p-8 mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Financial Health Predictor
              </h2>
              <p className="text-gray-300">
                Our advanced machine learning system predicts your financial
                health over the next 6-12 months based on your spending
                patterns, income, and savings.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
              Get Started for Free
            </button>
            <button className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Existing Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              Expense Tracking
            </h3>
            <p className="text-gray-300">
              Add, update, and delete expenses with ease. Our system validates
              all data entries and checks for duplicates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              Income Management
            </h3>
            <p className="text-gray-300">
              Track all your income sources in one place. Generate monthly
              reports and source-wise breakdowns.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              Smart Analytics
            </h3>
            <p className="text-gray-300">
              Get personalized insights and automated categorization of
              transactions for better financial planning.
            </p>
          </motion.div>

          {/* New Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              Financial Reports
            </h3>
            <p className="text-gray-300">
              Generate comprehensive financial reports, including monthly
              income, expense, and balance sheets to gain a clear picture of
              your financial status.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              Goal Setting
            </h3>
            <p className="text-gray-300">
              Set and track financial goals such as saving for a vacation,
              buying a home, or creating an emergency fund, with progress
              reports to keep you motivated.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              Budgeting Tools
            </h3>
            <p className="text-gray-300">
              Set monthly budgets, track your spending, and receive alerts when
              you're nearing your budget limit.
            </p>
          </motion.div>
        </div>
        <main className="py-10 ">
          <div className="max-w-2xl mx-auto px-6 space-y-12 ">
            {/* Currency Converter Section */}
            <section >
              <h2 className="text-2xl font-semibold text-white dark:text-white mb-6 ">
                Currency Converter
              </h2>
              <CurrencyConverter />
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;
