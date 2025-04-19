"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export type CharacterRole =
  | "Новичок"
  | "Бронза"
  | "Серебро"
  | "Золото"
  | "Платина";

interface CharacterProps {
  role?: CharacterRole;
  getLocalizedRole?: (role: string) => string;
}

export const Character = ({ role = "Новичок", getLocalizedRole }: CharacterProps) => {
  const getImagePath = () => {
    switch (role) {
      case "Бронза":
        return "/bronze.svg";
      case "Серебро":
        return "/silver.svg";
      case "Золото":
        return "/gold.svg";
      case "Платина":
        return "/platinum.svg";
      default:
        return "/novice.svg";
    }
  };

  const displayRole = getLocalizedRole ? getLocalizedRole(role) : role;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={getImagePath()}
          alt={displayRole}
          width={96}
          height={96}
          className="mx-auto"
          priority={role === "Новичок"} // Предзагрузка только базового изображения
        />
      </motion.div>
    </AnimatePresence>
  );
};
