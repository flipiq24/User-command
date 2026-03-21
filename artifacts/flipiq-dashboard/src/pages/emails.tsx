import { useState } from "react";
import { useEmails, useForwardEmailMutation, useUpdateEmailStatusMutation } from "@/hooks/use-flipiq";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Send, XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function EmailsPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: emails, isLoading, refetch } = useEmails(today);
  const forwardMutation = useForwardEmailMutation();
  const statusMutation = useUpdateEmailStatusMutation();
  const { toast } = useToast();

  const handleForward = (id: number) => {
    forwardMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Email forwarded successfully", description: "AgentMail will process this shortly." });
      }
    });
  };

  const handleSkip = (id: number) => {
    statusMutation.mutate({ id, data: { status: 'skipped' } }, {
      onSuccess: () => {
        toast({ title: "Email skipped", description: "This email will not be sent." });
      }
    });
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const draftEmails = emails?.filter(e => e.status === 'draft') || [];
  const processedEmails = emails?.filter(e => e.status !== 'draft') || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onRefresh={refetch} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Coaching Emails</h1>
              <p className="text-muted-foreground mt-1">Review and forward Claude-generated coaching emails.</p>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-primary/20">
              <Mail className="w-5 h-5" />
              {draftEmails.length} Pending Review
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground border-b border-border/50 pb-2">
              <AlertTriangle className="w-5 h-5 text-health-orange" />
              Needs Action
            </h2>
            
            {draftEmails.length === 0 ? (
              <div className="text-center p-12 bg-secondary/20 rounded-2xl border border-dashed border-border">
                <CheckCircle2 className="w-12 h-12 text-health-green mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium text-foreground">All caught up!</p>
                <p className="text-muted-foreground">No draft emails require your attention right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {draftEmails.map(email => (
                  <EmailCard 
                    key={email.id} 
                    email={email} 
                    onForward={() => handleForward(email.id)}
                    onSkip={() => handleSkip(email.id)}
                    isPending={forwardMutation.isPending || statusMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>

          {processedEmails.length > 0 && (
            <div className="space-y-6 pt-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-2">
                <CheckCircle2 className="w-5 h-5" />
                Processed Today
              </h2>
              <div className="space-y-4 opacity-70">
                {processedEmails.map(email => (
                  <EmailCard key={email.id} email={email} readOnly />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function EmailCard({ email, onForward, onSkip, isPending, readOnly }: any) {
  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
      <div className="bg-secondary/40 p-4 border-b border-border/50 flex justify-between items-center">
        <div>
          <p className="font-semibold text-foreground text-lg">To: {email.to_name}</p>
          <p className="text-sm text-muted-foreground">Subject: {email.subject}</p>
        </div>
        <div className="flex items-center gap-3">
          {email.is_escalation && <Badge variant="destructive">ESCALATION</Badge>}
          <Badge variant="outline" className="capitalize">{email.status}</Badge>
        </div>
      </div>
      <div className="p-6 text-sm text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">
        {email.body}
      </div>
      <div className="p-4 bg-secondary/20 border-t border-border/50 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/70">Root Cause Detected:</span> {email.root_cause || 'None specified'}
      </div>
      {!readOnly && (
        <div className="p-4 bg-background border-t border-border flex justify-end gap-3">
          <Button variant="ghost" onClick={onSkip} disabled={isPending} className="text-muted-foreground hover:text-destructive">
            <XCircle className="w-4 h-4 mr-2" /> Skip
          </Button>
          <Button onClick={onForward} disabled={isPending} className="shadow-primary/20">
            <Send className="w-4 h-4 mr-2" /> Forward Email
          </Button>
        </div>
      )}
    </Card>
  );
}
