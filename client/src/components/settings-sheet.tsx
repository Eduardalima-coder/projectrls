import { Settings, X } from "lucide-react";
import { useFirma } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const guidanceEnabled = useFirma((s) => s.guidanceEnabled);
  const setGuidanceEnabled = useFirma((s) => s.setGuidanceEnabled);
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-[#343252]/35 p-3 sm:items-center sm:p-6">
      <section className="settings-sheet" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings-header">
          <div className="settings-title"><span className="settings-icon"><Settings size={18} /></span><div><p className="eyebrow">FIRMA / preferências</p><h2 id="settings-title">Configurações</h2></div></div>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose} aria-label="Fechar configurações"><X /></Button>
        </header>
        <div className="settings-body">
          <div className="settings-option">
            <div><h3>Modo passo a passo</h3><p>Mostra o caminho rápido, a dica do dia e as instruções diretas na tela inicial.</p></div>
            <button type="button" role="switch" aria-label="Modo passo a passo" aria-checked={guidanceEnabled} className={`pixel-toggle ${guidanceEnabled ? "is-on" : ""}`} onClick={() => setGuidanceEnabled(!guidanceEnabled)}><span aria-hidden="true" /></button>
          </div>
          <div className="settings-note"><b>{guidanceEnabled ? "Instruções ligadas" : "Modo limpo ligado"}</b><span>{guidanceEnabled ? "O FIRMA vai guiar você em cada etapa." : "Você verá apenas o mapa, as tarefas e os botões principais."}</span></div>
        </div>
        <footer className="settings-footer"><Button className="pixel-button pixel-button-purple" onClick={onClose}>Pronto</Button></footer>
      </section>
    </div>
  );
}
