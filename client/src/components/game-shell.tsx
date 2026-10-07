import { useMemo } from "react";
import { BookOpen, CheckSquare, Coins, HelpCircle, Plug, Settings, ShoppingBag, Users } from "lucide-react";
import { AGENT_BY_ID } from "@/lib/roster";
import { PRODUCTS, PRODUCT_STAGES } from "@/lib/portfolio";
import { useFirma } from "@/lib/store";
import { brl, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PEOPLE = [
  { id: "oto", deskLeft: "9%", deskTop: "34%", walkerLeft: "20%", walkerTop: "39%", desk: "desk-plum", walkClass: "walk-oto", delay: "0s" },
  { id: "nia", deskLeft: "36%", deskTop: "27%", walkerLeft: "48%", walkerTop: "32%", desk: "desk-green", walkClass: "walk-nia", delay: "-2s" },
  { id: "lia", deskLeft: "67%", deskTop: "34%", walkerLeft: "59%", walkerTop: "44%", desk: "desk-gold", walkClass: "walk-lia", delay: "-4s" },
  { id: "max", deskLeft: "19%", deskTop: "67%", walkerLeft: "32%", walkerTop: "66%", desk: "desk-gold", walkClass: "walk-max", delay: "-5s" },
  { id: "ana", deskLeft: "48%", deskTop: "70%", walkerLeft: "43%", walkerTop: "57%", desk: "desk-pink", walkClass: "walk-ana", delay: "-1s" },
  { id: "eva", deskLeft: "73%", deskTop: "67%", walkerLeft: "64%", walkerTop: "62%", desk: "desk-green", walkClass: "walk-eva", delay: "-3s" },
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
          <div className="game-walkway" aria-hidden="true"><span /><span /><span /></div>
          {PEOPLE.map(({ id, deskLeft, deskTop, walkerLeft, walkerTop, desk, walkClass, delay }) => {
            const def = AGENT_BY_ID[id];
            const live = agents.find((agent) => agent.id === id);
            const isSelected = selected === id;
            return <span key={id} className="game-agent-pair">
              <button type="button" role="listitem" className={cn("game-workstation", desk, isSelected && "game-avatar-selected")} style={{ left: deskLeft, top: deskTop }} onClick={() => select(isSelected ? null : def.id)} aria-label={`Abrir mesa de ${def.name}`}>
                <span className="game-name-tag">{def.name}</span>
                <span className="game-desk"><i className="screen" /><i className="keyboard" /><i className="leg leg-a" /><i className="leg leg-b" /></span>
                <span className="game-status"><i className={live?.status === "working" ? "online" : "away"} />{live?.status === "working" ? "online" : "disponível"}</span>
              </button>
              <button type="button" role="listitem" className={cn("game-walker", walkClass, isSelected && "game-avatar-selected")} style={{ left: walkerLeft, top: walkerTop, animationDelay: delay }} onClick={() => select(isSelected ? null : def.id)} aria-label={`Falar com ${def.name}`}>
                <span className="game-walker-name">{def.name}</span>
                <span className={`game-character character-${id}`} aria-hidden="true">
                  <i className="char-shadow" /><i className="char-leg char-leg-left" /><i className="char-leg char-leg-right" />
                  <i className="char-body" /><i className="char-arm char-arm-left" /><i className="char-arm char-arm-right" />
                  <i className="char-head" /><i className="char-hair" /><i className="char-face" />
                </span>
              </button>
            </span>;
          })}
          <div className="game-bubble bubble-one">3 tarefas novas</div><div className="game-bubble bubble-two">Clique em uma pessoa</div>
        </div>
        <aside className="game-room-list"><p>salas</p><button className="room-list-active"><span>◈</span> Sala principal <b>6</b></button><button><span>▣</span> Segundo cérebro</button><button><span>▤</span> Aprovações <b className="alert-count">3</b></button></aside>
      </main>
      <nav className="game-action-bar"><div className="game-action-hint"><ShoppingBag size={17} /><span>{product.name}</span><small>{PRODUCT_STAGES[product.stage]}</small></div><div className="game-actions"><button onClick={onOpenApprovals}><CheckSquare /> aprovar</button><button onClick={onOpenAdmin}><Plug /> conectar</button><button onClick={onOpenPlaybook}><BookOpen /> como jogar</button></div><div className="game-help-text">Selecione uma mesa para conversar</div></nav>
    </div>
  );
}
