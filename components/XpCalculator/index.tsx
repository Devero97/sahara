"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXpCalculator } from "@/hooks/useXpCalculator";
import roleIcons from "@/data/roleIcons.json";
import { Character } from "./Bitsy";
import { XpProgressBar } from "./XpProgressBar";
import { RoleBadge } from "./RoleBadge";
import { RoleMilestoneCard } from "./RoleMilestoneCard";
import { animations } from "./animations";
import { ClearableInput } from "./ClearableInput";
import { ActionButtons } from "./ActionButtons";
import { useTranslations } from "next-intl";

const XpCalculator: React.FC = () => {
  const t = useTranslations("GuideContent");

  const {
    inputValue,
    result,
    error,
    isCalculating,
    levelsLoaded,
    handleInputChange,
    calculate,
    clearInput,
  } = useXpCalculator();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue && !isCalculating && !result) {
      calculate();
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full mt-4"
      >
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            <Character
              key={result?.currentRole || "Новичок"}
              role={result?.currentRole ?? "Новичок"}
            />
          </AnimatePresence>
        </div>

        <h2 className="text-center text-white text-2xl font-bold mt-6">
          {t("calculator.title")}
        </h2>
        <p className="text-center my-4 text-gray-300">
          {t("calculator.description")}
        </p>

        <ClearableInput
          ref={inputRef}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            levelsLoaded ? t("calculator.input_placeholder") : t("calculator.loading")
          }
          disabled={!levelsLoaded}
          onClear={clearInput}
          showClearButton={true}
        />

        {error && (
          <motion.p
            {...animations.fadeIn}
            className="text-red-400 text-sm mb-4"
          >
            {error}
          </motion.p>
        )}

        <ActionButtons
          hasResult={!!result}
          isLoading={!levelsLoaded}
          isCalculating={isCalculating}
          hasInput={!!inputValue}
          onCalculate={calculate}
          onClear={clearInput}
          calculateText={{
            loading: t("calculator.loading_button"),
            calculating: t("calculator.calculating"),
            default: t("calculator.calculate"),
          }}
          clearText={t("calculator.reset")}
          className="mt-4" // дополнительный класс при необходимости
        />

        <AnimatePresence>
          {result && typeof result.messagesToNextLevel === 'number' && (
            <motion.div
              key={`result-${result.currentXp}`}
              initial={animations.expand.initial}
              animate={animations.expand.animate}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
              className="bg-[#2D3839] rounded-lg border border-[#3A4A4B] overflow-hidden mt-4"
            >
              <div className="p-6">
                <XpProgressBar
                  currentXp={result.currentXp}
                  nextLevelXp={result.nextLevelXp}
                  currentLevel={result.currentLevel}
                  progress={result.progress}
                  messagesToNextLevel={result.messagesToNextLevel}
                  t={t}
                />

                <RoleBadge
                  role={result.currentRole}
                  title={result.currentRole}
                  iconPath={
                    roleIcons[result.currentRole as keyof typeof roleIcons]
                  }
                  className="mb-4"
                  t={t}
                />

                <div className="space-y-4">
                  {result.roleProgress.map((role) => (
                    <RoleMilestoneCard
                      key={`${role.level}-${role.role}`}
                      {...role}
                      iconPath={roleIcons[role.role as keyof typeof roleIcons]}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default XpCalculator;
