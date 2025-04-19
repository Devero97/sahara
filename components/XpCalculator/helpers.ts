export const getCurrentRole = (level: number): string => {
  if (level < 25) return "Новичок";
  if (level < 50) return "Бронза";
  if (level < 75) return "Серебро";
  if (level < 100) return "Золото";
  return "Платина";
};

export const formatNumber = (num: string): string => {
  const cleaned = num.replace(/\D/g, "");
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
