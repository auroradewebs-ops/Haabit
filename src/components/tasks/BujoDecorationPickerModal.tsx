import React, { useState } from 'react';
import { BujoImageLayout, Task } from '../../types';
import { Modal } from '../common/Modal';
import { BUJO_STICKER_PRESETS, BujoStickerPreset } from '../../utils/bujoPresets';
import {
  Image,
  Upload,
  Link,
  Sparkles,
  Trash2,
  Check,
  Tag,
  Scissors,
  Camera,
  Layers,
  FileImage,
} from 'lucide-react';

interface BujoDecorationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  currentImageLayout?: BujoImageLayout;
  currentCaption?: string;
  onSaveDecoration: (decoration: {
    imageUrl?: string;
    imageLayout?: BujoImageLayout;
    imageCaption?: string;
  }) => void;
}

export const BujoDecorationPickerModal: React.FC<BujoDecorationPickerModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl = '',
  currentImageLayout = 'polaroid',
  currentCaption = '',
  onSaveDecoration,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl);
  const [imageLayout, setImageLayout] = useState<BujoImageLayout>(currentImageLayout || 'polaroid');
  const [caption, setCaption] = useState<string>(currentCaption || '');
  const [urlInput, setUrlInput] = useState<string>(currentImageUrl.startsWith('http') ? currentImageUrl : '');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Filter presets
  const filteredPresets = BUJO_STICKER_PRESETS.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen es demasiado grande (máximo 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Error al leer el archivo de imagen.');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: BujoStickerPreset) => {
    setImageUrl(preset.url);
    setImageLayout(preset.defaultLayout);
    if (!caption && preset.caption) {
      setCaption(preset.caption);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setImageUrl(urlInput.trim());
    }
  };

  const handleSave = () => {
    onSaveDecoration({
      imageUrl: imageUrl.trim() || undefined,
      imageLayout: imageUrl.trim() ? imageLayout : undefined,
      imageCaption: imageUrl.trim() ? caption.trim() : undefined,
    });
    onClose();
  };

  const handleRemove = () => {
    setImageUrl('');
    setCaption('');
    onSaveDecoration({
      imageUrl: undefined,
      imageLayout: undefined,
      imageCaption: undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Decoración & Stickers BuJo"
      subtitle="Añade fotos polaroid, sellos vintage, tiras washi tape y stickers a tus entradas"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-white text-[#2B4789] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E36D9B]" />
            <span>Galería de Stickers & Fotos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-[#2B4789] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#10B183]" />
            <span>Subir desde mi Dispositivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-white text-[#2B4789] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Link className="w-3.5 h-3.5 text-[#E7DD6A]" />
            <span>Enlace / URL Externa</span>
          </button>
        </div>

        {/* Tab 1: Presets Gallery */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            {/* Category pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'washi', label: 'Washi Tapes' },
                { id: 'vintage', label: 'Sellos & Vintage' },
                { id: 'cozy', label: 'Cozy & Café' },
                { id: 'botanical', label: 'Botánica' },
                { id: 'focus', label: 'Enfoque & Metas' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap font-body transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#2B4789] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid of presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`group relative rounded-xl border p-1.5 text-left transition-all overflow-hidden ${
                    imageUrl === preset.url
                      ? 'border-[#2B4789] ring-2 ring-[#2B4789] bg-blue-50/50'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-lg overflow-hidden bg-stone-100 mb-1.5 relative">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {imageUrl === preset.url && (
                      <div className="absolute inset-0 bg-[#2B4789]/30 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-[#2B4789] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold font-body text-stone-800 line-clamp-1 block">
                    {preset.name}
                  </span>
                  <span className="text-[9px] uppercase font-mono text-stone-500 font-semibold">
                    {preset.defaultLayout}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Upload File */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-stone-300 hover:border-[#2B4789] rounded-2xl p-6 text-center bg-stone-50/50 transition-colors">
              <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10B183] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-body text-stone-800">
                  Selecciona una imagen de tu galería o dispositivo
                </span>
                <span className="text-[11px] text-stone-500 font-body">
                  Soporta JPG, PNG, WebP o GIF (máx. 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="mt-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold font-body hover:bg-stone-800">
                  Explorar Archivos
                </span>
              </label>
            </div>
            {uploadError && (
              <p className="text-xs font-body text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {uploadError}
              </p>
            )}
          </div>
        )}

        {/* Tab 3: URL */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 font-body">
              URL de Imagen Externa (Unsplash, Pinterest, etc.)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs font-body rounded-xl border border-stone-200 focus:outline-none focus:border-[#2B4789]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 bg-[#2B4789] text-white text-xs font-bold font-body rounded-xl hover:bg-[#1E3264]"
              >
                Cargar
              </button>
            </div>
          </div>
        )}

        {/* Live Preview & Style Config (If an image is selected) */}
        {imageUrl && (
          <div className="p-4 rounded-2xl bg-amber-50/40 border-2 border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 font-body flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#2B4789]" /> Estilo de Montaje Analógico
              </span>
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="text-[11px] font-body text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Quitar imagen
              </button>
            </div>

            {/* Layout selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'polaroid', label: 'Polaroid', desc: 'Marco blanco con cinta' },
                { id: 'stamp', label: 'Sello Postal', desc: 'Bordes troquelados' },
                { id: 'washi', label: 'Washi Tape', desc: 'Banda horizontal' },
                { id: 'sticker', label: 'Sticker', desc: 'Recorte flotante' },
                { id: 'banner', label: 'Banner Top', desc: 'Cabecera superior' },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setImageLayout(l.id as BujoImageLayout)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    imageLayout === l.id
                      ? 'border-[#2B4789] bg-[#2B4789] text-white font-bold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-xs block font-body">{l.label}</span>
                  <span className={`text-[10px] block ${imageLayout === l.id ? 'text-white/80' : 'text-stone-400'}`}>
                    {l.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Caption Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1 font-body">
                Pie de foto o anotación caligráfica (opcional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ej: Momento de inspiración matutina..."
                className="w-full px-3 py-1.5 text-xs font-body rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#2B4789]"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between">
          {currentImageUrl ? (
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold font-body transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Decoración</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold font-body hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-[#2B4789] hover:bg-[#1E3264] text-white text-xs font-bold font-body shadow-sm active:scale-95 transition-all"
            >
              Guardar en la Entrada
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
