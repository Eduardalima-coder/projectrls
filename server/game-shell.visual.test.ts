import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("FIRMA game shell visual contract", () => {
  it("keeps the office as a static room with clickable agent stations", () => {
    const shell = read("client/src/components/game-shell.tsx");
    const css = read("client/src/index.css");

    expect(shell).toContain('className="game-shell"');
    expect(shell).toContain('className={cn("game-avatar-station"');
    expect(shell).toContain('onClick={() => select(isSelected ? null : def.id)}');
    expect(css).toContain(".game-avatar-station");
    expect(css).toContain(".game-desk");
    expect(css).toContain(".game-room");
    expect(css).toContain(".game-stage { height: calc(100dvh - 123px)");
    expect(css).toContain(".game-shell { height: 100dvh");
  });

  it("keeps approvals, admin and chat inside game-styled windows", () => {
    expect(read("client/src/components/approval-panel.tsx")).toContain("game-modal");
    expect(read("client/src/components/admin-center.tsx")).toContain("game-modal");
    expect(read("client/src/components/agent-panel.tsx")).toContain("game-agent-panel");
    expect(read("client/src/index.css")).toContain(".game-modal-backdrop");
  });

  it("keeps the guided-mode settings inside the same game window system", () => {
    expect(read("client/src/components/settings-sheet.tsx")).toContain("settings-game-modal");
    expect(read("client/src/index.css")).toContain(".settings-game-backdrop");
  });
});
