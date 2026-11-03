import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gold-400 text-ink-950 shadow-[0_10px_30px_-12px_rgba(238,196,106,0.6)] hover:bg-gold-300 hover:shadow-[0_14px_40px_-12px_rgba(238,196,106,0.75)]",
        outline:
          "border border-white/20 bg-transparent text-cream hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-200",
        ghost: "text-cream/75 hover:bg-white/[0.06] hover:text-cream",
        secondary: "bg-white/[0.07] text-cream hover:bg-white/[0.11]",
        destructive: "bg-red-500/90 text-white hover:bg-red-500",
        link: "text-gold-300 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
