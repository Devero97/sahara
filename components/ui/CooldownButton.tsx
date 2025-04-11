import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CooldownButtonProps extends ButtonProps {
  isOnCooldown?: boolean;
  cooldownDuration?: number;
  cooldownColor?: string;
}

const CooldownButton = React.forwardRef<HTMLButtonElement, CooldownButtonProps>(
  ({ 
    isOnCooldown = false, 
    cooldownDuration = 1500, 
    cooldownColor = "rgb(var(--color-accent-yellow))",
    children,
    disabled,
    variant,
    className,
    ...props 
  }, ref) => {
    // Применяем темный фон для кнопки в состоянии кулдауна
    const cooldownClass = isOnCooldown ? 
      "bg-[rgb(58,74,75)] hover:bg-[rgb(58,74,75)] text-[rgb(var(--color-text-secondary))]" : "";
    
    return (
      <div className="relative">
        <Button 
          ref={ref} 
          disabled={disabled || isOnCooldown}
          variant={isOnCooldown ? undefined : variant}
          className={cn(cooldownClass, className)}
          {...props}
        >
          <span className="relative z-[5]">{children}</span>
        </Button>

        {isOnCooldown && (
          <motion.div 
            key={`cooldown-${Date.now()}`}
            className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none rounded-md overflow-hidden"
          >
            <motion.div
              className="h-full w-full"
              style={{
                backgroundColor: "rgb(80, 100, 102)", // Светлее чем основной фон кнопки
                transformOrigin: 'left',
                opacity: 0.5, // Добавляем прозрачность, чтобы текст был виден
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ 
                duration: cooldownDuration / 1000, 
                ease: 'linear' 
              }}
            />
          </motion.div>
        )}
      </div>
    );
  }
);

CooldownButton.displayName = "CooldownButton";

export { CooldownButton }; 