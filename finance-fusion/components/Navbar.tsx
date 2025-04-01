"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if userId exists in localStorage
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  return (
    <nav className="bg-gray-900 bg-opacity-90 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 flex items-center"
            >
              <Link href="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                  FinanceFusion
                </span>
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex space-x-4"
            >
              {isLoggedIn ? (
                <>
                  <Link
                    href="/challenges"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Challenges
                  </Link>
                  <Link
                    href="/special-payments"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Special Payments
                  </Link>
                  <Link
                    href="/chat-bot"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Chatbot
                  </Link>
                  <Link
                    href="/expenses"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Expenses
                  </Link>
                  <Link
                    href="/income"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Income
                  </Link>
                  <Link
                    href="/profile"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
