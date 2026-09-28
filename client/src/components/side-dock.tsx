import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AGENT_BY_ID, AGENTS, COLUMNS } from "@/lib/roster";
import { useFirma } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PRODUCT_BY_ID, PRODUCT_STAGES, PRODUCTS, SECTORS, SECOND_BRAIN } from "@/lib/portfolio";

const STATUS_TONE = {
  idle: "neutral" as const,
  walking: "wait" as const,
  working: "live" as const,
  waiting: "wait" as const,
  blocked: "alert" as const,
};

const STATUS_LABEL = {
  idle: "Pausa",
  walking: "A caminho",
  working: "Na mesa",
  waiting: "Aguarda",
  blocked: "Travado",
};

export function SideDock() {
  const tasks = useFirma((s) => s.tasks);
  const log = useFirma((s) => s.log);
  const agents = useFirma((s) => s.agents);
  const selected = useFirma((s) => s.selected);
  const select = useFirma((s) => s.select);
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const selectProduct = useFirma((s) => s.selectProduct);

  return (
    <aside className="hidden h-full min-h-0 w-[360px] shrink-0 flex-col border-l border-border bg-surface lg:flex">
      <Tabs defaultValue="fluxo" className="flex h-full min-h-0 flex-col">
        <div className="p-3 pb-0">
          <TabsList>
            <TabsTrigger value="fluxo">Fluxo</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="atividade">Atividade</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="fluxo" className="min-h-0 flex-1 overflow-hidden p-3 pt-3">
          <ScrollArea className="h-full pr-2">
            <div className="flex flex-col gap-3">
              {COLUMNS.map((col) => {
                const items = tasks.filter((t) => t.column === col.id);
                return (
                  <section key={col.id}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-subtle">
                        {col.label}
                      </h3>
                      <span className="font-mono text-xs text-subtle tabular-nums">{items.length}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {items.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border px-3 py-2 text-xs text-subtle">
                          Vazio
                        </p>
                      ) : (
                        items.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => select(t.owner)}
                            className="rounded-xl border border-border bg-elevated px-3 py-2 text-left"
                          >
                            <p className="text-sm text-fg">{t.title}</p>
                            <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-wider text-accent">{PRODUCT_BY_ID[t.productId]?.name ?? "Portfólio"}</p>
                            <div className="mt-1.5 flex items-center justify-between gap-2">
                              <span className="font-mono text-xs text-muted">
                                {AGENT_BY_ID[t.owner].name}
                              </span>
                              <span className="font-mono text-xs text-subtle tabular-nums">
                                {t.progress}%
                              </span>
                            </div>
                            <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-border">
                              <div
                                className="h-full bg-accent transition-[width] duration-500"
                                style={{ width: `${t.progress}%` }}
                              />
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="portfolio" className="min-h-0 flex-1 overflow-hidden p-3 pt-3">
          <ScrollArea className="h-full pr-2">
            <div className="flex flex-col gap-4">
              <section>
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-subtle">Infoprodutos em paralelo</h3>
                  <span className="font-mono text-xs text-live">{PRODUCTS.length} ativos</span>
                </div>
                <div className="flex flex-col gap-2">
                  {PRODUCTS.map((product) => (
                    <button key={product.id} type="button" onClick={() => selectProduct(product.id)} className={cn("rounded-xl border p-3 text-left transition-colors", selectedProductId === product.id ? "border-accent bg-elevated" : "border-border bg-elevated/50")}>
                      <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm text-fg">{product.name}</p><p className="mt-0.5 text-xs text-muted">{product.category}</p></div><span className="size-2 shrink-0 rounded-full" style={{ background: product.color }} /></div>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{product.promise}</p>
                      <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-subtle"><span>{PRODUCT_STAGES[product.stage]}</span><span>{product.progress}%</span></div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full" style={{ width: `${product.progress}%`, background: product.color }} /></div>
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <div className="mb-2 flex items-baseline justify-between"><h3 className="font-mono text-xs uppercase tracking-widest text-subtle">Setores / mesas</h3><span className="font-mono text-xs text-subtle">roteiro</span></div>
                <div className="grid grid-cols-2 gap-1.5">{SECTORS.map((sector) => <div key={sector.id} className="rounded-lg border border-border bg-bg/50 p-2"><p className="text-xs text-fg">{sector.short}</p><p className="mt-1 text-[10px] leading-snug text-muted">{sector.mission}</p></div>)}</div>
              </section>
              <section className="rounded-xl border border-accent/30 bg-elevated p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Segundo cérebro</p>
                <p className="mt-1 text-xs text-muted">Decisões, histórico e pendências — sem misturar produtos.</p>
                <ul className="mt-3 flex flex-col gap-2">{SECOND_BRAIN.map((item) => <li key={item.text} className="border-t border-border pt-2 first:border-0 first:pt-0"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] tracking-wider text-subtle">{item.kind}</span><span className="text-[10px] text-subtle">{item.at}</span></div><p className="mt-1 text-xs leading-relaxed text-fg">{item.text}</p></li>)}</ul>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="equipe" className="min-h-0 flex-1 overflow-hidden p-3">
          <ScrollArea className="h-full">
            <ul className="flex flex-col gap-1.5">
              {AGENTS.map((def) => {
                const live = agents.find((a) => a.id === def.id);
                return (
                  <li key={def.id}>
                    <button
                      type="button"
                      onClick={() => select(def.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-2 py-2 text-left",
                        selected === def.id ? "border-accent bg-elevated" : "border-border bg-elevated/50",
                      )}
                    >
                      <img src={def.sprite} alt="" className="h-12 w-8 object-contain" crossOrigin="anonymous" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-fg">{def.name}</p>
                        <p className="text-xs text-muted">{def.role}</p>
                      </div>
                      <Badge tone={STATUS_TONE[live?.status ?? "idle"]}>
                        {STATUS_LABEL[live?.status ?? "idle"]}
                      </Badge>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="atividade" className="min-h-0 flex-1 overflow-hidden p-3">
          <ScrollArea className="h-full">
            <ul className="flex flex-col">
              {log.map((item, i) => (
                <li key={item.id}>
                  {i > 0 ? <Separator className="my-2" /> : null}
                  <p className="text-sm text-fg">{item.text}</p>
                  <p className="mt-0.5 font-mono text-xs text-subtle">
                    {item.agentId === "you" ? "Você" : AGENT_BY_ID[item.agentId].name}
                    {" · "}
                    {formatDistanceToNow(item.at, { addSuffix: true, locale: ptBR })}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
