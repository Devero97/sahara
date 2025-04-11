import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[rgb(var(--color-accent-yellow))] text-[rgb(var(--color-dark-base))] hover:bg-[rgb(var(--color-accent-yellow-hover))]",
        secondary: "bg-[rgb(var(--color-dark-card))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-dark-card-hover))]",
        ghost: "hover:bg-[rgb(var(--color-dark-card))] hover:text-[rgb(var(--color-text-primary))]",
        link: "text-[rgb(var(--color-accent-yellow))] underline-offset-4 hover:underline",
        outline: "border border-[rgb(var(--color-dark-card-hover))] bg-transparent hover:bg-[rgb(var(--color-dark-card-hover))] hover:text-[rgb(var(--color-text-primary))]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 