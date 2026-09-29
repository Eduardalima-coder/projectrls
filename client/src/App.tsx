import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AgentPanel } from "@/components/agent-panel";
import { ApprovalPanel } from "@/components/approval-panel";
import { AdminCenter } from "@/components/admin-center";
import { BriefSheet, PlaybookSheet } from "@/components/top-bar";
import { EasyGuide, PixelOffice, SimpleHeader, WelcomeStrip } from "@/components/simple-office";
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
      <div className="firma-app">
        <SimpleHeader onOpenApprovals={() => setApprovalsOpen(true)} onOpenAdmin={() => setAdminOpen(true)} onOpenPlaybook={() => setPlaybookOpen(true)} />
        <main className="firma-main">
          <WelcomeStrip onOpenApprovals={() => setApprovalsOpen(true)} onOpenAdmin={() => setAdminOpen(true)} />
          <div className="workspace-grid">
            <PixelOffice />
            <EasyGuide />
          </div>
        </main>
        <AgentPanel />
        <BriefSheet open={briefOpen} onClose={() => setBriefOpen(false)} />
        <PlaybookSheet open={playbookOpen} onClose={() => setPlaybookOpen(false)} />
        <ApprovalPanel open={approvalsOpen} onClose={() => setApprovalsOpen(false)} />
        <AdminCenter open={adminOpen} onClose={() => setAdminOpen(false)} />
        <Toaster theme="light" position="top-center" toastOptions={{ style: { background: "#ffffff", border: "2px solid #2c2c3e", color: "#24233a" } }} />
      </div>
    </TooltipProvider>
  );
}
