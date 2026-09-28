import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.ComponentProps<"span"> & { tone?: "neutral" | "live" | "wait" | "alert" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
        tone === "neutral" && "bg-elevated text-muted",
        tone === "live" && "bg-live/15 text-live",
        tone === "wait" && "bg-wait/15 text-wait",
        tone === "alert" && "bg-alert/15 text-alert",
        className,
      )}
      {...props}
    />
  );
}
