import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHealthColor(health: string) {
  switch (health) {
    case 'red': return 'text-health-red';
    case 'orange': return 'text-health-orange';
    case 'yellow': return 'text-health-yellow';
    case 'green': return 'text-health-green';
    default: return 'text-muted-foreground';
  }
}

export function formatHealthBg(health: string) {
  switch (health) {
    case 'red': return 'bg-health-red-bg text-health-red';
    case 'orange': return 'bg-health-orange-bg text-health-orange';
    case 'yellow': return 'bg-health-yellow-bg text-health-yellow';
    case 'green': return 'bg-health-green-bg text-health-green';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function formatHealthBorder(health: string) {
  switch (health) {
    case 'red': return 'border-health-red/50';
    case 'orange': return 'border-health-orange/50';
    case 'yellow': return 'border-health-yellow/50';
    case 'green': return 'border-health-green/50';
    default: return 'border-border';
  }
}
