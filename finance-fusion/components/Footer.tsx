import { motion } from "framer-motion";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 bg-opacity-90 shadow-md mt-10 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              FinanceFusion
            </span>
            <span className="text-sm text-gray-400">© 2025 FinanceFusion, All Rights Reserved</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-x-4"
          >
            <a
              href="/About"
              className="text-sm text-gray-300 hover:text-blue-600 transition-colors"
            >
              About Us
            </a>
            <a
              href="/Contact"
              className="text-sm text-gray-300 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
            <a
              href="/Privacy"
              className="text-sm text-gray-300 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/Terms"
              className="text-sm text-gray-300 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
