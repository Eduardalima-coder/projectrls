import { useEffect, useState } from "react";
import { BookOpen, ClipboardCheck, Settings2, ShieldCheck, X } from "lucide-react";
import { brl, compact } from "@/lib/utils";
import { useFirma } from "@/lib/store";
import { PRODUCTS, PRODUCT_STAGES } from "@/lib/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar({
  onOpenBrief,
  onOpenPlaybook,
  onOpenApprovals,
  onOpenAdmin,
}: {
  onOpenBrief: () => void;
  onOpenPlaybook: () => void;
  onOpenApprovals: () => void;
  onOpenAdmin: () => void;
}) {
  const metrics = useFirma((s) => s.metrics);
  const company = useFirma((s) => s.briefing.company);
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const selectProduct = useFirma((s) => s.selectProduct);
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  );

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-border bg-surface px-4 py-3">
      <div className="min-w-0">
        <p className="font-serif text-xl leading-none tracking-tight text-fg">{company}</p>
        <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-subtle">
          Operação digital · {clock}
        </p>
      </div>
      <dl className="ml-auto flex items-center gap-3 sm:gap-5">
        <label className="hidden min-w-40 sm:block">
          <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">Produto em foco</span>
          <select
            aria-label="Infoproduto ativo"
            value={selectedProductId}
            onChange={(e) => selectProduct(e.target.value)}
            className="mt-0.5 block w-full border-0 bg-transparent p-0 text-xs text-fg outline-none"
          >
            {PRODUCTS.map((product) => <option key={product.id} value={product.id}>{product.name} · {PRODUCT_STAGES[product.stage]}</option>)}
          </select>
        </label>
        <Stat label="Leads" value={compact(metrics.leads)} />
        <Stat label="Receita" value={brl(metrics.receita)} />
        <Stat label="Peças" value={compact(metrics.conteudos)} className="hidden sm:block" />
        <Stat label="Deals" value={compact(metrics.deals)} className="hidden sm:block" />
      </dl>
      <label className="order-last block w-full sm:hidden">
        <span className="sr-only">Produto em foco no celular</span>
        <select
          aria-label="Infoproduto ativo no celular"
          value={selectedProductId}
          onChange={(e) => selectProduct(e.target.value)}
          className="block w-full border-t border-border bg-transparent pt-2 text-xs text-fg outline-none"
        >
          {PRODUCTS.map((product) => <option key={product.id} value={product.id}>{product.name} · {PRODUCT_STAGES[product.stage]}</option>)}
        </select>
      </label>
      <Button variant="ghost" size="icon" onClick={onOpenPlaybook} aria-label="Manual de operação">
        <BookOpen />
      </Button>
      <Button variant="ghost" size="icon" onClick={onOpenApprovals} aria-label="Aprovações rápidas">
        <ClipboardCheck />
      </Button>
      <Button variant="ghost" size="icon" onClick={onOpenAdmin} aria-label="Auxiliar administrativo">
        <ShieldCheck />
      </Button>
      <Button variant="ghost" size="icon" onClick={onOpenBrief} aria-label="Briefing da firma">
        <Settings2 />
      </Button>
    </header>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="font-mono text-xs uppercase tracking-widest text-subtle">{label}</dt>
      <dd className="font-mono text-sm tabular-nums text-fg">{value}</dd>
    </div>
  );
}

export function BriefSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const briefing = useFirma((s) => s.briefing);
  const setBriefing = useFirma((s) => s.setBriefing);
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/60 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-serif text-2xl text-fg">Briefing</h2>
        <p className="mt-1 text-sm text-muted">
          Os agentes usam isso como contexto da firma.
        </p>
        <label className="mt-4 block text-xs text-subtle">Nome</label>
        <Input
          className="mt-1"
          value={briefing.company}
          onChange={(e) => setBriefing({ company: e.target.value })}
        />
        <label className="mt-3 block text-xs text-subtle">Oferta</label>
        <Input
          className="mt-1"
          value={briefing.offer}
          onChange={(e) => setBriefing({ offer: e.target.value })}
        />
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}

export function PlaybookSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/70 p-3 sm:items-center sm:p-6">
      <section className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        <header className="flex items-start gap-3 border-b border-border p-5">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs uppercase tracking-widest text-subtle">FIRMA / manual interno</p>
            <h2 className="mt-1 font-serif text-2xl text-fg">Como fazer a operação trabalhar</h2>
            <p className="mt-1 text-sm text-muted">Passe este fluxo ao time no primeiro dia. O quadro é a fonte única de verdade.</p>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose} aria-label="Fechar manual">
            <X />
          </Button>
        </header>
        <div className="min-h-0 overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <PlaybookCard title="1. Briefing obrigatório" tone="accent">
              Antes de pedir qualquer entrega, abra o ícone de ajustes e preencha nome da empresa e oferta. Em seguida, o responsável envia contexto, público, prazo, canal e critério de pronto.
            </PlaybookCard>
            <PlaybookCard title="2. Uma ordem = uma entrega" tone="live">
              Use a barra inferior com verbos concretos: “Lia, escreva 3 roteiros para captar clínicas em outubro, entregar amanhã às 10h”. Não misture cinco demandas na mesma ordem.
            </PlaybookCard>
            <PlaybookCard title="3. Dono e handoff" tone="wait">
              O Radar encontra a oportunidade; Produto fecha a oferta; Lia roteiriza; Nia testa aquisição; Max cuida da conversão; Ana garante a entrega; Eva fecha dados e caixa. Cada projeto permanece ligado ao infoproduto correto.
            </PlaybookCard>
            <PlaybookCard title="4. Vários produtos, um cérebro" tone="accent">
              Selecione o infoproduto no topo antes de mandar uma ordem. O Segundo Cérebro guarda decisão, hipótese, histórico e pendência sem misturar produto A com produto B.
            </PlaybookCard>
            <PlaybookCard title="5. Aprovação humana" tone="alert">
              A IA pesquisa, prepara roteiros, compara e recomenda. Publicação, anúncio, mensagem, cobrança e mudança de preço continuam como rascunho até revisão humana e registro da decisão.
            </PlaybookCard>
          </div>
          <div className="mt-5 rounded-xl border border-border bg-elevated p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-subtle">Ritual diário · 15 minutos</p>
            <ol className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
              <li><span className="text-fg">09:00</span> — Oto limpa bloqueios e define prioridades.</li>
              <li><span className="text-fg">09:05</span> — Cada dono puxa a próxima tarefa do quadro.</li>
              <li><span className="text-fg">12:00</span> — Max e Ana registram retornos de clientes.</li>
              <li><span className="text-fg">17:30</span> — Eva fecha números; todos registram próximo passo.</li>
            </ol>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-subtle">
            Regra de ouro: toda tarefa precisa ter dono, prazo, entrada, saída esperada e próximo passo. Se faltar uma dessas cinco coisas, a tarefa volta para Briefing.
          </p>
        </div>
      </section>
    </div>
  );
}

function PlaybookCard({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "accent" | "live" | "wait" | "alert";
  children: string;
}) {
  const tones = {
    accent: "border-accent/40",
    live: "border-live/40",
    wait: "border-wait/40",
    alert: "border-alert/40",
  } as const;
  return (
    <article className={`rounded-xl border bg-elevated p-4 ${tones[tone]}`}>
      <h3 className="text-sm text-fg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </article>
  );
}
