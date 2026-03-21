import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/20 text-primary border border-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground border border-border",
        destructive:
          "bg-destructive/20 text-health-red border border-health-red/30",
        outline: "text-foreground border border-border",
        red: "bg-health-red-bg text-health-red border border-health-red/30",
        orange: "bg-health-orange-bg text-health-orange border border-health-orange/30",
        yellow: "bg-health-yellow-bg text-health-yellow border border-health-yellow/30",
        green: "bg-health-green-bg text-health-green border border-health-green/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
