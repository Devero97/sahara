import React from "react";
import { motion } from "framer-motion";
import { animations } from "./animations";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <motion.p {...animations.fadeIn} className="text-red-400 text-sm mb-4">
      {message}
    </motion.p>
  );
};

export default React.memo(ErrorMessage); 