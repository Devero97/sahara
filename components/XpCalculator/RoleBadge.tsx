import Image from "next/image";

interface RoleBadgeProps {
  role: string;
  title: string;
  description?: string;
  iconPath: string;
  className?: string;
  t?: (key: string, params?: Record<string, any>) => string;
}

export const RoleBadge = ({
  role,
  title,
  description,
  iconPath,
  className = "",
  t
}: RoleBadgeProps) => (
  <div className={`flex items-center p-3 bg-[#222C2D] rounded-md ${className}`}>
    <div className="mr-4 flex items-center">
      <Image
        src={iconPath}
        alt={role}
        width={56}
        height={56}
        className="w-12 h-12"
      />
    </div>
    <div>
      <div className="text-sm text-gray-400">{t ? t("calculator.current_role") : "Текущая роль"}</div>
      <div className="text-lg font-bold text-white">
        {t ? t(`calculator.roles.${role.toLowerCase()}`) || title : title}
      </div>
    </div>
  </div>
);

export default RoleBadge;
