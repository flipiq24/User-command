import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  useUserDetail, useUpdateUserMutation, useCreateTaskMutation,
  useTrainingMilestones, useCompleteTrainingMilestoneMutation, useRemoveTrainingMilestoneMutation,
  useTrainingNotes, useCreateTrainingNoteMutation, useTrainingImpact,
} from "@/hooks/use-flipiq";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatHealthBg, formatHealthColor, cn } from "@/lib/utils";
import { Loader2, ArrowLeft, Target, Mail, CheckSquare, Calendar, AlertCircle, Save, Phone, CheckCircle2, GraduationCap, StickyNote, TrendingUp, Info, Check, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid } from 'recharts';
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id, 10);
  const { data, isLoading, refetch } = useUserDetail(userId);
  const updateMutation = useUpdateUserMutation();
  const taskMutation = useCreateTaskMutation();
  const { toast } = useToast();

  const [agenda, setAgenda] = useState("");
  const [isEditingAgenda, setIsEditingAgenda] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskType, setTaskType] = useState<any>("call");
  const [taskNotes, setTaskNotes] = useState("");

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!data || !data.user) return <div>User not found</div>;

  const { user, categories, events, gaps, tasks } = data;

  const handleSaveAgenda = () => {
    updateMutation.mutate({ id: userId, data: { discussion_agenda: agenda } }, {
      onSuccess: () => {
        setIsEditingAgenda(false);
        toast({ title: "Agenda saved" });
      }
    });
  };

  const handleUpdateHealth = (health: any, priority_score: number) => {
    updateMutation.mutate({ id: userId, data: { health, priority_score } }, {
      onSuccess: () => toast({ title: "Status updated" })
    });
  };

  const handleLogTask = (e: React.FormEvent) => {
    e.preventDefault();
    taskMutation.mutate({ data: { user_id: userId, action_type: taskType, notes: taskNotes } }, {
      onSuccess: () => {
        setTaskModalOpen(false);
        setTaskNotes("");
        toast({ title: "Task logged successfully" });
      }
    });
  };

  const radarData = categories?.map(c => ({
    subject: c.category_slug,
    A: c.score,
    fullMark: 3,
  })) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Topbar onRefresh={refetch} />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header Hero */}
        <div className={cn("px-8 py-8 border-b relative overflow-hidden", formatHealthBorder(user.health))}>
          <div className={cn("absolute inset-0 opacity-10", formatHealthBg(user.health))} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">{user.name}</h1>
                  <Badge variant={user.health as any} className="text-sm px-3 py-1 uppercase tracking-widest">{user.health}</Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground font-medium">
                  <span>{user.org_name || 'No Organization'}</span>
                  <span>•</span>
                  <span>Phase {user.phase}</span>
                  <span>•</span>
                  <span>Day {user.day_number}</span>
                </div>
              </div>
              
              <div className="flex gap-3 bg-card/80 backdrop-blur-md p-2 rounded-xl border border-border/50">
                <Button variant="outline" size="sm" onClick={() => handleUpdateHealth('green', 4)}>Set Green</Button>
                <Button variant="outline" size="sm" onClick={() => handleUpdateHealth('yellow', 3)}>Set Yellow</Button>
                <Button variant="outline" size="sm" onClick={() => handleUpdateHealth('orange', 2)}>Set Orange</Button>
                <Button variant="outline" size="sm" className="border-health-red/50 hover:bg-health-red/10" onClick={() => handleUpdateHealth('red', 1)}>Set Red</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Goals & Agenda */}
          <div className="space-y-8">
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" /> Daily Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <GoalBar label="Calls" actual={user.today_calls || 0} target={user.goals_calls_per_day || 30} color="bg-primary" />
                <GoalBar label="Offers" actual={user.today_offers || 0} target={user.goals_offers_per_day || 3} color="bg-health-orange" />
                <GoalBar label="Contacts" actual={user.today_texts || 0} target={user.goals_contacts_per_day || 50} color="bg-health-green" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" /> Discussion Agenda
                </CardTitle>
                {!isEditingAgenda ? (
                  <Button variant="ghost" size="sm" onClick={() => { setAgenda(user.discussion_agenda || ""); setIsEditingAgenda(true); }}>Edit</Button>
                ) : (
                  <Button variant="default" size="sm" onClick={handleSaveAgenda} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                {isEditingAgenda ? (
                  <textarea 
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    className="w-full h-32 p-3 bg-secondary/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Notes for next 1:1 call..."
                  />
                ) : (
                  <div className="text-sm whitespace-pre-wrap text-muted-foreground min-h-[4rem]">
                    {user.discussion_agenda || "No agenda set. Click edit to add notes."}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckSquare className="w-5 h-5 text-primary" /> CSM Tasks Log
                </CardTitle>
                <Button size="sm" onClick={() => setTaskModalOpen(true)}>Log Task</Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {tasks && tasks.length > 0 ? tasks.map(t => (
                  <div key={t.id} className="text-sm p-3 bg-secondary/20 rounded-lg border border-border/50 flex justify-between items-start">
                    <div>
                      <span className="font-bold text-foreground capitalize mr-2">{t.action_type}</span>
                      <span className="text-muted-foreground">{t.notes}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(t.completed_at || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No tasks logged today.</p>
                )}
              </CardContent>
            </Card>

            <TrainingMilestonesCard userId={userId} />
            <TrainingNotesCard userId={userId} />
          </div>

          {/* Middle & Right Column: Analytics & Events */}
          <div className="lg:col-span-2 space-y-8">
            <TrainingImpactCard userId={userId} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <CardHeader className="pb-0 border-b border-border/50 bg-secondary/10">
                  <CardTitle className="text-lg">Category Scores</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center pt-4">
                  {radarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm">No category data available.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-lg text-health-red flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Detected Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {gaps && gaps.length > 0 ? gaps.map((gap, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-health-red-bg rounded-lg border border-health-red/20 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-health-red mt-1.5 flex-shrink-0" />
                      <span className="text-foreground/90">{gap.gap_text}</span>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <CheckCircle2 className="w-8 h-8 text-health-green mb-2 opacity-50" />
                      <p>No critical gaps detected.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="border-b border-border/50">
                <CardTitle>Workflow Events (3-Track)</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Event</th>
                      <th className="px-6 py-3 font-semibold">Category</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">Uses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {events?.map(e => (
                      <tr key={e.id} className="hover:bg-secondary/20">
                        <td className="px-6 py-3 font-medium text-foreground">{e.action}</td>
                        <td className="px-6 py-3 text-muted-foreground capitalize">{e.category}</td>
                        <td className="px-6 py-3">
                          <span className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                            e.status === 'active' ? "bg-health-green/20 text-health-green" :
                            e.status === 'cooling' ? "bg-health-yellow/20 text-health-yellow" :
                            e.status === 'gap' ? "bg-health-orange/20 text-health-orange" :
                            "bg-health-red/20 text-health-red"
                          )}>
                            {e.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right text-muted-foreground">{e.use_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
        </div>
      </main>

      {/* Task Modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>Log CSM Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Action Type</label>
                  <select 
                    className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                  >
                    <option value="call">Call AA</option>
                    <option value="text">Text AA</option>
                    <option value="email">Email AA</option>
                    <option value="notify_am">Notify Account Manager</option>
                    <option value="walkthrough">App Walkthrough</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <textarea 
                    required
                    className="w-full h-24 p-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                    placeholder="Brief description of the interaction..."
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setTaskModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={taskMutation.isPending}>
                    {taskMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}

function GoalBar({ label, actual, target, color }: { label: string, actual: number, target: number, color: string }) {
  const percent = Math.min(100, Math.round((actual / (target || 1)) * 100));
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1.5">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{actual} / {target}</span>
      </div>
      <Progress value={percent} indicatorClassName={color} className="h-2.5" />
    </div>
  );
}

function formatHealthBorder(health: string) {
  switch (health) {
    case 'red': return 'border-health-red/50';
    case 'orange': return 'border-health-orange/50';
    case 'yellow': return 'border-health-yellow/50';
    case 'green': return 'border-health-green/50';
    default: return 'border-border';
  }
}

function TrainingMilestonesCard({ userId }: { userId: number }) {
  const { data: milestones, isLoading } = useTrainingMilestones(userId);
  const completeMutation = useCompleteTrainingMilestoneMutation(userId);
  const removeMutation = useRemoveTrainingMilestoneMutation(userId);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const handleToggle = (key: string, completed: boolean) => {
    if (completed) {
      removeMutation.mutate({ userId, key });
    } else {
      completeMutation.mutate({ userId, data: { milestone_key: key } });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="w-5 h-5 text-primary" /> Training Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
            {milestones?.map((m, i) => (
              <div key={m.milestone_key} className="relative flex items-start gap-3 pb-5 last:pb-0">
                <button
                  onClick={() => handleToggle(m.milestone_key, m.completed)}
                  className={cn(
                    "relative z-10 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all -ml-[18px]",
                    m.completed
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-muted-foreground/40 hover:border-primary"
                  )}
                >
                  {m.completed && <Check className="w-3 h-3" />}
                </button>
                <div
                  className="flex-1 min-w-0"
                  onMouseEnter={() => setHoveredKey(m.milestone_key)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium", m.completed ? "text-foreground" : "text-muted-foreground")}>
                      {m.label}
                    </span>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                  </div>
                  {m.completed && m.completed_at && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(m.completed_at).toLocaleDateString()} by {m.completed_by}
                    </p>
                  )}
                  {hoveredKey === m.milestone_key && (
                    <div className="mt-2 p-3 bg-secondary/50 rounded-lg border border-border/50 text-xs text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150">
                      {m.tooltip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TrainingNotesCard({ userId }: { userId: number }) {
  const { data: notes, isLoading } = useTrainingNotes(userId);
  const createMutation = useCreateTrainingNoteMutation(userId);
  const [noteText, setNoteText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    createMutation.mutate(
      { userId, data: { note_text: noteText.trim() } },
      { onSuccess: () => setNoteText("") }
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StickyNote className="w-5 h-5 text-primary" /> Training Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a training observation..."
            className="flex-1 px-3 py-2 text-sm bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="sm" disabled={createMutation.isPending || !noteText.trim()}>
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : notes && notes.length > 0 ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {notes.map((n) => (
              <div key={n.id} className="p-3 bg-secondary/20 rounded-lg border border-border/50">
                <p className="text-sm text-foreground">{n.note_text}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                  <span>{n.created_at ? new Date(n.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  <span>-</span>
                  <span>{n.created_by}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic text-center py-4">No training notes yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function TrainingImpactCard({ userId }: { userId: number }) {
  const { data, isLoading } = useTrainingImpact(userId);

  if (isLoading) return null;
  if (!data || data.milestones_completed === 0) return null;

  const chartData = data.impact.map((item) => ({
    name: item.label.length > 15 ? item.label.substring(0, 15) + '...' : item.label,
    fullName: item.label,
    "Calls Before": item.before_avg_calls,
    "Calls After": item.after_avg_calls,
    "Offers Before": item.before_avg_offers,
    "Offers After": item.after_avg_offers,
  }));

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" /> Training Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Avg Daily Calls</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <RechartsTooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="Calls Before" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="Calls After" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Avg Daily Offers</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <RechartsTooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="Offers Before" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="Offers After" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 justify-center text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted-foreground" />
            <span>Before Milestone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span>After Milestone</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
