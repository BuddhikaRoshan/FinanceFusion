import { useState } from "react";
import { motion } from "framer-motion";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);

  const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "LKR"]; // Add more currencies here

  const fetchConversionRate = async () => {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await res.json();
    const rate = data.rates[toCurrency];
    setConvertedAmount(amount * rate);
  };

  const handleConversion = () => {
    fetchConversionRate();
  };

  return (
    <motion.div
      className="bg-gray-100 p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Currency Converter</h2>
      <div className="space-y-4">
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <span className="text-gray-800">to</span>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Convert
        </button>
        {convertedAmount !== null && (
          <div className="mt-4">
            <p className="text-lg text-gray-800">
              {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CurrencyConverter;
