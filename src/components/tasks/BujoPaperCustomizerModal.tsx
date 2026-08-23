import React from 'react';
import { BujoPaperSettings } from '../../types';
import { Modal } from '../common/Modal';
import { BookOpen, Sparkles, Sliders, Check, Palette, Bookmark, Grid } from 'lucide-react';
import { getBujoPaperStyles } from '../../utils/bujoPresets';

interface BujoPaperCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BujoPaperSettings;
  onUpdateSettings: (newSettings: BujoPaperSettings) => void;
}

export const BujoPaperCustomizerModal: React.FC<BujoPaperCustomizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const paperTones: {
    id: BujoPaperSettings['paperTone'];
    name: string;
    bgHex: string;
    desc: string;
  }[] = [
    { id: 'cream', name: 'Crema Marfil', bgHex: '#FAF8F5', desc: 'Papel clásico Leuchtturm / Moleskine' },
    { id: 'parchment', name: 'Pergamino Vintage', bgHex: '#F5EEDB', desc: 'Tono cálido envejecido' },
    { id: 'kraft', name: 'Papel Kraft Eco', bgHex: '#E5D5BC', desc: 'Fibra natural y textura rústica' },
    { id: 'sage', name: 'Matcha & Sage', bgHex: '#EBF3ED', desc: 'Verde botánico relajante' },
    { id: 'blush', name: 'Rosa Empolvado', bgHex: '#FDF2F4', desc: 'Aura suave y delicada' },
    { id: 'lavender', name: 'Lavanda Pastel', bgHex: '#F4EFF9', desc: 'Tono etéreo y creativo' },
    { id: 'slate', name: 'Pizarra Minimal', bgHex: '#F8FAFC', desc: 'Blanco puro contemporáneo' },
    { id: 'midnight', name: 'Noche Estrellada', bgHex: '#181C24', desc: 'Modo oscuro profundo' },
  ];

  const paperPatterns: {
    id: BujoPaperSettings['paperPattern'];
    name: string;
    icon: string;
    desc: string;
  }[] = [
    { id: 'dot-grid', name: 'Dot Grid (Punteado)', icon: '• • •', desc: 'El estándar universal Bullet Journal' },
    { id: 'ruled', name: 'Rayado / Líneas', icon: '— — —', desc: 'Ideal para escritura y diario reflexivo' },
    { id: 'graph', name: 'Cuadrícula (Grid)', icon: '⊞ ⊞ ⊞', desc: 'Precisión geométrica y diagramas' },
    { id: 'isometric', name: 'Isométrico (3D)', icon: '◇ ◇ ◇', desc: 'Perspectivas y patrones triangulares' },
    { id: 'vintage-ledger', name: 'Margen Contable', icon: '║ — —', desc: 'Línea de margen rosa clásico' },
    { id: 'blank', name: 'Liso / Blanco Puro', icon: '□ □ □', desc: 'Página libre sin guías' },
  ];

  const gridColors: {
    id: BujoPaperSettings['gridColor'];
    name: string;
    hex: string;
  }[] = [
    { id: 'navy', name: 'Azul Cobalto', hex: '#2B4789' },
    { id: 'sepia', name: 'Sepia Terracota', hex: '#8C5E48' },
    { id: 'charcoal', name: 'Gris Carbón', hex: '#64748B' },
    { id: 'emerald', name: 'Verde Jade', hex: '#10B183' },
    { id: 'gold', name: 'Oro Miel', hex: '#D97706' },
    { id: 'rose', name: 'Rosa Vivo', hex: '#E36D9B' },
  ];

  const bookmarkColors: {
    id: BujoPaperSettings['bookmarkColor'];
    name: string;
    hex: string;
  }[] = [
    { id: 'navy', name: 'Azul Real', hex: '#2B4789' },
    { id: 'rose', name: 'Rosa Vintage', hex: '#E36D9B' },
    { id: 'emerald', name: 'Verde Esmeralda', hex: '#00CB75' },
    { id: 'gold', name: 'Oro Antiguo', hex: '#E7DD6A' },
    { id: 'terracotta', name: 'Terracota Cálido', hex: '#C85A32' },
    { id: 'violet', name: 'Lavanda Intenso', hex: '#8B5CF6' },
  ];

  const previewStyles = getBujoPaperStyles(settings);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personalizar Papel & Cuaderno BuJo"
      subtitle="Elige el gramaje, textura, cuadrícula y detalles analógicos de tu libreta"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Live Preview Box */}
        <div className="relative rounded-2xl border-2 border-stone-300 p-5 overflow-hidden transition-all shadow-inner"
          style={{
            backgroundColor: previewStyles.backgroundColor,
            backgroundImage: previewStyles.backgroundImage,
            backgroundSize: previewStyles.backgroundSize,
            color: previewStyles.color,
            minHeight: '140px',
          }}
        >
          {/* Bookmark Ribbon Ribbon Preview */}
          {settings.showBookmark && (
            <div
              className="absolute top-0 right-10 w-4 h-14 shadow-md rounded-b-sm border-x border-black/10"
              style={{
                backgroundColor:
                  bookmarkColors.find((c) => c.id === settings.bookmarkColor)?.hex || '#E36D9B',
              }}
            >
              <div className="absolute bottom-0 inset-x-0 h-2 bg-black/15" />
            </div>
          )}

          {/* Washi Corner Preview */}
          {settings.showWashiCorners && (
            <div className="absolute -top-3 -left-3 w-14 h-6 bg-[#E7DD6A]/85 -rotate-45 border border-amber-300/60 shadow-2xs" />
          )}

          <div className="relative z-10 max-w-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-75 block mb-1">
              Vista previa del papel
            </span>
            <h4 className="font-display italic font-bold text-lg mb-1">
              {paperTones.find((t) => t.id === settings.paperTone)?.name} •{' '}
              {paperPatterns.find((p) => p.id === settings.paperPattern)?.name}
            </h4>
            <p className="text-xs opacity-85 font-body">
              • Tarea importante registrada con tinta analógica.
            </p>
          </div>
        </div>

        {/* 1. Paper Tone Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-body flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#2B4789]" /> 1. Tono y Textura del Papel
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {paperTones.map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, paperTone: tone.id })}
                className={`p-2.5 rounded-xl border text-left transition-all relative ${
                  settings.paperTone === tone.id
                    ? 'border-[#2B4789] ring-2 ring-[#2B4789] shadow-sm'
                    : 'border-stone-200 hover:border-stone-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-5 h-5 rounded-full border border-stone-300 shrink-0 shadow-2xs"
                    style={{ backgroundColor: tone.bgHex }}
                  />
                  <span className="font-bold text-xs font-body text-stone-900 truncate">
                    {tone.name}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-body leading-tight">
                  {tone.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Paper Pattern Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-body flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-[#10B183]" /> 2. Patrón de Guía / Cuadrícula
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {paperPatterns.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, paperPattern: pattern.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  settings.paperPattern === pattern.id
                    ? 'border-[#2B4789] bg-blue-50/50 text-[#2B4789] ring-2 ring-[#2B4789] font-bold'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold font-body">{pattern.name}</span>
                  <span className="font-mono text-[11px] opacity-70">{pattern.icon}</span>
                </div>
                <p className="text-[10px] text-stone-500 font-normal font-body leading-tight">
                  {pattern.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Grid Color & Density */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-body">
              Color de Tinta / Puntos
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {gridColors.map((gc) => (
                <button
                  key={gc.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, gridColor: gc.id })}
                  className={`w-7 h-7 rounded-full transition-transform relative ${
                    settings.gridColor === gc.id
                      ? 'scale-125 ring-2 ring-stone-900 ring-offset-2'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: gc.hex }}
                  title={gc.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-body">
              Espaciado entre Guías
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['compact', 'normal', 'spacious'] as const).map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, gridDensity: density })}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold font-body text-center transition-all ${
                    settings.gridDensity === density
                      ? 'bg-[#2B4789] text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {density === 'compact' ? '18px (Fino)' : density === 'normal' ? '24px (Normal)' : '32px (Amplio)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Binding & Accessories */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-body flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-[#E36D9B]" /> 3. Encuadernación & Accesorios Analógicos
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {[
              { id: 'spiral', label: 'Anillado Espiral', desc: 'Espiral metálico a la izquierda' },
              { id: 'stitched', label: 'Encuadernado Clásico', desc: 'Costura plana de libreta' },
              { id: 'leather-folio', label: 'Carpeta Cuero', desc: 'Solapas de piel vintage' },
              { id: 'clean-pad', label: 'Bloc Superior', desc: 'Lomo superior con cinta kraft' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    bindingStyle: b.id as BujoPaperSettings['bindingStyle'],
                  })
                }
                className={`p-2 rounded-xl border text-left transition-all ${
                  settings.bindingStyle === b.id
                    ? 'border-[#2B4789] bg-blue-50/50 text-[#2B4789] font-bold'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="text-xs block font-bold font-body">{b.label}</span>
                <span className="text-[10px] text-stone-500 font-normal block">{b.desc}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showBookmark}
                onChange={(e) => onUpdateSettings({ ...settings, showBookmark: e.target.checked })}
                className="w-4 h-4 rounded text-[#2B4789] focus:ring-[#2B4789]"
              />
              <span className="text-xs font-body text-stone-800">Cinta Marcapáginas de Tela</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showWashiCorners}
                onChange={(e) => onUpdateSettings({ ...settings, showWashiCorners: e.target.checked })}
                className="w-4 h-4 rounded text-[#2B4789] focus:ring-[#2B4789]"
              />
              <span className="text-xs font-body text-stone-800">Cintas Washi Tape decorativas</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#2B4789] hover:bg-[#1E3264] text-white font-bold text-xs font-body shadow-sm active:scale-95 transition-all"
          >
            Guardar y Aplicar Papel
          </button>
        </div>
      </div>
    </Modal>
  );
};
