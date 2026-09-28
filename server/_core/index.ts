import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { eq } from "drizzle-orm";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { invokeLLM } from "./llm";
import { getDb } from "../db";
import { hotmartEvents } from "../../drizzle/schema";
import { nonEmptyText, validHotmartToken } from "../hotmart";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => server.close(() => resolve(true)));
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) if (await isPortAvailable(port)) return port;
  throw new Error(`No available port found starting from ${startPort}`);
}
const text = nonEmptyText;
function modelText(result: Awaited<ReturnType<typeof invokeLLM>>) {
  const content = result.choices[0]?.message?.content;
  return typeof content === "string" ? content : JSON.stringify(content ?? "");
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ limit: "2mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.post("/api/hotmart/webhook", async (req, res) => {
    if (!validHotmartToken(req.header("x-hotmart-hottok"), process.env.HOTMART_WEBHOOK_TOKEN)) return res.status(401).json({ ok: false, error: "invalid_webhook_token" });
    const body = req.body as Record<string, any>;
    const id = text(body?.id); const event = text(body?.event); const version = text(body?.version);
    if (!id || !event || !version) return res.status(422).json({ ok: false, error: "invalid_payload" });
    const db = await getDb();
    if (!db) return res.status(503).json({ ok: false, error: "database_not_configured" });
    const existing = await db.select({ id: hotmartEvents.id }).from(hotmartEvents).where(eq(hotmartEvents.id, id)).limit(1);
    if (existing.length) return res.json({ ok: true, duplicate: true });
    const data = body.data ?? {}; const product = data.product ?? {}; const purchase = data.purchase ?? {}; const price = purchase.price ?? {};
    await db.insert(hotmartEvents).values({ id, event, version, productUcode: text(product.ucode), productName: text(product.name), transactionId: text(purchase.transaction), purchaseStatus: text(purchase.status), amount: price.value == null ? null : String(price.value), currency: text(price.currency_value), occurredAt: typeof body.creation_date === "number" ? new Date(body.creation_date) : null, payload: body });
    return res.json({ ok: true, accepted: true });
  });

  app.post("/api/ai/agent", async (req, res) => {
    try {
      const input = req.body as Record<string, any>;
      const result = await invokeLLM({ model: "gpt-5-mini", maxTokens: 520, messages: [{ role: "system", content: "Você é um agente operacional da FIRMA. Responda em português brasileiro, seja objetivo, não invente fatos e não execute ações externas.", }, { role: "user", content: JSON.stringify(input) }] });
      return res.json({ ok: true, text: modelText(result) });
    } catch (error) { console.error("[ai/agent]", error); return res.status(502).json({ ok: false, error: "llm_unavailable" }); }
  });
  app.post("/api/ai/order", async (req, res) => {
    try {
      const result = await invokeLLM({ model: "gpt-5-mini", maxTokens: 260, responseFormat: { type: "json_object" }, messages: [{ role: "system", content: "Converta a ordem em JSON com title, owner, reply. owner deve ser nia, lia, max, ana, oto ou eva. Não execute nada.", }, { role: "user", content: JSON.stringify(req.body) }] });
      const parsed = JSON.parse(modelText(result).replace(/```json|```/g, "").trim());
      return res.json({ ok: true, ...parsed });
    } catch (error) { console.error("[ai/order]", error); return res.status(502).json({ ok: false, error: "llm_unavailable" }); }
  });
  app.post("/api/ai/draft", async (req, res) => {
    try {
      const result = await invokeLLM({ model: "gpt-5-mini", maxTokens: 520, responseFormat: { type: "json_object" }, messages: [{ role: "system", content: "Você é redator de pré-produção da FIRMA. Gere somente rascunho interno. Não invente depoimentos, números, garantias ou claims sensíveis; use [EVIDÊNCIA NECESSÁRIA]. Responda JSON válido com title, body, hypothesis, cta, source e risk (baixo, médio ou alto).", }, { role: "user", content: JSON.stringify(req.body) }] });
      const parsed = JSON.parse(modelText(result).replace(/```json|```/g, "").trim());
      if (!parsed.title || !parsed.body || !parsed.hypothesis || !parsed.cta || !parsed.source || !["baixo", "médio", "alto"].includes(parsed.risk)) return res.status(502).json({ ok: false, error: "invalid_draft" });
      return res.json({ ok: true, draft: parsed });
    } catch (error) { console.error("[ai/draft]", error); return res.status(502).json({ ok: false, error: "llm_unavailable" }); }
  });

  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  if (process.env.NODE_ENV === "development") await setupVite(app, server); else serveStatic(app);
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}
startServer().catch(console.error);
