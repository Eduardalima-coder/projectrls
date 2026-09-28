import { useMemo, useState } from "react";
import { Check, FileText, RotateCcw, Send, ShieldAlert, X } from "lucide-react";
import { useFirma } from "@/lib/store";
import { DRAFT_CHANNEL_LABELS, type ApprovalStatus } from "@/lib/approvals";
import { PRODUCT_BY_ID } from "@/lib/portfolio";
import { generateDraftWithAI } from "@/lib/chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const STATUS_LABEL: Record<ApprovalStatus, string> = { pending: "Aguardando", approved: "Aprovado", changes: "Ajustes", rejected: "Rejeitado" };

export function ApprovalPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const drafts = useFirma((s) => s.drafts);
  const approvals = useFirma((s) => s.approvals);
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const createDraft = useFirma((s) => s.createDraft);
  const addGeneratedDraft = useFirma((s) => s.addGeneratedDraft);
  const requestApproval = useFirma((s) => s.requestApproval);
  const decideApproval = useFirma((s) => s.decideApproval);
  const [filter, setFilter] = useState<"all" | "pending" | "drafts">("pending");
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const visibleDrafts = useMemo(() => drafts.filter((draft) => filter === "all" || (filter === "drafts" && draft.status !== "approved") || (filter === "pending" && approvals.some((approval) => approval.draftId === draft.id && approval.status === "pending"))), [drafts, approvals, filter]);
  const selectedDraft = drafts.find((draft) => draft.id === selectedDraftId) ?? visibleDrafts[0];
  const selectedApproval = approvals.find((approval) => approval.draftId === selectedDraft?.id && approval.status === "pending");
  const generateAI = async () => {
    const product = PRODUCT_BY_ID[selectedProductId];
    if (!product) return;
    setGenerating(true);
    const result = await generateDraftWithAI({ data: { product: { id: product.id, name: product.name, category: product.category, promise: product.promise, stage: product.stage, hypothesis: product.hypothesis, next: product.next }, channel: "roteiro", audience: product.category, objective: product.next } });
    setGenerating(false);
    if (result.ok && result.draft) {
      addGeneratedDraft({ productId: product.id, owner: "lia", channel: "roteiro", ...result.draft });
      setFilter("drafts");
    }
  };
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-bg/75 p-3 sm:items-center sm:p-6">
      <section className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        <header className="flex items-start gap-3 border-b border-border p-5">
          <div className="min-w-0 flex-1"><p className="font-mono text-xs uppercase tracking-widest text-subtle">FIRMA / governança</p><h2 className="mt-1 font-serif text-2xl text-fg">Rascunhos e aprovação rápida</h2><p className="mt-1 text-sm text-muted">A automação cria e organiza. O botão de decisão libera apenas a versão e o escopo revisados.</p></div>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose} aria-label="Fechar aprovações"><X /></Button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <aside className="w-full border-b border-border p-4 md:w-[360px] md:border-b-0 md:border-r"><div className="flex items-center gap-2"><Button size="sm" variant={filter === "pending" ? "default" : "secondary"} onClick={() => setFilter("pending")}>Fila ({approvals.filter((item) => item.status === "pending").length})</Button><Button size="sm" variant={filter === "drafts" ? "default" : "secondary"} onClick={() => setFilter("drafts")}>Rascunhos</Button></div><Button className="mt-3 w-full" variant="outline" onClick={() => createDraft(selectedProductId)}><FileText /> Gerar rascunho do produto em foco</Button><Button className="mt-2 w-full" variant="secondary" disabled={generating} onClick={generateAI}><FileText /> {generating ? "IA redigindo…" : "Gerar com IA para revisão"}</Button><ScrollArea className="mt-4 h-[38dvh] pr-2 md:h-[52dvh]"><div className="flex flex-col gap-2">{visibleDrafts.length === 0 ? <p className="rounded-xl border border-dashed border-border p-4 text-sm text-subtle">Nada nesta fila. Gere um rascunho ou troque o filtro.</p> : visibleDrafts.map((draft) => { const approval = approvals.find((item) => item.draftId === draft.id); return <button key={draft.id} type="button" onClick={() => setSelectedDraftId(draft.id)} className={`rounded-xl border p-3 text-left ${selectedDraft?.id === draft.id ? "border-accent bg-elevated" : "border-border bg-elevated/50"}`}><div className="flex items-start justify-between gap-2"><p className="text-sm text-fg">{draft.title}</p><Badge tone={approval?.status === "pending" ? "wait" : draft.status === "approved" ? "live" : "neutral"}>{approval ? STATUS_LABEL[approval.status] : "Rascunho"}</Badge></div><p className="mt-1 text-xs text-muted">{PRODUCT_BY_ID[draft.productId]?.name ?? "Produto"} · {DRAFT_CHANNEL_LABELS[draft.channel]} · v{draft.version}</p></button> })}</div></ScrollArea></aside>
          <main className="min-h-0 flex-1 overflow-y-auto p-5">{selectedDraft ? <><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs uppercase tracking-widest text-accent">{PRODUCT_BY_ID[selectedDraft.productId]?.name}</p><h3 className="mt-1 font-serif text-2xl text-fg">{selectedDraft.title}</h3><p className="mt-1 text-xs text-muted">{DRAFT_CHANNEL_LABELS[selectedDraft.channel]} · versão {selectedDraft.version} · responsável {selectedDraft.owner}</p></div><Badge tone={selectedDraft.risk === "alto" ? "alert" : selectedDraft.risk === "médio" ? "wait" : "live"}>{selectedDraft.risk} risco</Badge></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Info label="Hipótese" value={selectedDraft.hypothesis} /><Info label="CTA" value={selectedDraft.cta} /><Info label="Fonte" value={selectedDraft.source} /><Info label="Estado" value={selectedDraft.status === "in_review" ? "Em revisão humana" : selectedDraft.status === "approved" ? "Aprovado para execução manual" : "Rascunho automático"} /></div><article className="mt-4 rounded-xl border border-border bg-bg p-4"><p className="font-mono text-xs uppercase tracking-widest text-subtle">Prévia do rascunho</p><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg">{selectedDraft.body}</p></article>{selectedApproval ? <div className="mt-4 rounded-xl border border-wait/40 bg-elevated p-4"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 text-wait" /><div className="min-w-0 flex-1"><p className="text-sm text-fg">Pacote de aprovação · {selectedApproval.scope}</p><p className="mt-1 text-xs text-muted">Público: {selectedApproval.audience} · Orçamento: {selectedApproval.budget} · Janela: {selectedApproval.window}</p><ul className="mt-3 grid gap-1 text-xs text-muted sm:grid-cols-2">{selectedApproval.checklist.map((item) => <li key={item}>□ {item}</li>)}</ul><div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => decideApproval(selectedApproval.id, "approved")}><Check /> Aprovar versão</Button><Button size="sm" variant="secondary" onClick={() => decideApproval(selectedApproval.id, "changes", "Revisar antes de executar") }><RotateCcw /> Pedir ajustes</Button><Button size="sm" variant="outline" onClick={() => decideApproval(selectedApproval.id, "rejected", "Não aprovado neste ciclo")}><X /> Rejeitar</Button></div></div></div></div> : <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-elevated p-4"><p className="flex-1 text-sm text-muted">Este material ainda não está na fila. Solicite uma aprovação para criar o escopo auditável.</p><Button size="sm" onClick={() => requestApproval(selectedDraft.id)}><Send /> Solicitar aprovação</Button></div>}</> : <p className="text-sm text-subtle">Selecione um rascunho na fila.</p>}</main>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-border bg-elevated p-3"><p className="font-mono text-[10px] uppercase tracking-widest text-subtle">{label}</p><p className="mt-1 text-sm leading-relaxed text-fg">{value}</p></div>; }
