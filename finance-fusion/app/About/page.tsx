"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Add Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            About FinanceFusion
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            FinanceFusion is your AI-powered personal finance assistant, designed to help you manage your income and expenses effortlessly. With smart analytics and a voice & text-enabled chatbot, we simplify financial tracking for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-blue-400 mb-3">
                {feature.title}
              </h2>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

const features = [
  { title: "Our Vision", description: "Empower individuals with AI-powered financial insights, enabling smarter money management for a stress-free future." },
  { title: "Our Mission", description: "To provide a seamless, interactive, and intuitive financial tracking experience using voice recognition, chatbot assistance, and smart analytics." },
  { title: "AI-Powered Insights", description: "Leverage AI-driven analytics to gain financial insights and improve your money management." },
  { title: "Voice-Enabled Assistant", description: "Interact with FinanceFusion using voice commands for seamless financial tracking." },
  { title: "Smart Text Chatbot", description: "Ask questions, track expenses, and get instant financial guidance via chat." },
  { title: "Expense Management", description: "Easily track and categorize your expenses for better financial control." },
  { title: "Budgeting Tools", description: "Set monthly budgets, track your spending, and receive alerts when you're nearing your budget limit." },
  { title: "Financial Reports", description: "Generate monthly income, expense, and balance reports to gain a clear picture of your financial health." },
  { title: "Prediction & AI Coach", description: "AI-driven predictions help you anticipate future expenses and optimize financial planning." },
];

export default AboutUs;