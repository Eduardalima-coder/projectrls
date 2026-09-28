import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AGENTS,
  AGENT_BY_ID,
  ROOMS,
  columnForAgent,
  routeOrder,
  type AgentId,
  type AgentStatus,
  type ColumnId,
  type RoomId,
} from "./roster";
import { PRODUCTS } from "./portfolio";
import { DRAFT_TEMPLATES, type ApprovalRequest, type Draft } from "./approvals";

export type Task = {
  id: string;
  title: string;
  column: ColumnId;
  owner: AgentId;
  progress: number;
  productId: string;
  sectorId: string;
};

export type LogItem = {
  id: string;
  at: number;
  agentId: AgentId | "you";
  text: string;
};

export type ChatMsg = { role: "user" | "assistant"; content: string };

export type AgentLive = {
  id: AgentId;
  status: AgentStatus;
  room: RoomId;
  x: number;
  y: number;
  speech: string | null;
  speechUntil: number;
};

export type Briefing = {
  company: string;
  offer: string;
};

type FirmaState = {
  briefing: Briefing;
  selectedProductId: string;
  agents: AgentLive[];
  tasks: Task[];
  log: LogItem[];
  metrics: { leads: number; receita: number; conteudos: number; deals: number };
  selected: AgentId | null;
  chats: Record<AgentId, ChatMsg[]>;
  chatting: boolean;
  sending: boolean;
  drafts: Draft[];
  approvals: ApprovalRequest[];
  hydrated: boolean;
  setBriefing: (b: Partial<Briefing>) => void;
  selectProduct: (id: string) => void;
  select: (id: AgentId | null) => void;
  tick: (now: number) => void;
  pushLog: (agentId: AgentId | "you", text: string) => void;
  issueOrder: (title: string, owner: AgentId, reply?: string, productId?: string) => void;
  appendChat: (id: AgentId, msg: ChatMsg) => void;
  setSending: (v: boolean) => void;
  setChatting: (v: boolean) => void;
  markHydrated: () => void;
  createDraft: (productId: string) => void;
  addGeneratedDraft: (draft: Omit<Draft, "id" | "version" | "status" | "createdAt" | "updatedAt">) => void;
  requestApproval: (draftId: string) => void;
  decideApproval: (approvalId: string, decision: "approved" | "changes" | "rejected", note?: string) => void;
};

let seq = 1;
const nid = () => `t${Date.now().toString(36)}${seq++}`;
const aid = () => `a${Date.now().toString(36)}${seq++}`;

function seedAgents(): AgentLive[] {
  return AGENTS.map((a, i) => {
    const inCafe = i === 3;
    const room: RoomId = inCafe ? "cafe" : a.desk;
    const pos = ROOMS[room];
    return {
      id: a.id,
      status: inCafe ? "idle" : "working",
      room,
      x: pos.x + (i % 2 === 0 ? -1.2 : 1.1),
      y: pos.y,
      speech: null,
      speechUntil: 0,
    };
  });
}

function seedTasks(): Task[] {
  return [
    { id: nid(), title: "3 ângulos de prova social", column: "aquisicao", owner: "nia", progress: 62, productId: "conteudo-que-vende", sectorId: "aquisicao" },
    { id: nid(), title: "Roteiro: método em 30 segundos", column: "producao", owner: "lia", progress: 44, productId: "conteudo-que-vende", sectorId: "conteudo" },
    { id: nid(), title: "Página de espera — Aula Clara", column: "vendas", owner: "max", progress: 71, productId: "aula-clara", sectorId: "vendas" },
    { id: nid(), title: "8 entrevistas com clínicas", column: "briefing", owner: "ana", progress: 28, productId: "operacao-cliente-local", sectorId: "radar" },
    { id: nid(), title: "Mapa de follow-up por oferta", column: "briefing", owner: "oto", progress: 51, productId: "operacao-cliente-local", sectorId: "produto" },
    { id: nid(), title: "Margem e caixa do ciclo", column: "briefing", owner: "eva", progress: 33, productId: "conteudo-que-vende", sectorId: "dados" },
    { id: nid(), title: "Diagnóstico de dor financeira", column: "briefing", owner: "eva", progress: 18, productId: "caixa-previsivel", sectorId: "radar" },
  ];
}

function seedLog(): LogItem[] {
  const now = Date.now();
  return [
    { id: nid(), at: now - 80000, agentId: "nia", text: "14 leads quentes da campanha de ontem." },
    { id: nid(), at: now - 62000, agentId: "lia", text: "Gancho do reel travado. Gravando bloco 2." },
    { id: nid(), at: now - 41000, agentId: "max", text: "Studio Norte pediu a proposta em PDF." },
    { id: nid(), at: now - 22000, agentId: "oto", text: "Handoff aquisição → conteúdo no quadro." },
  ];
}

const LINES: Record<AgentId, string[]> = {
  nia: [
    "Mais um lote de leads no CRM.",
    "Criativo B ganhando no CTR.",
    "Pausando o anúncio frio — CPL subiu.",
  ],
  lia: [
    "Roteiro do carrossel no quadro.",
    "Cortei o gancho em 1,4s.",
    "Peça pronta. Mandando pra Max.",
  ],
  max: [
    "Follow no lead que abriu o PDF.",
    "Call agendada pra amanhã 10h.",
    "Proposta enviada. Esperando o sim.",
  ],
  ana: [
    "Ticket de acesso resolvido.",
    "Onboarding do aluno novo concluído.",
    "Dúvida de pagamento encaminhada pra Eva.",
  ],
  oto: [
    "Fluxo de handoff atualizado.",
    "Checklist da semana no quadro.",
    "Tirei um retrabalho do caminho da Lia.",
  ],
  eva: [
    "Receita do dia lançada.",
    "Dois pagamentos confirmados.",
    "Margem da oferta ainda segura.",
  ],
};

export const useFirma = create<FirmaState>()(
  persist(
    (set, get) => ({
      briefing: {
        company: "FIRMA",
        offer: "Infoprodutos e automação com agentes de IA",
      },
      selectedProductId: PRODUCTS[0].id,
      agents: seedAgents(),
      tasks: seedTasks(),
      log: seedLog(),
      metrics: { leads: 148, receita: 18420, conteudos: 12, deals: 4 },
      selected: null,
      chats: { nia: [], lia: [], max: [], ana: [], oto: [], eva: [] },
      chatting: false,
      sending: false,
      drafts: DRAFT_TEMPLATES.map((template, index) => ({
        ...template,
        id: `d${index + 1}`,
        version: 1,
        status: "draft" as const,
        createdAt: Date.now() - (index + 1) * 3600000,
        updatedAt: Date.now() - (index + 1) * 3600000,
      })),
      approvals: [],
      hydrated: false,
      setBriefing: (b) => set({ briefing: { ...get().briefing, ...b } }),
      selectProduct: (id) => set({ selectedProductId: id }),
      select: (id) => set({ selected: id, chatting: false }),
      markHydrated: () => set({ hydrated: true }),
      createDraft: (productId) => {
        const template = DRAFT_TEMPLATES.find((item) => item.productId === productId) ?? DRAFT_TEMPLATES[0];
        const draft: Draft = { ...template, id: nid(), productId, version: 1, status: "draft", createdAt: Date.now(), updatedAt: Date.now() };
        const product = PRODUCTS.find((item) => item.id === productId);
        const item: LogItem = { id: nid(), at: Date.now(), agentId: template.owner, text: `Rascunho automático criado para ${product?.name ?? "produto"}: ${draft.title}.` };
        set({ drafts: [draft, ...get().drafts], log: [item, ...get().log].slice(0, 48) });
      },
      addGeneratedDraft: (input) => {
        const now = Date.now();
        const draft: Draft = { ...input, id: nid(), version: 1, status: "draft", createdAt: now, updatedAt: now };
        const item: LogItem = { id: nid(), at: now, agentId: input.owner, text: `IA gerou rascunho para revisão: ${draft.title}.` };
        set({ drafts: [draft, ...get().drafts], log: [item, ...get().log].slice(0, 48) });
      },
      requestApproval: (draftId) => {
        const draft = get().drafts.find((item) => item.id === draftId);
        if (!draft || get().approvals.some((item) => item.draftId === draftId && item.status === "pending")) return;
        const approval: ApprovalRequest = {
          id: aid(), draftId, productId: draft.productId, action: `Revisar ${draft.title}`, scope: `Versão ${draft.version} · somente ${draft.channel}`,
          audience: DRAFT_TEMPLATES.find((item) => item.productId === draft.productId)?.audience ?? "Definir público",
          channel: draft.channel, budget: DRAFT_TEMPLATES.find((item) => item.productId === draft.productId)?.budget ?? "Sem gasto — rascunho",
          window: "Definir janela", risk: draft.risk, checklist: ["Fonte/hipótese vinculada", "CTA identificado", "Claims revisados", "Consentimento e público conferidos", "Tracking definido"], status: "pending", requestedAt: Date.now(),
        };
        const item: LogItem = { id: nid(), at: Date.now(), agentId: "oto", text: `Aprovação solicitada: ${draft.title}.` };
        set({ approvals: [approval, ...get().approvals], drafts: get().drafts.map((item) => item.id === draftId ? { ...item, status: "in_review" } : item), log: [item, ...get().log].slice(0, 48) });
      },
      decideApproval: (approvalId, decision, note) => {
        const approval = get().approvals.find((item) => item.id === approvalId);
        if (!approval || approval.status !== "pending") return;
        const draft = get().drafts.find((item) => item.id === approval.draftId);
        const label = decision === "approved" ? "aprovado para execução manual" : decision === "changes" ? "devolvido para ajustes" : "rejeitado";
        const item: LogItem = { id: nid(), at: Date.now(), agentId: "you", text: `${draft?.title ?? "Rascunho"} ${label}. ${note ?? ""}`.trim() };
        set({ approvals: get().approvals.map((entry) => entry.id === approvalId ? { ...entry, status: decision, reviewer: "Você", note } : entry), drafts: get().drafts.map((entry) => entry.id === approval.draftId ? { ...entry, status: decision === "approved" ? "approved" : "draft", updatedAt: Date.now() } : entry), log: [item, ...get().log].slice(0, 48) });
      },
      setSending: (v) => set({ sending: v }),
      setChatting: (v) => set({ chatting: v }),
      appendChat: (id, msg) =>
        set({
          chats: {
            ...get().chats,
            [id]: [...(get().chats[id] ?? []), msg].slice(-16),
          },
        }),
      pushLog: (agentId, text) => {
        const now = Date.now();
        const item: LogItem = { id: nid(), at: now, agentId, text };
        const agents = get().agents.map((a) =>
          a.id === agentId
            ? { ...a, speech: text, speechUntil: now + 4200 }
            : a,
        );
        set({
          agents,
          log: [item, ...get().log].slice(0, 48),
        });
      },
      issueOrder: (title, owner, reply, productId = get().selectedProductId) => {
        const agent = AGENT_BY_ID[owner];
        const desk = ROOMS[agent.desk];
        const task: Task = {
          id: nid(),
          title,
          column: columnForAgent(owner),
          owner,
          progress: 8,
          productId,
          sectorId: AGENT_BY_ID[owner].desk === "aquisicao" ? "aquisicao" : AGENT_BY_ID[owner].desk === "conteudo" ? "conteudo" : AGENT_BY_ID[owner].desk === "vendas" ? "vendas" : "radar",
        };
        const agents = get().agents.map((a) =>
          a.id === owner
            ? {
                ...a,
                status: "walking" as const,
                room: agent.desk,
                x: desk.x,
                y: desk.y,
                speech: reply ?? "Entendi. Já pego.",
                speechUntil: Date.now() + 4500,
              }
            : a,
        );
        const item: LogItem = {
          id: nid(),
          at: Date.now(),
          agentId: owner,
          text: reply ?? `Nova ordem: ${title}`,
        };
        set({
          agents,
          tasks: [task, ...get().tasks].slice(0, 24),
          log: [item, ...get().log].slice(0, 48),
          selected: owner,
        });
      },
      tick: (now) => {
        const { agents, tasks, metrics } = get();
        let nextMetrics = metrics;
        const nextTasks = tasks.map((t) => ({ ...t }));
        const nextAgents = agents.map((a) => ({ ...a }));

        for (const a of nextAgents) {
          if (a.speech && now > a.speechUntil) a.speech = null;
          if (a.status === "walking") a.status = "working";
        }

        const working = nextAgents.filter((a) => a.status === "working");
        if (working.length && Math.random() < 0.55) {
          const a = working[Math.floor(Math.random() * working.length)];
          const mine = nextTasks.filter((t) => t.owner === a.id && t.column !== "entregue");
          if (mine.length) {
            const t = mine[0];
            t.progress = Math.min(100, t.progress + 7 + Math.floor(Math.random() * 11));
            if (t.progress >= 100) {
              const order: ColumnId[] = ["briefing", "aquisicao", "producao", "vendas", "entregue"];
              const i = order.indexOf(t.column);
              if (i >= 0 && i < order.length - 1) {
                const nextCol = order[i + 1];
                t.column = nextCol;
                t.progress = 12;
                const handoff: Record<ColumnId, AgentId> = {
                  briefing: "oto",
                  aquisicao: "nia",
                  producao: "lia",
                  vendas: "max",
                  entregue: t.owner,
                };
                const nextOwner = handoff[nextCol];
                t.owner = nextOwner;
                const dest = nextAgents.find((x) => x.id === nextOwner);
                if (dest) {
                  dest.status = "walking";
                  dest.room = AGENT_BY_ID[nextOwner].desk;
                  dest.x = ROOMS[dest.room].x;
                  dest.y = ROOMS[dest.room].y;
                }
                if (nextCol === "entregue") {
                  if (a.id === "nia") nextMetrics = { ...nextMetrics, leads: nextMetrics.leads + 3 + Math.floor(Math.random() * 6) };
                  if (a.id === "lia") nextMetrics = { ...nextMetrics, conteudos: nextMetrics.conteudos + 1 };
                  if (a.id === "max") {
                    nextMetrics = {
                      ...nextMetrics,
                      deals: nextMetrics.deals + 1,
                      receita: nextMetrics.receita + 900 + Math.floor(Math.random() * 2400),
                    };
                  }
                  if (a.id === "eva") nextMetrics = { ...nextMetrics, receita: nextMetrics.receita + 400 };
                }
              } else {
                t.column = "entregue";
                t.progress = 100;
              }
            }
            const line = LINES[a.id][Math.floor(Math.random() * LINES[a.id].length)];
            a.speech = line;
            a.speechUntil = now + 3800;
            const item: LogItem = { id: nid(), at: now, agentId: a.id, text: line };
            set({
              agents: nextAgents,
              tasks: nextTasks,
              metrics: nextMetrics,
              log: [item, ...get().log].slice(0, 48),
            });
            return;
          }
        }

        if (Math.random() < 0.22) {
          const idle = nextAgents.filter((a) => a.status === "idle");
          const busy = nextAgents.filter((a) => a.status === "working");
          if (idle.length && Math.random() < 0.5) {
            const a = idle[Math.floor(Math.random() * idle.length)];
            a.status = "walking";
            a.room = AGENT_BY_ID[a.id].desk;
            a.x = ROOMS[a.room].x;
            a.y = ROOMS[a.room].y;
          } else if (busy.length) {
            const a = busy[Math.floor(Math.random() * busy.length)];
            const blocked = nextTasks.some(
              (t) => t.owner === a.id && t.column !== "entregue" && t.progress < 90,
            );
            if (!blocked) {
              a.status = "idle";
              a.room = "cafe";
              a.x = ROOMS.cafe.x + (Math.random() * 4 - 2);
              a.y = ROOMS.cafe.y + (Math.random() * 3 - 1);
            }
          }
        }

        set({ agents: nextAgents, tasks: nextTasks, metrics: nextMetrics });
      },
    }),
    {
      name: "firma-os-v1",
      skipHydration: true,
      partialize: (s) => ({ briefing: s.briefing, selectedProductId: s.selectedProductId, drafts: s.drafts, approvals: s.approvals }),
    },
  ),
);

export function routeAndTitle(order: string): { owner: AgentId; title: string } {
  const owner = routeOrder(order);
  const role = AGENT_BY_ID[owner].role;
  const title = order.trim().slice(0, 72) || `Ordem para ${role}`;
  return { owner, title };
}
