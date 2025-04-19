import React from "react";
import { motion } from "framer-motion";
import { animations } from "./animations";

const CalculatorHeader: React.FC = () => {
  return (
    <>
      <motion.h2
        {...animations.fadeIn}
        className="text-center text-white text-2xl font-bold mt-6"
      >
        Калькулятор discord-поинтов
      </motion.h2>
      <motion.p
        {...animations.fadeIn}
        transition={{ delay: 0.1 }}
        className="text-center my-4 text-gray-300"
      >
        Напиши на сервере в #op-commands команду /rank, узнай точное
        количество XP и введи сюда
      </motion.p>
    </>
  );
};

export default React.memo(CalculatorHeader); 