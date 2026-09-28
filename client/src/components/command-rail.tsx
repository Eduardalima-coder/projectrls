import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { AGENT_BY_ID, type AgentId } from "@/lib/roster";
import { interpretOrder } from "@/lib/chat";
import { routeAndTitle, useFirma } from "@/lib/store";
import { PRODUCT_BY_ID, PRODUCT_STAGES } from "@/lib/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function isAgentId(value: string): value is AgentId {
  return value in AGENT_BY_ID;
}

export function CommandRail() {
  const [value, setValue] = useState("");
  const sending = useFirma((s) => s.sending);
  const setSending = useFirma((s) => s.setSending);
  const issueOrder = useFirma((s) => s.issueOrder);
  const pushLog = useFirma((s) => s.pushLog);
  const briefing = useFirma((s) => s.briefing);
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const product = PRODUCT_BY_ID[selectedProductId];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const order = value.trim();
    if (!order || sending) return;
    setValue("");
    pushLog("you", order);
    setSending(true);
    const local = routeAndTitle(order);
    try {
      const res = await interpretOrder({
        data: {
          order,
          company: briefing.company,
          offer: briefing.offer,
          product: product ? { name: product.name, stage: PRODUCT_STAGES[product.stage], hypothesis: product.hypothesis, next: product.next } : undefined,
        },
      });
      const agentId = res.agentId;
      if (res.ok && agentId !== undefined && isAgentId(agentId)) {
        issueOrder(res.title || local.title, agentId, res.reply);
      } else {
        issueOrder(local.title, local.owner);
      }
    } catch {
      issueOrder(local.title, local.owner);
      toast("Ordem despachada sem o cérebro da firma.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 border-t border-border bg-surface px-3 py-3 sm:px-4"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Mande a firma trabalhar — um reel, leads, uma proposta…"
        disabled={sending}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={sending || !value.trim()} aria-label="Enviar ordem">
        <ArrowUp />
      </Button>
    </form>
  );
}
