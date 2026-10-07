import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("FIRMA game shell visual contract", () => {
  it("keeps the office as a clickable virtual hotel with walking agents", () => {
    const shell = read("client/src/components/game-shell.tsx");
    const css = read("client/src/index.css");

    expect(shell).toContain('className="game-shell"');
    expect(shell).toContain('className={cn("game-workstation"');
    expect(shell).toContain('className={cn("game-walker"');
    expect(shell).toContain("game-character character-");
    expect(shell).not.toContain("def.sprite");
    expect(shell).toContain("game-headquarters-title");
    expect(shell).toContain("game-top-roster");
    expect(shell).toContain("game-left-rail");
    expect(shell).toContain("game-right-tabs");
    expect(shell).toContain("game-3d-prop prop-server-rack");
    expect(shell).toContain("seated-avatar");
    expect(shell).toContain("workstation-activity");
    expect(shell).toContain("game-conversation-bubble");
    expect(shell).toContain('onClick={() => select(isSelected ? null : def.id)}');
    expect(css).toContain(".game-workstation");
    expect(css).toContain(".game-walker");
    expect(css).toContain(".game-character");
    expect(css).toContain(".char-body");
    expect(css).toContain("perspective: 1200px");
    expect(css).toContain("@keyframes seated-work");
    expect(css).toContain("@keyframes agent-presence");
    expect(css).toContain("@keyframes seated-presence");
    expect(css).toContain("@keyframes meet-and-talk");
    expect(css).toContain("game-room::after");
    expect(css).toContain("clip-path: polygon(50% 0");
    expect(css).toContain(".game-top-roster");
    expect(css).toContain("@keyframes habbo-walk");
    expect(css).toContain(".game-walkway");
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
