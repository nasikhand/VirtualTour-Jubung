import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "primary-blue-1": "from-primary-mls-blue to-secondary-mls-blue-1 text-grayscale-mls-white bg-gradient-to-b",
        "primary-blue-2": "text-grayscale-mls-white bg-gradient-to-b from-[#2962FF] to-[#1F4ABF] brightness-[0.95]",
        "primary-blue-3": "text-grayscale-mls-white bg-gradient-to-b from-[#2962FF] to-[#1F4ABF] brightness-[0.90]",
        "primary-green-1": "text-grayscale-mls-white bg-gradient-to-b from-[#5FCC14] to-[#4DA610]",
        "primary-green-2": "text-grayscale-mls-white bg-gradient-to-b from-[#5FCC14] to-[#4DA610] brightness-[0.95]",
        "primary-green-3": "text-grayscale-mls-white bg-gradient-to-b from-[#5FCC14] to-[#4DA610] brightness-[0.90]",
        "secondary-blue-1": "bg-grayscale-mls-white text-primary-mls-blue",
        "secondary-blue-2": "bg-[color:hsla(224,100%,58%,0.1)] text-primary-mls-blue",
        "secondary-blue-3": "bg-[color:hsla(224,100%,58%,0.2)] text-primary-mls-blue",
        "secondary-green-1": "bg-grayscale-mls-white text-primary-mls-green",
        "secondary-green-2": "bg-[color:hsla(96,82%,44%,0.1)] text-primary-mls-green",
        "secondary-green-3": "bg-[color:hsla(96,82%,44%,0.2)] text-primary-mls-green",
        "tertiary-blue-1": "bg-grayscale-mls-white text-primary-mls-blue border border-solid border-primary-mls-blue",
        "tertiary-blue-2": "bg-[color:hsla(224,100%,58%,0.1)] text-primary-mls-blue border border-solid border-primary-mls-blue",
        "tertiary-blue-3": "bg-[color:hsla(224,100%,58%,0.2)] text-primary-mls-blue border border-solid border-primary-mls-blue",
        "tertiary-green-1": "bg-grayscale-mls-white text-primary-mls-green border border-solid border-primary-mls-green",
        "tertiary-green-2": "bg-[color:hsla(96,82%,44%,0.1)] text-primary-mls-green border border-solid border-primary-mls-green",
        "tertiary-green-3": "bg-[color:hsla(96,82%,44%,0.2)] text-primary-mls-green border border-solid border-primary-mls-green",
        "disable-1": "border border-grayscale-mls-dark-3 bg-grayscale-mls-white text-grayscale-mls-dark-3",
        "disable-2": "bg-[color:hsla(0,0%,16%,0.1)] border border-grayscale-mls-dark-3 text-grayscale-mls-dark-3",
        "disable-3": "bg-[color:hsla(0,0%,16%,0.2)] border border-grayscale-mls-dark-3 text-grayscale-mls-dark-3",
        "danger-1": "text-grayscale-mls-white bg-[#E74C4C]",
        "danger-2": "text-grayscale-mls-white bg-[#FF3333] brightness-[0.95]",
        "danger-3": "text-grayscale-mls-white bg-[#FF3333] brightness-[0.90]",
        "warning-1": "text-grayscale-mls-white bg-gradient-to-b from-[#FFC533] to-[#D9A72B]",
        "warning-2": "text-grayscale-mls-white bg-[#FFD200] brightness-[0.95]",
        "warning-3": "text-grayscale-mls-white bg-[#FFD200] brightness-[0.90]",
        "success-1": "text-grayscale-mls-white bg-gradient-to-b from-[#4BFF33] to-[#40D92B]",
        "success-2": "text-grayscale-mls-white bg-[#4BFF33] brightness-[0.95]",
        "success-3": "text-grayscale-mls-white bg-[#4BFF33] brightness-[0.90]",
      },
      size: {
        default: "h-9 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
