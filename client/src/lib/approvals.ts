import type { AgentId } from "./roster";

export type DraftChannel = "post" | "criativo" | "email" | "dm" | "sms" | "landing" | "roteiro";
export type ApprovalStatus = "pending" | "approved" | "changes" | "rejected";
export type RiskLevel = "baixo" | "médio" | "alto";

export type Draft = {
  id: string;
  productId: string;
  title: string;
  channel: DraftChannel;
  version: number;
  status: "draft" | "in_review" | "approved";
  owner: AgentId;
  body: string;
  hypothesis: string;
  cta: string;
  source: string;
  risk: RiskLevel;
  createdAt: number;
  updatedAt: number;
};

export type ApprovalRequest = {
  id: string;
  draftId: string;
  productId: string;
  action: string;
  scope: string;
  audience: string;
  channel: DraftChannel;
  budget: string;
  window: string;
  risk: RiskLevel;
  checklist: string[];
  status: ApprovalStatus;
  requestedAt: number;
  reviewer?: string;
  note?: string;
};

export const DRAFT_CHANNEL_LABELS: Record<DraftChannel, string> = {
  post: "Post",
  criativo: "Criativo de anúncio",
  email: "E-mail",
  dm: "DM",
  sms: "SMS",
  landing: "Landing page",
  roteiro: "Roteiro",
};

export const DRAFT_TEMPLATES: Array<Pick<Draft, "title" | "channel" | "owner" | "body" | "hypothesis" | "cta" | "source" | "risk"> & { productId: string; audience: string; budget: string }> = [
  {
    productId: "conteudo-que-vende",
    title: "Reel — prova social vs. transformação",
    channel: "roteiro",
    owner: "lia",
    body: "Gancho: postar mais não resolve quando o próximo passo está nebuloso.\nDemonstração: um roteiro curto transforma atenção em conversa com três blocos.\nProva: inserir apenas caso autorizado e fonte vinculada.\nCTA: veja o método e escolha um ângulo para testar.",
    hypothesis: "A linguagem de transformação gera mais leads qualificados do que a promessa de alcance.",
    cta: "Abrir diagnóstico do método",
    source: "Hipótese H-014 · Segundo Cérebro",
    risk: "baixo",
    audience: "Criadores com audiência pequena",
    budget: "Sem gasto — rascunho",
  },
  {
    productId: "operacao-cliente-local",
    title: "E-mail — convite para entrevista",
    channel: "email",
    owner: "max",
    body: "Assunto: posso entender como vocês fazem o próximo follow-up?\n\nConvite individual para uma conversa de pesquisa, sem promessa de resultado e sem oferta automática. Confirmar base legal e opt-out antes de enviar.",
    hypothesis: "Donos de clínicas descrevem melhor a dor quando a pesquisa fala de follow-up, não de ferramenta.",
    cta: "Responder com um horário",
    source: "Hipótese H-021 · 8 entrevistas pendentes",
    risk: "médio",
    audience: "Donos de clínicas com consentimento",
    budget: "Sem gasto — rascunho",
  },
  {
    productId: "aula-clara",
    title: "Landing — página de espera da aula 2",
    channel: "landing",
    owner: "lia",
    body: "Título: transforme seu conhecimento em uma aula que conduz à decisão.\nSubtítulo: uma sessão prática para organizar problema, exemplo e próximo passo.\nSem garantia de resultado; promessa final pendente de revisão.",
    hypothesis: "Especialistas aderem melhor a uma aula de demonstração antes de comprar um curso completo.",
    cta: "Entrar na lista de espera",
    source: "Brief de oferta AULA-002",
    risk: "médio",
    audience: "Especialistas e educadores",
    budget: "Sem gasto — rascunho",
  },
  {
    productId: "caixa-previsivel",
    title: "Post — diagnóstico de caixa",
    channel: "post",
    owner: "lia",
    body: "Você sabe quanto pode investir no próximo mês sem apertar o caixa?\nPost educativo com perguntas de diagnóstico, sem aconselhamento financeiro individual.",
    hypothesis: "Perguntas de diagnóstico simples aumentam a intenção de conhecer a oferta.",
    cta: "Salvar o checklist",
    source: "Radar R-009 · sinais ainda insuficientes",
    risk: "alto",
    audience: "Autônomos — público amplo",
    budget: "Sem gasto — rascunho",
  },
];
