import { useMemo } from "react";
import { CheckSquare, HelpCircle, Plug, Settings, Sparkles, Target, Users } from "lucide-react";
import { AGENT_BY_ID } from "@/lib/roster";
import { PRODUCTS, PRODUCT_STAGES } from "@/lib/portfolio";
import { useFirma } from "@/lib/store";
import { brl, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ROOM_LABELS: Record<string, string> = {
  oto: "Operações",
  nia: "Aquisição",
  lia: "Conteúdo",
  max: "Vendas",
  ana: "Atendimento",
  eva: "Financeiro",
};

const STATUS: Record<string, string> = {
  idle: "No café",
  walking: "A caminho",
  working: "Trabalhando",
  waiting: "Aguardando",
  blocked: "Travado",
};

const STATION_POSITIONS: Record<string, { left: string; top: string; tone: string }> = {
  oto: { left: "12%", top: "22%", tone: "station-pink" },
  nia: { left: "39%", top: "19%", tone: "station-green" },
  lia: { left: "66%", top: "22%", tone: "station-yellow" },
  max: { left: "18%", top: "61%", tone: "station-yellow" },
  ana: { left: "45%", top: "64%", tone: "station-pink" },
  eva: { left: "72%", top: "61%", tone: "station-green" },
};

export function SimpleHeader({
  onOpenApprovals,
  onOpenAdmin,
  onOpenPlaybook,
  onOpenSettings,
}: {
  onOpenApprovals: () => void;
  onOpenAdmin: () => void;
  onOpenPlaybook: () => void;
  onOpenSettings: () => void;
}) {
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const selectProduct = useFirma((s) => s.selectProduct);
  const metrics = useFirma((s) => s.metrics);
  const product = PRODUCTS.find((item) => item.id === selectedProductId) ?? PRODUCTS[0];

  return (
    <header className="simple-header">
      <div className="brand-lockup">
        <div className="brand-pixel">F</div>
        <div>
          <div className="brand-name">FIRMA</div>
          <div className="brand-subtitle">seu escritório digital</div>
        </div>
      </div>
      <label className="product-picker">
        <span>Você está trabalhando em</span>
        <select aria-label="Produto em foco" value={selectedProductId} onChange={(e) => selectProduct(e.target.value)}>
          {PRODUCTS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <div className="header-stats" aria-label="Resumo do dia">
        <span><b>{metrics.leads}</b> leads</span>
        <span><b>{brl(metrics.receita)}</b> receita</span>
      </div>
      <div className="header-actions">
        <Button className="pixel-button pixel-button-yellow" onClick={onOpenApprovals}><CheckSquare /> Aprovar</Button>
        <Button className="pixel-button pixel-button-blue" onClick={onOpenAdmin}><Plug /> Conectar</Button>
        <Button variant="ghost" className="help-button" onClick={onOpenPlaybook} aria-label="Como usar o FIRMA"><HelpCircle /></Button>
        <Button variant="ghost" className="help-button" onClick={onOpenSettings} aria-label="Configurações"><Settings /></Button>
      </div>
      <div className="selected-product-chip"><span className="status-dot" /> {product.name} · {PRODUCT_STAGES[product.stage]}</div>
    </header>
  );
}

export function WelcomeStrip({ onOpenApprovals, onOpenAdmin }: { onOpenApprovals: () => void; onOpenAdmin: () => void }) {
  const guidanceEnabled = useFirma((s) => s.guidanceEnabled);
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const product = PRODUCTS.find((item) => item.id === selectedProductId) ?? PRODUCTS[0];
  if (!guidanceEnabled) return null;
  return (
    <section className="welcome-strip">
      <div>
        <p className="eyebrow"><Sparkles size={14} /> hoje no escritório</p>
        <h1>O que vamos fazer com <span>{product.name}</span>?</h1>
        <p className="welcome-copy">Escolha uma pessoa no mapa ou use um dos botões abaixo. O FIRMA acompanha o próximo passo.</p>
      </div>
      <div className="welcome-actions">
        <Button className="pixel-button pixel-button-purple" onClick={onOpenApprovals}><Sparkles /> Criar rascunho com IA</Button>
        <Button className="pixel-button pixel-button-green" onClick={onOpenAdmin}><Plug /> Ver conexões</Button>
      </div>
    </section>
  );
}

export function PixelOffice() {
  const agents = useFirma((s) => s.agents);
  const selected = useFirma((s) => s.selected);
  const select = useFirma((s) => s.select);
  const guidanceEnabled = useFirma((s) => s.guidanceEnabled);
  const rooms = useMemo(() => ["oto", "nia", "lia", "max", "ana", "eva"], []);
  return (
    <section className="office-card">
      <div className="section-heading"><div><p className="eyebrow"><Users size={14} /> pessoas do FIRMA</p><h2>Mapa do escritório</h2></div>{guidanceEnabled ? <span className="hint-bubble">Clique em alguém para conversar</span> : null}</div>
      <div className="pixel-office" role="list" aria-label="Funcionários do FIRMA">
        <div className="room-wall room-wall-back" /><div className="room-wall room-wall-side" />
        <div className="office-window window-one" /><div className="office-window window-two" />
        <div className="room-prop prop-sofa"><i /><i /><i /></div><div className="room-prop prop-plant"><i /><b /></div>
        <div className="room-prop prop-coffee"><i /><b /></div><div className="office-rug" />
        {rooms.map((id) => {
          const def = AGENT_BY_ID[id as keyof typeof AGENT_BY_ID];
          const live = agents.find((item) => item.id === id);
          const active = selected === id;
          const position = STATION_POSITIONS[id];
          return (
            <button key={id} type="button" role="listitem" style={{ left: position.left, top: position.top }} onClick={() => select(active ? null : def.id)} className={cn("office-station", position.tone, active && "pixel-agent-active")}>
              <span className="room-sign">{ROOM_LABELS[id]}</span>
              <span className="desk"><i className="desk-screen" /><i className="desk-keyboard" /><i className="desk-leg desk-leg-left" /><i className="desk-leg desk-leg-right" /></span>
              <span className={cn("agent-avatar", live?.status === "working" && "avatar-bounce")}><img src={def.sprite} alt="" draggable={false} /></span>
              <span className="agent-name"><i className={cn("status-dot", live?.status === "working" ? "dot-green" : live?.status === "blocked" ? "dot-red" : "dot-yellow")} />{def.name}</span>
              <span className="agent-status">{STATUS[live?.status ?? "idle"]}</span>
            </button>
          );
        })}
      </div>
      <div className="office-legend"><span><i className="status-dot dot-green" /> trabalhando</span><span><i className="status-dot dot-yellow" /> aguardando</span><span><i className="status-dot dot-red" /> precisa de ajuda</span></div>
    </section>
  );
}

export function EasyGuide() {
  const guidanceEnabled = useFirma((s) => s.guidanceEnabled);
  const tasks = useFirma((s) => s.tasks);
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const activeTasks = tasks.filter((task) => task.productId === selectedProductId && task.column !== "entregue").slice(0, 4);
  if (!guidanceEnabled) return <aside className="easy-sidebar"><section className="today-card"><div className="section-heading compact"><div><p className="eyebrow">tarefas de hoje</p><h2>Em andamento</h2></div><span className="count-pill">{activeTasks.length}</span></div><div className="task-list">{activeTasks.length === 0 ? <p className="empty-copy">Nenhuma tarefa para este produto ainda.</p> : activeTasks.map((task) => { const owner = AGENT_BY_ID[task.owner]; return <div className="mini-task" key={task.id}><div className="mini-task-top"><span>{task.title}</span><b>{task.progress}%</b></div><div className="progress-track"><i style={{ width: `${task.progress}%` }} /></div><small>{owner.name} · {task.column === "producao" ? "produção" : task.column}</small></div>; })}</div></section></aside>;
  return (
    <aside className="easy-sidebar">
      <section className="guide-card">
        <p className="eyebrow"><Target size={14} /> caminho rápido</p>
        <h2>Comece por aqui</h2>
        <ol className="guide-steps">
          <li className="step-done"><b>1</b><span>Escolha o produto no topo</span></li>
          <li><b>2</b><span>Clique em uma pessoa no mapa</span></li>
          <li><b>3</b><span>Converse ou mande uma ordem</span></li>
          <li><b>4</b><span>Revise em “Aprovar”</span></li>
        </ol>
      </section>
      <section className="today-card">
        <div className="section-heading compact"><div><p className="eyebrow">tarefas de hoje</p><h2>Em andamento</h2></div><span className="count-pill">{activeTasks.length}</span></div>
        <div className="task-list">
          {activeTasks.length === 0 ? <p className="empty-copy">Nenhuma tarefa para este produto ainda.</p> : activeTasks.map((task) => {
            const owner = AGENT_BY_ID[task.owner];
            return <div className="mini-task" key={task.id}><div className="mini-task-top"><span>{task.title}</span><b>{task.progress}%</b></div><div className="progress-track"><i style={{ width: `${task.progress}%` }} /></div><small>{owner.name} · {task.column === "producao" ? "produção" : task.column}</small></div>;
          })}
        </div>
      </section>
      <div className="tip-card"><span className="tip-icon">?</span><p><b>Dica:</b> se não souber o que pedir, converse com <strong>Oto</strong>. Ele organiza o trabalho e encaminha para a pessoa certa.</p></div>
    </aside>
  );
}
