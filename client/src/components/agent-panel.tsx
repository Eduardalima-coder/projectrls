import { useState } from "react";
import { X } from "lucide-react";
import { AGENT_BY_ID } from "@/lib/roster";
import { talkToAgent } from "@/lib/chat";
import { useFirma } from "@/lib/store";
import { PRODUCT_BY_ID, PRODUCT_STAGES } from "@/lib/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const STATUS_LABEL = {
  idle: "Pausa no café",
  walking: "A caminho da mesa",
  working: "Na mesa, executando",
  waiting: "Aguardando você",
  blocked: "Travado",
};

export function AgentPanel() {
  const selected = useFirma((s) => s.selected);
  const agents = useFirma((s) => s.agents);
  const tasks = useFirma((s) => s.tasks);
  const chats = useFirma((s) => s.chats);
  const briefing = useFirma((s) => s.briefing);
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const sending = useFirma((s) => s.sending);
  const setSending = useFirma((s) => s.setSending);
  const appendChat = useFirma((s) => s.appendChat);
  const select = useFirma((s) => s.select);
  const [draft, setDraft] = useState("");

  if (!selected) return null;
  const agentId = selected;
  const def = AGENT_BY_ID[agentId];
  const live = agents.find((a) => a.id === agentId);
  const mine = tasks.filter((t) => t.owner === agentId && t.column !== "entregue");
  const thread = chats[agentId] ?? [];
  const product = PRODUCT_BY_ID[selectedProductId];

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const message = draft.trim();
    if (!message || sending) return;
    setDraft("");
    appendChat(agentId, { role: "user", content: message });
    setSending(true);
    try {
      const res = await talkToAgent({
        data: {
          agentId: def.id,
          name: def.name,
          role: def.role,
          persona: def.persona,
          company: briefing.company,
          offer: briefing.offer,
          product: product ? { name: product.name, stage: PRODUCT_STAGES[product.stage], hypothesis: product.hypothesis, next: product.next } : undefined,
          message,
          history: thread,
        },
      });
      appendChat(agentId, {
        role: "assistant",
        content: res.ok
          ? (res.text ?? "O agente não retornou texto.")
          : "Estou offline neste momento. Deixa a ordem no quadro que eu pego.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-30 flex justify-center px-3 lg:inset-auto lg:bottom-4 lg:right-[376px] lg:justify-end">
      <section className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-lg lg:w-[340px]">
        <header className="flex items-start gap-3 p-4 pb-3">
          <img src={def.sprite} alt="" className="h-16 w-10 object-contain" crossOrigin="anonymous" />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg leading-tight text-fg">{def.name}</p>
            <p className="text-xs text-muted">{def.role}</p>
            <Badge className="mt-1.5" tone={live?.status === "working" ? "live" : "neutral"}>
              {STATUS_LABEL[live?.status ?? "idle"]}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => select(null)} aria-label="Fechar">
            <X />
          </Button>
        </header>
        {mine[0] ? (
          <p className="px-4 pb-2 text-xs text-muted">
            Agora: <span className="text-fg">{mine[0].title}</span>
          </p>
        ) : (
          <p className="px-4 pb-2 text-xs text-subtle">Sem tarefa no quadro. Mande uma ordem.</p>
        )}
        {product ? <p className="px-4 pb-2 text-[10px] uppercase tracking-widest text-accent">Produto: {product.name}</p> : null}
        <ScrollArea className="h-36 border-t border-border px-4 py-2">
          {thread.length === 0 ? (
            <p className="text-xs text-subtle">Fale com {def.name}. Responde no tom da firma.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {thread.map((m, i) => (
                <li
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-6 rounded-xl bg-elevated px-2.5 py-1.5 text-xs text-fg"
                      : "mr-6 rounded-xl bg-bg px-2.5 py-1.5 text-xs text-muted"
                  }
                >
                  {m.content}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Falar com ${def.name}`}
            disabled={sending}
            className="h-10"
          />
          <Button type="submit" disabled={sending || !draft.trim()} className="h-10">
            Enviar
          </Button>
        </form>
      </section>
    </div>
  );
}
