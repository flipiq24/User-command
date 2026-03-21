import { useState } from "react";
import { useLeaderboard } from "@/hooks/use-flipiq";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { formatHealthColor, formatHealthBg } from "@/lib/utils";
import { Trophy, Loader2, Search } from "lucide-react";

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading, refetch } = useLeaderboard();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const filtered = leaderboard?.filter(entry => 
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (entry.org_name && entry.org_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onRefresh={refetch} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Global Leaderboard
              </h1>
              <p className="text-muted-foreground mt-1">Ranking of all active Acquisition Associates.</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Filter by name or org..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm w-64 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <Card className="overflow-hidden border-border/50 shadow-2xl shadow-black/10">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Rank</th>
                    <th className="px-6 py-4 font-semibold">Associate</th>
                    <th className="px-6 py-4 font-semibold">Phase/Day</th>
                    <th className="px-6 py-4 font-semibold text-right">Calls</th>
                    <th className="px-6 py-4 font-semibold text-right">Connected</th>
                    <th className="px-6 py-4 font-semibold text-right">Offers</th>
                    <th className="px-6 py-4 font-semibold text-right">Acquired</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-display font-bold text-lg text-muted-foreground">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${formatHealthBg(entry.health)}`}></div>
                          <div>
                            <p className="font-bold text-foreground">{entry.name}</p>
                            <p className="text-xs text-muted-foreground">{entry.org_name || 'No Org'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">Phase {entry.phase}</span>
                        <span className="text-muted-foreground ml-1">Day {entry.day_number}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                        {entry.total_calls || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-primary/80">
                        {entry.total_calls_connected || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-health-orange">
                        {entry.total_offers || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-health-green">
                        {entry.total_acquired || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
}
