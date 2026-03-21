import { format } from "date-fns";
import { Bell, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Topbar({ onRefresh, isRefreshing }: TopbarProps) {
  const today = new Date();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search associates, orgs..." 
            className="pl-9 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Today's Date:</span>
          <span className="font-medium text-foreground">{format(today, "EEEE, MMMM do, yyyy")}</span>
        </div>
        
        <div className="h-6 w-px bg-border"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRefresh}
          className={isRefreshing ? "animate-spin" : ""}
          disabled={isRefreshing}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
        
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-health-red ring-2 ring-background"></span>
        </button>
      </div>
    </header>
  );
}
