import { useMemo } from "react";
import { BookOpen, CheckSquare, Coins, HelpCircle, Plug, Settings, ShoppingBag, Users } from "lucide-react";
import { AGENT_BY_ID } from "@/lib/roster";
import { PRODUCTS, PRODUCT_STAGES } from "@/lib/portfolio";
import { useFirma } from "@/lib/store";
import { brl, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PEOPLE = [
  { id: "oto", left: "15%", top: "26%", desk: "desk-plum" },
  { id: "nia", left: "39%", top: "22%", desk: "desk-green" },
  { id: "lia", left: "66%", top: "26%", desk: "desk-gold" },
  { id: "max", left: "22%", top: "66%", desk: "desk-gold" },
  { id: "ana", left: "48%", top: "70%", desk: "desk-pink" },
  { id: "eva", left: "75%", top: "66%", desk: "desk-green" },
] as const;

export function GameShell({
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
  const selected = useFirma((s) => s.selected);
  const select = useFirma((s) => s.select);
  const agents = useFirma((s) => s.agents);
  const selectedProductId = useFirma((s) => s.selectedProductId);
  const selectProduct = useFirma((s) => s.selectProduct);
  const metrics = useFirma((s) => s.metrics);
  const product = PRODUCTS.find((item) => item.id === selectedProductId) ?? PRODUCTS[0];
  const furniture = useMemo(() => ["plant", "sofa", "coffee", "board", "lamp"], []);

  return (
    <div className="game-shell">
      <header className="game-hud-top">
        <div className="game-brand"><span className="game-brand-mark">F</span><span><b>FIRMA</b><small>escritório online</small></span></div>
        <div className="game-room-name"><span className="room-status" /> Sala principal <small>• 6 online</small></div>
        <label className="game-product"><span>produto ativo</span><select aria-label="Produto ativo" value={selectedProductId} onChange={(e) => selectProduct(e.target.value)}>{PRODUCTS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <div className="game-coins"><span><Coins /> {brl(metrics.receita)}</span><span><Users /> {metrics.leads}</span></div>
        <div className="game-hud-actions"><Button onClick={onOpenApprovals} aria-label="Aprovações" className="game-icon-button"><CheckSquare /></Button><Button onClick={onOpenAdmin} aria-label="Conexões" className="game-icon-button"><Plug /></Button><Button onClick={onOpenPlaybook} aria-label="Ajuda" className="game-icon-button"><HelpCircle /></Button><Button onClick={onOpenSettings} aria-label="Configurações" className="game-icon-button"><Settings /></Button></div>
      </header>

      <main className="game-stage">
        <div className="game-room" role="list" aria-label="Sala principal da FIRMA">
          <div className="game-back-wall"><span className="game-logo-sign">FIRMA<br /><small>MAIN OFFICE</small></span><span className="wall-window window-left" /><span className="wall-window window-right" /><span className="wall-shelf shelf-one" /><span className="wall-shelf shelf-two" /></div>
          {furniture.map((item) => <div key={item} className={`game-furniture furniture-${item}`} aria-hidden="true"><i /><b /><em /></div>)}
          <div className="game-rug" aria-hidden="true" />
          {PEOPLE.map(({ id, left, top, desk }) => {
            const def = AGENT_BY_ID[id];
            const live = agents.find((agent) => agent.id === id);
            const isSelected = selected === id;
            return <button key={id} type="button" role="listitem" className={cn("game-avatar-station", desk, isSelected && "game-avatar-selected")} style={{ left, top }} onClick={() => select(isSelected ? null : def.id)} aria-label={`Falar com ${def.name}`}>
              <span className="game-name-tag">{def.name}</span>
              <span className="game-desk"><i className="screen" /><i className="keyboard" /><i className="leg leg-a" /><i className="leg leg-b" /></span>
              <img src={def.sprite} alt="" className="game-avatar" draggable={false} />
              <span className="game-status"><i className={live?.status === "working" ? "online" : "away"} />{live?.status === "working" ? "trabalhando" : "disponível"}</span>
            </button>;
          })}
          <div className="game-bubble bubble-one">3 tarefas novas</div><div className="game-bubble bubble-two">Clique em uma pessoa</div>
        </div>
        <aside className="game-room-list"><p>salas</p><button className="room-list-active"><span>◈</span> Sala principal <b>6</b></button><button><span>▣</span> Segundo cérebro</button><button><span>▤</span> Aprovações <b className="alert-count">3</b></button></aside>
      </main>
      <nav className="game-action-bar"><div className="game-action-hint"><ShoppingBag size={17} /><span>{product.name}</span><small>{PRODUCT_STAGES[product.stage]}</small></div><div className="game-actions"><button onClick={onOpenApprovals}><CheckSquare /> aprovar</button><button onClick={onOpenAdmin}><Plug /> conectar</button><button onClick={onOpenPlaybook}><BookOpen /> como jogar</button></div><div className="game-help-text">Selecione uma mesa para conversar</div></nav>
    </div>
  );
}
