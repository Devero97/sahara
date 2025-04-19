"use client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { animations } from "./animations";

interface ActionButtonsProps {
  hasResult: boolean;
  isLoading: boolean;
  isCalculating: boolean;
  hasInput: boolean;
  onCalculate: () => void;
  onClear: () => void;
  calculateText?: {
    loading?: string;
    calculating?: string;
    default?: string;
  };
  clearText?: string;
  className?: string;
}

export const ActionButtons = ({
  hasResult,
  isLoading,
  isCalculating,
  hasInput,
  onCalculate,
  onClear,
  calculateText = {
    loading: "Загрузка...",
    calculating: "Расчет...",
    default: "Рассчитать",
  },
  clearText = "Сбросить",
  className = "",
}: ActionButtonsProps) => (
  <div className={`flex mt-3 gap-3 ${className}`}>
    <motion.div
      whileHover={{
        scale: hasResult ? 1 : 1.02,
        transition: { duration: 0.1 },
      }}
      whileTap={{ scale: hasResult ? 1 : 0.98 }}
      className={hasResult ? "w-full" : "flex-1"}
    >
      <Button
        onClick={onCalculate}
        disabled={isCalculating || !hasInput || hasResult || isLoading}
        className={`w-full py-6 text-base font-bold rounded-md mb-4 transition-colors ${
          hasResult || isLoading
            ? "bg-gray-500 text-gray-300"
            : "bg-[#F7FF98] text-[#222C2D] hover:bg-[#E5EE88] cursor-pointer hover:shadow-md"
        }`}
        aria-busy={isCalculating || isLoading}
      >
        {isLoading
          ? calculateText.loading
          : isCalculating
          ? calculateText.calculating
          : calculateText.default}
      </Button>
    </motion.div>

    <AnimatePresence>
      {hasResult && (
        <motion.div {...animations.slideIn} className="flex-1">
          <Button
            onClick={onClear}
            className="w-full py-6 text-base bg-[#3A4A4B] text-white font-bold rounded-md hover:bg-[#2D3839] mb-4 transition-colors cursor-pointer hover:shadow-md"
          >
            {clearText}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
