type ChatInput = {
  agentId: string; name: string; role: string; persona: string; company: string; offer: string;
  product?: { name: string; stage: string; hypothesis: string; next: string };
  message: string; history: { role: "user" | "assistant"; content: string }[];
};
type DispatchInput = { order: string; company: string; offer: string; product?: { name: string; stage: string; hypothesis: string; next: string } };
type DraftGenerationInput = { product: { id: string; name: string; category: string; promise: string; stage: string; hypothesis: string; next: string }; channel: "post" | "criativo" | "email" | "dm" | "sms" | "landing" | "roteiro"; audience: string; objective: string };

async function post<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
  const body = await response.json().catch(() => ({ ok: false, error: "invalid_server_response" }));
  if (!response.ok) return { ok: false, error: body.error ?? `HTTP ${response.status}` } as T;
  return body as T;
}

export const talkToAgent = (input: { data: ChatInput }) => post<{ ok: boolean; text?: string; error?: string }>("/api/ai/agent", input.data);
export const interpretOrder = (input: { data: DispatchInput }) => post<{ ok: boolean; agentId?: string; title?: string; reply?: string; error?: string }>("/api/ai/order", input.data);
export const generateDraftWithAI = (input: { data: DraftGenerationInput }) => post<{ ok: boolean; draft?: { title: string; body: string; hypothesis: string; cta: string; source: string; risk: "baixo" | "médio" | "alto" }; error?: string }>("/api/ai/draft", input.data);
