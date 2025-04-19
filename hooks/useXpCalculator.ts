import { useState, useEffect, useCallback } from "react";
import { LevelData, CalculatorResult } from "@/components/XpCalculator/types";
import { getCurrentRole } from "@/components/XpCalculator/helpers";
import { CharacterRole } from "@/components/XpCalculator/Bitsy";
import { useTranslations } from "next-intl";

export const useXpCalculator = () => {
  const t = useTranslations("GuideContent");
  const [inputValue, setInputValue] = useState("");
  const [numericValue, setNumericValue] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [levelsData, setLevelsData] = useState<LevelData[]>([]);
  const [roleMilestones, setRoleMilestones] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      import("@/data/levelsData.json").then((mod) =>
        setLevelsData(mod.default)
      ),
      import("@/data/roleMilestones.json").then((mod) =>
        setRoleMilestones(mod.default)
      ),
    ]);
  }, []);

  const handleInputChange = (value: string) => {
    const cleanedValue = value.replace(/[^\d]/g, "");
    const formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    setInputValue(formatted);
    setNumericValue(Number(cleanedValue));
    setResult(null);

    if (cleanedValue) {
      validateInput(Number(cleanedValue));
    } else {
      setError(null);
    }
  };

  const validateInput = (value: number) => {
    if (value < 1 || value > 555489) {
      setError(t("calculator.error_range"));
      return false;
    }
    setError(null);
    return true;
  };

  const calculateLevelData = useCallback(
    (xp: number) => {
      let currentLevel = 1;
      let currentLevelData = levelsData[0];
      let nextLevelData = levelsData[1] || levelsData[0];

      // Находим максимальный уровень, который не превышает введённый XP
      for (let i = 0; i < levelsData.length; i++) {
        if (xp >= levelsData[i].xp) {
          currentLevel = levelsData[i].level;
          currentLevelData = levelsData[i];
          nextLevelData = levelsData[i + 1] || levelsData[i];
        } else {
          break;
        }
      }

      return { currentLevel, currentLevelData, nextLevelData };
    },
    [levelsData]
  );

  const calculateRoleProgress = useCallback(
    (xp: number, currentLevel: number) => {
      return roleMilestones
        .filter((milestone) => milestone.level > currentLevel)
        .map((milestone) => {
          const targetLevelData = levelsData.find(
            (item) => item.level === milestone.level
          );
          const messagesNeeded = targetLevelData
            ? Math.ceil((targetLevelData.xp - xp) / 15)
            : 0;
          const progress = targetLevelData
            ? Math.min(100, (xp / targetLevelData.xp) * 100)
            : 0;

          return { ...milestone, messagesNeeded, progress };
        });
    },
    [levelsData, roleMilestones]
  );

  const calculate = useCallback(() => {
    if (!validateInput(numericValue)) return;

    setIsCalculating(true);
    setResult(null);

    setTimeout(() => {
      const { currentLevel, currentLevelData, nextLevelData } =
        calculateLevelData(numericValue);

      const progress =
        nextLevelData.xp > currentLevelData.xp
          ? ((numericValue - currentLevelData.xp) /
              (nextLevelData.xp - currentLevelData.xp)) *
            100
          : 100;

      const messagesToNextLevel = 
        nextLevelData.xp > numericValue 
          ? Math.ceil((nextLevelData.xp - numericValue) / 15) // Используем 15 XP за сообщение
          : 0;

 

      setResult({
        currentLevel, // Теперь это уровень из levelsData
        currentRole: getCurrentRole(currentLevel) as CharacterRole,
        currentXp: numericValue,
        nextLevelXp: nextLevelData.xp,
        progress,
        roleProgress: calculateRoleProgress(numericValue, currentLevel),
        messagesToNextLevel,
      });
      setIsCalculating(false);
    }, 300);
  }, [numericValue, levelsData, calculateLevelData, calculateRoleProgress]);

  const clearInput = useCallback(() => {
    setInputValue("");
    setNumericValue(0);
    setResult(null);
    setError(null);
  }, []);

  return {
    inputValue,
    result,
    error,
    isCalculating,
    levelsLoaded: levelsData.length > 0,
    handleInputChange,
    calculate,
    clearInput,
  };
};
