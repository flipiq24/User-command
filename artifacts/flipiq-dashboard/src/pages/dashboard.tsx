import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useDashboard } from "@/hooks/use-flipiq";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatHealthColor, formatHealthBg, formatHealthBorder, cn } from "@/lib/utils";
import { Phone, MessageSquare, Mail, Target, Clock, AlertCircle, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboard();
  const [filter, setFilter] = useState<string>("all");

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Failed to load data</h2>
          <button onClick={() => refetch()} className="text-primary hover:underline">Try again</button>
        </div>
      </div>
    );
  }

  const users = data.users || [];
  
  // Sorting: Priority 1 first, then 2, 3, 4
  const sortedUsers = [...users].sort((a, b) => {
    return (a.priority_score || 4) - (b.priority_score || 4);
  });

  const filteredUsers = filter === "all" ? sortedUsers : sortedUsers.filter(u => u.health === filter);

  const stats = {
    total: users.length,
    red: users.filter(u => u.health === 'red').length,
    orange: users.filter(u => u.health === 'orange').length,
    green: users.filter(u => u.health === 'green').length,
    emailsDrafted: data.emails?.filter(e => e.status === 'draft').length || 0,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onRefresh={refetch} isRefreshing={isFetching} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Morning Overview</h1>
              <p className="text-muted-foreground mt-1 text-sm">Review your assigned Acquisition Associates for today.</p>
            </div>
            
            <div className="flex bg-secondary/50 rounded-lg p-1 border border-border/50">
              {['all', 'red', 'orange', 'yellow', 'green'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                    filter === f 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total AAs" value={stats.total} />
            <StatCard title="Critical (Red)" value={stats.red} className="border-health-red/30 bg-health-red/5" valueColor="text-health-red" />
            <StatCard title="At Risk (Orange)" value={stats.orange} className="border-health-orange/30 bg-health-orange/5" valueColor="text-health-orange" />
            <StatCard title="Draft Emails" value={stats.emailsDrafted} icon={<Mail className="w-4 h-4" />} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/users/${user.id}`} className="block">
                  <Card className={cn(
                    "hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-t-4",
                    formatHealthBorder(user.health),
                    user.health === 'red' ? 'health-glow-red' : '',
                    user.health === 'orange' ? 'health-glow-orange' : ''
                  )}>
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-foreground truncate max-w-[180px]">{user.name}</h3>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.org_name || 'No Org'}</p>
                        </div>
                        <Badge variant={user.health as any} className="uppercase font-bold tracking-wider text-[10px]">
                          Phase {user.phase} • Day {user.day_number}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4 mt-auto">
                        <div className="bg-secondary/40 rounded-lg p-2 text-center">
                          <Phone className="w-4 h-4 mx-auto mb-1 text-primary/70" />
                          <p className="text-lg font-bold text-foreground">{user.today_calls || 0}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Calls</p>
                        </div>
                        <div className="bg-secondary/40 rounded-lg p-2 text-center">
                          <MessageSquare className="w-4 h-4 mx-auto mb-1 text-primary/70" />
                          <p className="text-lg font-bold text-foreground">{user.today_texts || 0}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Texts</p>
                        </div>
                        <div className="bg-secondary/40 rounded-lg p-2 text-center">
                          <Target className="w-4 h-4 mx-auto mb-1 text-primary/70" />
                          <p className="text-lg font-bold text-foreground">{user.today_offers || 0}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Offers</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/50 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className={user.today_checkin ? "text-health-green font-medium" : "text-muted-foreground"}>
                            {user.today_checkin ? "Checked In" : "Pending Check-In"}
                          </span>
                        </div>
                        <span className={cn("font-semibold", formatHealthColor(user.health))}>
                          Priority {user.priority_score}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, className, valueColor = "text-foreground" }: { title: string, value: number, icon?: React.ReactNode, className?: string, valueColor?: string }) {
  return (
    <Card className={cn("bg-card/40 border-border/50", className)}>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-display font-bold mt-1", valueColor)}>{value}</p>
        </div>
        {icon && <div className="p-3 bg-secondary rounded-xl text-primary">{icon}</div>}
      </CardContent>
    </Card>
  );
}
