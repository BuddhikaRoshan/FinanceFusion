import { useState } from "react";
import { motion } from "framer-motion";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "LKR"];

  const fetchConversionRate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await res.json();
      const rate = data.rates[toCurrency];
      setConvertedAmount(amount * rate);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversion = () => {
    if (amount > 0) {
      fetchConversionRate();
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Currency Converter
        </span>
      </h2>

      <div className="space-y-4">
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg w-full bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Amount"
            min="0"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <span className="text-gray-400">to</span>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConversion}
          disabled={isLoading || amount <= 0}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Converting...
            </span>
          ) : (
            "Convert"
          )}
        </button>

        {convertedAmount !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-gray-700/50 rounded-lg"
          >
            <p className="text-lg font-medium text-white">
              {amount} {fromCurrency} ={" "}
              <span className="text-blue-400">
                {convertedAmount.toFixed(2)}
              </span>{" "}
              {toCurrency}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CurrencyConverter;
