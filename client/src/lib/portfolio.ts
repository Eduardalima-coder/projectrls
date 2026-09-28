export type ProductStage = "radar" | "validando" | "construindo" | "vendendo" | "otimizando" | "pausado";

export type SectorId =
  | "radar"
  | "produto"
  | "conteudo"
  | "aquisicao"
  | "vendas"
  | "sucesso"
  | "dados";

export type SectorDef = {
  id: SectorId;
  label: string;
  short: string;
  mission: string;
  agent: "nia" | "lia" | "max" | "ana" | "oto" | "eva";
  accent: "accent" | "live" | "wait" | "alert";
};

export type Infoproduct = {
  id: string;
  name: string;
  category: string;
  promise: string;
  stage: ProductStage;
  health: "forte" | "teste" | "atenção";
  progress: number;
  revenue: number;
  leads: number;
  next: string;
  hypothesis: string;
  owner: string;
  color: string;
};

export const SECTORS: SectorDef[] = [
  {
    id: "radar",
    label: "Radar de oportunidades",
    short: "Radar",
    mission: "Encontrar qual oferta faz sentido agora.",
    agent: "oto",
    accent: "accent",
  },
  {
    id: "produto",
    label: "Produto e oferta",
    short: "Oferta",
    mission: "Transformar demanda em uma promessa entregável.",
    agent: "oto",
    accent: "wait",
  },
  {
    id: "conteudo",
    label: "Conteúdo e criativos",
    short: "Conteúdo",
    mission: "Gerar roteiros e ativos por hipótese.",
    agent: "lia",
    accent: "live",
  },
  {
    id: "aquisicao",
    label: "Aquisição e mídia",
    short: "Aquisição",
    mission: "Testar demanda com rastreio e limite.",
    agent: "nia",
    accent: "live",
  },
  {
    id: "vendas",
    label: "Vendas e conversão",
    short: "Vendas",
    mission: "Converter intenção qualificada em compra.",
    agent: "max",
    accent: "accent",
  },
  {
    id: "sucesso",
    label: "Entrega e sucesso",
    short: "Sucesso",
    mission: "Garantir primeiro valor e reduzir reembolso.",
    agent: "ana",
    accent: "wait",
  },
  {
    id: "dados",
    label: "Dados, caixa e aprendizado",
    short: "Dados",
    mission: "Fechar o ciclo com margem e evidência.",
    agent: "eva",
    accent: "alert",
  },
];

export const PRODUCTS: Infoproduct[] = [
  {
    id: "conteudo-que-vende",
    name: "Conteúdo que Vende",
    category: "Creator / aquisição",
    promise: "Sistema de roteiros curtos para vender sem postar no escuro.",
    stage: "vendendo",
    health: "forte",
    progress: 78,
    revenue: 12480,
    leads: 96,
    next: "Testar 3 ângulos de prova social no topo do funil.",
    hypothesis: "Criadores com audiência pequena compram quando enxergam um roteiro repetível e mensurável.",
    owner: "Lia · Conteúdo",
    color: "var(--color-live)",
  },
  {
    id: "operacao-cliente-local",
    name: "Operação Cliente Local",
    category: "Prestadores de serviço",
    promise: "Organizar aquisição, atendimento e retorno em 14 dias.",
    stage: "validando",
    health: "teste",
    progress: 42,
    revenue: 3680,
    leads: 31,
    next: "Validar preço com 8 entrevistas de donos de clínicas.",
    hypothesis: "Negócios locais pagam pela clareza do próximo follow-up, não por mais uma ferramenta.",
    owner: "Nia · Radar",
    color: "var(--color-wait)",
  },
  {
    id: "aula-clara",
    name: "Aula Clara",
    category: "Educação e especialistas",
    promise: "Transformar conhecimento disperso em uma aula que conduz à decisão.",
    stage: "construindo",
    health: "forte",
    progress: 61,
    revenue: 2240,
    leads: 18,
    next: "Fechar roteiro da aula 2 e a página de espera.",
    hypothesis: "Especialistas querem vender a transformação antes de gravar um curso inteiro.",
    owner: "Lia · Conteúdo",
    color: "var(--color-accent)",
  },
  {
    id: "caixa-previsivel",
    name: "Caixa Previsível",
    category: "Finanças para autônomos",
    promise: "Enxergar margem, caixa e próxima decisão sem planilha infinita.",
    stage: "radar",
    health: "atenção",
    progress: 18,
    revenue: 0,
    leads: 7,
    next: "Comparar dor financeira com sinais reais de compra.",
    hypothesis: "Autônomos buscam previsibilidade, mas só compram quando o diagnóstico é simples.",
    owner: "Eva · Dados",
    color: "var(--color-alert)",
  },
];

export const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p])) as Record<string, Infoproduct>;
export const SECTOR_BY_ID = Object.fromEntries(SECTORS.map((s) => [s.id, s])) as Record<SectorId, SectorDef>;

export const SECOND_BRAIN = [
  { kind: "DECISÃO", text: "Conteúdo que Vende continua como produto foco até fechar o teste de prova social.", at: "há 18 min", tone: "live" as const },
  { kind: "HIPÓTESE", text: "Operação Cliente Local só avança depois de 8 entrevistas com donos de clínicas.", at: "há 42 min", tone: "wait" as const },
  { kind: "PENDÊNCIA", text: "Aula Clara precisa de aprovação do roteiro da aula 2 antes da página de espera.", at: "há 1 h", tone: "alert" as const },
  { kind: "APRENDIZADO", text: "O ângulo ‘próximo follow-up’ venceu ‘mais leads’ no primeiro corte.", at: "ontem", tone: "accent" as const },
];

export const PRODUCT_STAGES: Record<ProductStage, string> = {
  radar: "Radar",
  validando: "Validando",
  construindo: "Construindo",
  vendendo: "Vendendo",
  otimizando: "Otimizando",
  pausado: "Pausado",
};
