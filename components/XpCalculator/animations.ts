export const animations = {
  fadeIn: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
  },
  slideIn: {
    initial: { opacity: 0, width: 0 },
    animate: { opacity: 1, width: "auto" },
  },
  expand: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
  },
} as const;
