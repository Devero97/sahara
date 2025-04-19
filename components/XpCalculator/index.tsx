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
  
  // Создаем типизированную обертку для функции перевода, соответствующую интерфейсам компонентов
  const tWrapper = (key: string, params?: Record<string, unknown>): string => {
    return t(key, params as Record<string, string | number | Date>);
  };

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

  // Функция для получения локализованного названия роли
  const getLocalizedRole = (role: string) => {
    try {
      return t(`calculator.roles.${role.toLowerCase()}`);
    } catch {
      return role;
    }
  };

  const defaultRole = "Новичок";

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
              key={result?.currentRole || defaultRole}
              role={result?.currentRole ?? defaultRole}
              getLocalizedRole={getLocalizedRole}
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
          className="mt-4"
        />

        <AnimatePresence>
          {result && typeof result.messagesToNextLevel === 'number' && (
            <motion.div
              key={`result-${result.currentXp}`}
              initial={animations.expand.initial}
              animate={animations.expand.animate}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
              className=" mt-4"
            >
              <div className="">
                <XpProgressBar
                  currentXp={result.currentXp}
                  nextLevelXp={result.nextLevelXp}
                  currentLevel={result.currentLevel}
                  progress={result.progress}
                  messagesToNextLevel={result.messagesToNextLevel}
                  t={tWrapper}
                />

                <RoleBadge
                  role={result.currentRole}
                  title={getLocalizedRole(result.currentRole)}
                  iconPath={
                    roleIcons[result.currentRole as keyof typeof roleIcons]
                  }
                  className="mb-4"
                  t={tWrapper}
                />

                <div className="space-y-4">
                  {result.roleProgress.map((role) => (
                    <RoleMilestoneCard
                      key={`${role.level}-${role.role}`}
                      {...role}
                      iconPath={roleIcons[role.role as keyof typeof roleIcons]}
                      t={tWrapper}
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
