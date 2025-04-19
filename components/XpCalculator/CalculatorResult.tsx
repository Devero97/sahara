import React from "react";
import { motion } from "framer-motion";
import { XpProgressBar } from "./XpProgressBar";
import { RoleBadge } from "./RoleBadge";
import { RoleMilestoneCard } from "./RoleMilestoneCard";
import { animations } from "./animations";
import roleIcons from "@/data/roleIcons.json";

interface CalculatorResultProps {
  result: {
    currentXp: number;
    nextLevelXp: number;
    currentLevel: number;
    progress: number;
    currentRole: string;
    roleProgress: Array<{
      level: number;
      role: string;
      progress: number;
      color: string;
      messagesNeeded: number;
    }>;
  };
}

const CalculatorResult: React.FC<CalculatorResultProps> = ({ result }) => {
  return (
    <motion.div
      key={`result-${result.currentXp}`}
      {...animations.expand}
      className="bg-[#2D3839] rounded-lg border border-[#3A4A4B] overflow-hidden"
    >
      <div className="p-6">
        <XpProgressBar
          currentXp={result.currentXp}
          nextLevelXp={result.nextLevelXp}
          currentLevel={result.currentLevel}
          progress={result.progress}
        />

        <RoleBadge
          role={result.currentRole}
          title={result.currentRole}
          iconPath={roleIcons[result.currentRole as keyof typeof roleIcons]}
          className="mb-4"
        />

        <div className="space-y-4">
          {result.roleProgress.map((role) => (
            <RoleMilestoneCard
              key={`${role.level}-${role.role}`}
              level={role.level}
              role={role.role}
              progress={role.progress}
              iconPath={roleIcons[role.role as keyof typeof roleIcons]}
              color={role.color}
              messagesNeeded={role.messagesNeeded}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(CalculatorResult); 