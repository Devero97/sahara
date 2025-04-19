import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface XpProgressBarProps {
  currentXp: number;
  nextLevelXp: number;
  currentLevel: number;
  progress: number;
  messagesToNextLevel: number;
  t: (key: string, params?: Record<string, any>) => string;
}

export const XpProgressBar = ({
  currentXp,
  nextLevelXp,
  currentLevel,
  progress,
  messagesToNextLevel,
  t
}: XpProgressBarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверка, если мы в браузере
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  return (
    <div className="mt-2 mb-4">
      <div className="flex justify-between mb-2">
        <div className="text-white font-bold">
          {t("calculator.level")} {currentLevel}
        </div>
        <div className="flex space-x-2 items-center">
          <span className="text-[var(--color-text-secondary)] text-sm">
            {t("calculator.xp_count", { currentXp: currentXp.toLocaleString(), nextLevelXp: nextLevelXp.toLocaleString() })}
          </span>
          {messagesToNextLevel > 0 && (
            <span className="text-xs text-[var(--color-text-muted)] bg-[rgb(var(--color-dark-base))]/50 px-1.5 py-0.5 rounded">
              {messagesToNextLevel.toLocaleString()} {t("message")}
            </span>
          )}
        </div>
      </div>
      <div className="h-5 rounded-full overflow-hidden bg-[#222C2D] relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: isMobile ? 0 : 0.8, ease: "easeOut" }}
          className="h-full rounded-full absolute top-0 left-0 bg-yellow"
          style={{ willChange: "transform" }}
        />
      </div>
    </div>
  );
};
