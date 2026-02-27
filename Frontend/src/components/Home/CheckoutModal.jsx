import { useState } from "react";
import { motion } from "framer-motion";

const CheckoutModal = ({ isOpen, onClose, credits, price }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-[400px] relative"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-purple-600 text-sm font-medium text-center">
          Email Validation & Scoring
        </h3>
        <h2 className="text-2xl font-bold text-center mb-6">Pay as You Go</h2>

        <a href="#" className="text-purple-600 text-sm mb-4 block text-center">
          Have a promo code?
        </a>

        <div className="flex justify-between items-center border rounded-lg px-4 py-3 mb-6">
          <span className="font-medium">{credits} credits</span>
          <span className="font-semibold">${price}</span>
        </div>

        <p className="text-gray-500 text-xs mb-6 text-center">
          Prices shown in USD.
        </p>

        <div className="flex gap-3">
          <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
            Credit Card
          </button>
          <button className="flex-1 border py-3 rounded-lg font-semibold hover:bg-gray-100">
            PayPal
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
