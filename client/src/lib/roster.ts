export type AgentId = "nia" | "lia" | "max" | "ana" | "oto" | "eva";
export type RoomId =
  | "founder"
  | "meeting"
  | "cafe"
  | "aquisicao"
  | "conteudo"
  | "vendas"
  | "ops"
  | "atendimento"
  | "financeiro";
export type AgentStatus = "idle" | "walking" | "working" | "waiting" | "blocked";
export type ColumnId = "briefing" | "aquisicao" | "producao" | "vendas" | "entregue";

export type AgentDef = {
  id: AgentId;
  name: string;
  role: string;
  desk: RoomId;
  sprite: string;
  accent: string;
  persona: string;
  verbs: string[];
};

export const ROOMS: Record<
  RoomId,
  { label: string; x: number; y: number }
> = {
  founder: { label: "Founder", x: 18, y: 28 },
  meeting: { label: "Segundo cérebro", x: 48, y: 24 },
  cafe: { label: "Café", x: 76, y: 28 },
  aquisicao: { label: "Aquisição", x: 20, y: 50 },
  conteudo: { label: "Estúdio", x: 49, y: 48 },
  vendas: { label: "Vendas", x: 78, y: 50 },
  ops: { label: "Operações", x: 22, y: 74 },
  atendimento: { label: "Atendimento", x: 50, y: 72 },
  financeiro: { label: "Financeiro", x: 78, y: 74 },
};

export const AGENTS: AgentDef[] = [
  {
    id: "nia",
    name: "Nia",
    role: "Aquisição",
    desk: "aquisicao",
    sprite: "/agents/nia.png",
    accent: "var(--color-live)",
    verbs: ["lead", "leads", "tráfego", "trafego", "ads", "anúncio", "anuncio", "meta", "captação", "captacao", "aquisição", "aquisicao"],
    persona:
      "Você é Nia, head de aquisição da FIRMA. Fala curto, em português do Brasil. Pensa em criativos, ângulos, CPL, funil e volume. Não promete milagre. Entrega o próximo passo concreto.",
  },
  {
    id: "lia",
    name: "Lia",
    role: "Conteúdo",
    desk: "conteudo",
    sprite: "/agents/lia.png",
    accent: "var(--color-wait)",
    verbs: ["conteúdo", "conteudo", "reel", "reels", "post", "copy", "roteiro", "vídeo", "video", "carrossel", "carrossel"],
    persona:
      "Você é Lia, diretora de conteúdo da FIRMA. Fala com precisão editorial. Entrega ganchos, roteiros e peças prontas para gravar. Tom sofisticado, sem emoji, sem enrolação.",
  },
  {
    id: "max",
    name: "Max",
    role: "Vendas",
    desk: "vendas",
    sprite: "/agents/max.png",
    accent: "var(--color-fg)",
    verbs: ["venda", "vendas", "proposta", "fechar", "cliente", "call", "reunião", "reuniao", "deal", "follow"],
    persona:
      "Você é Max, closer da FIRMA. Diagnostica, qualifica, propõe e pede o sim. Fala direto. Sempre termina com uma pergunta de avanço.",
  },
  {
    id: "ana",
    name: "Ana",
    role: "Atendimento",
    desk: "atendimento",
    sprite: "/agents/ana.png",
    accent: "var(--color-live)",
    verbs: ["atendimento", "suporte", "ticket", "dúvida", "duvida", "onboarding", "cliente", "whatsapp"],
    persona:
      "Você é Ana, atendimento da FIRMA. Acolhe, resolve, registra. Tom calmo e claro. Transforma reclamação em próximo passo.",
  },
  {
    id: "oto",
    name: "Oto",
    role: "Operações",
    desk: "ops",
    sprite: "/agents/oto.png",
    accent: "var(--color-muted)",
    verbs: ["ops", "operação", "operacao", "automação", "automacao", "sistema", "fluxo", "kanban", "integração", "integracao"],
    persona:
      "Você é Oto, operações da FIRMA. Orquestra handoff entre agentes, documenta o fluxo e corta retrabalho. Fala em checklists.",
  },
  {
    id: "eva",
    name: "Eva",
    role: "Financeiro",
    desk: "financeiro",
    sprite: "/agents/eva.png",
    accent: "var(--color-wait)",
    verbs: ["financeiro", "caixa", "receita", "fatura", "pagamento", "preço", "preco", "ticket", "margem", "relatório", "relatorio"],
    persona:
      "Você é Eva, financeiro da FIRMA. Números primeiro. Converte ideia em receita, custo e prazo. Sem poesia.",
  },
];

export const AGENT_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a])) as Record<
  AgentId,
  AgentDef
>;

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: "briefing", label: "Briefing" },
  { id: "aquisicao", label: "Aquisição" },
  { id: "producao", label: "Produção" },
  { id: "vendas", label: "Vendas" },
  { id: "entregue", label: "Entregue" },
];

export function routeOrder(text: string): AgentId {
  const t = text.toLowerCase();
  let best: AgentId = "oto";
  let score = 0;
  for (const a of AGENTS) {
    const hits = a.verbs.filter((v) => t.includes(v)).length;
    if (hits > score) {
      score = hits;
      best = a.id;
    }
  }
  return best;
}

export function columnForAgent(id: AgentId): ColumnId {
  if (id === "nia") return "aquisicao";
  if (id === "lia") return "producao";
  if (id === "max") return "vendas";
  return "briefing";
}
