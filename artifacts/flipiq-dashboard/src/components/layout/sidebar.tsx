import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Mail, Trophy, Activity, Settings } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Mail, label: "Coaching Emails", href: "/emails" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-foreground leading-tight">FlipIQ CSM</h1>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Morning Review</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="block">
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "text-primary-foreground bg-primary/10" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                <span className="font-medium relative z-10">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            RA
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Ramy A.</p>
            <p className="text-xs text-muted-foreground">CSM Lead</p>
          </div>
        </div>
      </div>
    </div>
  );
}
