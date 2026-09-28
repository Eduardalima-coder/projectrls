import { useMemo } from "react";
import { User } from "lucide-react";
import { AGENTS, AGENT_BY_ID, ROOMS, type AgentStatus, type RoomId } from "@/lib/roster";
import { useFirma } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS: Record<AgentStatus, string> = {
  idle: "Pausa",
  walking: "A caminho",
  working: "Trabalhando",
  waiting: "Aguarda você",
  blocked: "Travado",
};

export function OfficeView() {
  const agents = useFirma((s) => s.agents);
  const selected = useFirma((s) => s.selected);
  const select = useFirma((s) => s.select);

  const rooms = useMemo(() => Object.entries(ROOMS) as [RoomId, (typeof ROOMS)[RoomId]][], []);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-bg">
      <div className="relative min-h-0 flex-1 overflow-auto">
        <div className="relative mx-auto min-h-full w-[min(100%,1120px)]">
          <img
            src="/office/floor.jpg"
            alt="Escritório da FIRMA"
            className="block h-auto w-full select-none"
            draggable={false}
            crossOrigin="anonymous"
          />
          {rooms.map(([id, room]) => (
            <div
              key={id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${room.x}%`, top: `${Math.max(room.y - 8, 4)}%` }}
            >
              <span className="hidden rounded-full border border-border/80 bg-bg/70 px-2 py-0.5 font-mono text-xs uppercase tracking-widest text-muted backdrop-blur-sm sm:inline-block">
                {room.label}
              </span>
            </div>
          ))}
          {agents.map((a) => {
            const def = AGENT_BY_ID[a.id];
            const active = selected === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => select(active ? null : a.id)}
                className="absolute z-10 -translate-x-1/2 -translate-y-[86%] text-left"
                style={{
                  left: `${a.x}%`,
                  top: `${a.y}%`,
                  transition: "left 1.15s cubic-bezier(0.22,1,0.36,1), top 1.15s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {a.speech ? (
                  <span className="absolute bottom-[108%] left-1/2 z-20 w-max max-w-36 -translate-x-1/2 rounded-lg rounded-bl-sm border border-border bg-elevated px-2 py-1 text-xs leading-snug text-fg shadow-sm">
                    {a.speech}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "block origin-bottom",
                    a.status === "working" && "animate-work",
                    a.status === "walking" && "animate-walk",
                    a.status === "idle" && "animate-idle",
                  )}
                >
                  <img
                    src={def.sprite}
                    alt=""
                    className={cn(
                      "mx-auto h-14 w-auto drop-shadow-md sm:h-[88px] lg:h-[108px]",
                      active && "brightness-110",
                    )}
                    crossOrigin="anonymous"
                    draggable={false}
                  />
                </span>
                <span
                  className={cn(
                    "mx-auto mt-0.5 flex w-max items-center gap-1 rounded-full border px-1.5 py-0.5",
                    active ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg/80 text-fg",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      a.status === "working" && "bg-live",
                      a.status === "walking" && "bg-wait",
                      a.status === "idle" && "bg-muted",
                      a.status === "waiting" && "bg-wait",
                      a.status === "blocked" && "bg-alert",
                    )}
                  />
                  <span className="font-mono text-xs tracking-wide">{def.name}</span>
                </span>
              </button>
            );
          })}
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${ROOMS.founder.x}%`, top: `${ROOMS.founder.y}%` }}
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-accent/40 bg-bg/80 text-fg">
              <User className="size-4" />
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto border-t border-border bg-surface px-2 py-2 lg:hidden">
        {AGENTS.map((a) => {
          const live = agents.find((x) => x.id === a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => select(a.id)}
              className={cn(
                "flex min-w-20 flex-col items-center rounded-xl border px-2 py-2",
                selected === a.id ? "border-accent bg-elevated" : "border-border bg-bg",
              )}
            >
              <img src={a.sprite} alt="" className="h-10 w-auto" crossOrigin="anonymous" />
              <span className="mt-1 font-mono text-xs text-fg">{a.name}</span>
              <span className="text-xs text-muted">{STATUS[live?.status ?? "idle"]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
