import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AgentPanel } from "@/components/agent-panel";
import { ApprovalPanel } from "@/components/approval-panel";
import { AdminCenter } from "@/components/admin-center";
import { CommandRail } from "@/components/command-rail";
import { OfficeView } from "@/components/office-view";
import { SideDock } from "@/components/side-dock";
import { BriefSheet, PlaybookSheet, TopBar } from "@/components/top-bar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirma } from "@/lib/store";

export default function App() {
  const tick = useFirma((s) => s.tick);
  const markHydrated = useFirma((s) => s.markHydrated);
  const [briefOpen, setBriefOpen] = useState(false);
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [approvalsOpen, setApprovalsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    void useFirma.persist.rehydrate();
    markHydrated();
  }, [markHydrated]);

  useEffect(() => {
    let id = 0;
    let acc = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += dt;
      if (acc >= 2.6) {
        acc = 0;
        tick(now);
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [tick]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative flex h-dvh flex-col overflow-hidden bg-bg">
        <TopBar onOpenBrief={() => setBriefOpen(true)} onOpenPlaybook={() => setPlaybookOpen(true)} onOpenApprovals={() => setApprovalsOpen(true)} onOpenAdmin={() => setAdminOpen(true)} />
        <div className="relative flex min-h-0 flex-1">
          <OfficeView />
          <SideDock />
          <AgentPanel />
        </div>
        <CommandRail />
        <BriefSheet open={briefOpen} onClose={() => setBriefOpen(false)} />
        <PlaybookSheet open={playbookOpen} onClose={() => setPlaybookOpen(false)} />
        <ApprovalPanel open={approvalsOpen} onClose={() => setApprovalsOpen(false)} />
        <AdminCenter open={adminOpen} onClose={() => setAdminOpen(false)} />
        <Toaster theme="dark" position="top-center" toastOptions={{ style: { background: "var(--color-elevated)", border: "1px solid var(--color-border)", color: "var(--color-fg)" } }} />
      </div>
    </TooltipProvider>
  );
}
