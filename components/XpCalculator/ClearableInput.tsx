"use client";
import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ClearableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear: () => void;
  showClearButton?: boolean;
}

const ClearableInput = forwardRef<HTMLInputElement, ClearableInputProps>(
  ({ value, onChange, onClear, showClearButton, ...props }, ref) => {
    const t = useTranslations("GuideContent");
    
    return (
      <div className="mb-1 relative flex items-center">
        <Input
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
          className={`appearance-none w-full px-4 py-6 bg-[#2D3839] border border-[#3A4A4B] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7FF98] text-left ${
            props.className || ""
          }`}
        />
        {showClearButton && value && (
          <motion.button
            onClick={onClear}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 p-1 rounded-full hover:bg-[#3A4A4B] transition-colors"
            aria-label={t("calculator.clear_field")}
          >
            <X className="h-5 w-5 text-gray-400" />
          </motion.button>
        )}
      </div>
    );
  }
);

ClearableInput.displayName = "ClearableInput";

export { ClearableInput };
