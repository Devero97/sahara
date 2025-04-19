import { motion } from "framer-motion";
import Image from "next/image";

interface RoleMilestoneCardProps {
  role: string;
  level: number;
  color: string;
  progress: number;
  messagesNeeded: number;
  iconPath: string;
  t: (key: string, params?: Record<string, unknown>) => string;
}

export const RoleMilestoneCard = ({
  role,
  level,
  color,
  progress,
  messagesNeeded,
  iconPath,
  t
}: RoleMilestoneCardProps) => {
  // Получение локализованного названия роли напрямую через функцию перевода
  const localizedRole = t(`calculator.roles.${role.toLowerCase()}`);

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-3 rounded-md"
    style={{ backgroundColor: `${color}20` }}
  >
    <div className="flex items-center mb-3">
      <div className="mr-4 flex items-center">
        <Image
          src={iconPath}
            alt={localizedRole || role}
          width={56}
          height={56}
          className="w-12 h-12"
        />
      </div>
      <div>
        <div className="font-bold text-white">
            {t("calculator.to_next_level", { role: localizedRole, level })}
        </div>
        <div className="font-bold" style={{ color }}>
          {t("calculator.messages_count", { count: messagesNeeded.toLocaleString() })}
        </div>
      </div>
    </div>
    <div className="h-2 bg-[#222C2D] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </motion.div>
);
};

export default RoleMilestoneCard;
