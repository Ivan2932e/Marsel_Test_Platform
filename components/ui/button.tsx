"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-tight transition-[transform,background-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-cream hover:bg-ink-soft hover:-translate-y-0.5 shadow-[0_8px_24px_-12px_rgba(42,39,36,0.4)] hover:shadow-[0_16px_36px_-12px_rgba(42,39,36,0.5)]",
        ghost:
          "bg-transparent text-ink border border-ink/15 hover:bg-ink/[0.04] hover:border-ink/30",
        sage:
          "bg-sage text-cream hover:bg-sage-deep hover:-translate-y-0.5 shadow-[0_8px_24px_-12px_rgba(95,111,88,0.5)]",
        link: "text-ink underline-offset-4 hover:underline rounded-none px-0",
      },
      size: {
        default: "h-12 px-7 text-[15px]",
        lg: "h-14 px-9 text-base",
        sm: "h-10 px-5 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
