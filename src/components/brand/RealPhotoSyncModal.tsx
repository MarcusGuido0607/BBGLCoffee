import React, { useRef, useState } from 'react';
import { useImageAssets, ImageAssetMap } from '../../context/ImageAssetsContext';
import { MENU_PRODUCTS } from '../../data/mockData';
import { BbglLogo } from './BbglLogo';
import { 
  Upload, 
  CheckCircle2, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  X, 
  Info,
  FolderOpen
} from 'lucide-react';

interface RealPhotoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealPhotoSyncModal: React.FC<RealPhotoSyncModalProps> = ({ isOpen, onClose }) => {
  const { 
    customImages, 
    useRealPhotos, 
    setUseRealPhotos, 
    bulkUploadImages, 
    updateCustomImage, 
    clearCustomImages 
  } = useImageAssets();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotKey, setActiveSlotKey] = useState<keyof ImageAssetMap | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const res = await bulkUploadImages(e.target.files);
    setUploadFeedback(`Successfully loaded and matched ${res.matched} of ${res.total} photo(s)!`);
    setTimeout(() => setUploadFeedback(null), 4000);
  };

  const handleSingleSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] === undefined || !activeSlotKey) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      updateCustomImage(activeSlotKey, reader.result as string);
      setUploadFeedback(`Updated photo for "${activeSlotKey}".`);
      setTimeout(() => setUploadFeedback(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const SLOTS: Array<{ key: keyof ImageAssetMap; title: string; defaultFilename: string }> = [
    { key: 'logo', title: 'Brand Logo Emblem', defaultFilename: 'Logo.jpg' },
    { key: 'chocolate_coffee', title: 'Chocolate Coffee', defaultFilename: '1.1 Chocolate Coffee.jpg' },
    { key: 'signature_latte', title: 'Signature Latte', defaultFilename: '1.2 Signature Coffee Latte.jpg' },
    { key: 'matcha_milktea', title: 'Matcha Milktea', defaultFilename: '1.3 Matcha Milktea.jpg' },
    { key: 'caramel_macchiato', title: 'Caramel Macchiato', defaultFilename: '1.4 Caramel Machiato.jpg' },
    { key: 'brown_sugar_milktea', title: 'Brown Sugar Milk Tea', defaultFilename: '1.5 Brown Sugar Milktea.jpg' },
    { key: 'glazed_cinnamon', title: 'Glazed Cinnamon Roll', defaultFilename: '2.1 Glazed Cinnamon.jpg' },
    { key: 'chocolate_croissant', title: 'Chocolate Croissant', defaultFilename: '2.2 Chocolate Croissant.jpg' },
    { key: 'bbgl_spaghetti', title: 'BBGL Signature Spaghetti', defaultFilename: '2.3 BBGL Signature Spaghetti.jpg' },
  ];

  const totalLoaded = Object.keys(customImages).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#3E2723]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#3E2723]/20 flex flex-col max-h-[90vh] overflow-hidden text-[#3E2723] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#3E2723]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C68B59]/20 text-[#C68B59]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#3E2723] leading-none">
                Real Photos & Media Hub
              </h2>
              <span className="text-[11px] text-[#795548]">
                Sync your 9 camera-ready cafe photos across Kiosk, POS, and Admin Hub
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#795548] hover:text-[#3E2723] hover:bg-[#3E2723]/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Main Dropzone / Bulk Upload Banner */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="p-6 border-2 border-dashed border-[#C68B59] hover:border-[#3E2723] bg-[#F3EDE2]/60 hover:bg-[#F3EDE2] rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-[#C68B59]/20 group-hover:bg-[#C68B59] text-[#C68B59] group-hover:text-white flex items-center justify-center mb-3 transition-colors shadow-xs">
              <Upload className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-display font-bold text-sm text-[#3E2723]">
              Select or Drop Your 9 Real Cafe Photos Here
            </h3>
            <p className="text-[#795548] max-w-md mt-1 leading-relaxed">
              Drop all 9 photos at once (<code className="bg-white/80 px-1 py-0.5 rounded text-[10px]">Logo.jpg</code>, <code className="bg-white/80 px-1 py-0.5 rounded text-[10px]">1.1 Chocolate Coffee.jpg</code>, etc.). The system automatically detects filenames and assigns them to each product slot!
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3E2723] text-white font-bold rounded-xl text-xs shadow-xs group-hover:bg-[#2E1C18]">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Browse Image Files</span>
            </div>
          </div>

          {/* Feedback Toast */}
          {uploadFeedback && (
            <div className="p-3 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/30 text-[#2E7D32] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadFeedback}</span>
            </div>
          )}

          {/* Mode Toggle Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#3E2723]/10">
            <div>
              <div className="font-bold text-sm text-[#3E2723]">Display Preference</div>
              <p className="text-[11px] text-[#795548]">
                Switch between real uploaded camera photography and our vector styling system.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseRealPhotos(true)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  useRealPhotos
                    ? 'bg-[#3E2723] text-white shadow-xs'
                    : 'bg-[#F3EDE2] text-[#795548] hover:text-[#3E2723]'
                }`}
              >
                📸 Real Photography {totalLoaded > 0 ? `(${totalLoaded}/9 Active)` : ''}
              </button>
              <button
                onClick={() => setUseRealPhotos(false)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  !useRealPhotos
                    ? 'bg-[#3E2723] text-white shadow-xs'
                    : 'bg-[#F3EDE2] text-[#795548] hover:text-[#3E2723]'
                }`}
              >
                🎨 Vector Art Mode
              </button>
            </div>
          </div>

          {/* 9 Product Slots Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-sm text-[#3E2723]">
                Asset Slots ({totalLoaded} of 9 Configured)
              </h4>
              {totalLoaded > 0 && (
                <button
                  onClick={clearCustomImages}
                  className="text-[#C62828] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset All to Default</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SLOTS.map((slot) => {
                const photoSrc = customImages[slot.key];
                return (
                  <div
                    key={slot.key}
                    className="p-3 bg-white rounded-2xl border border-[#3E2723]/10 flex items-center gap-3 shadow-2xs hover:border-[#C68B59] transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F3EDE2] border border-[#3E2723]/10 shrink-0 relative flex items-center justify-center">
                      {photoSrc ? (
                        <img
                          src={photoSrc}
                          alt={slot.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-[10px] text-center font-bold text-[#795548] p-1">
                          No Photo
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#3E2723] truncate">{slot.title}</div>
                      <div className="text-[10px] font-mono text-[#795548] truncate">
                        {slot.defaultFilename}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {photoSrc ? (
                          <span className="text-[10px] font-bold text-[#2E7D32] flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Photo Active</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveSlotKey(slot.key);
                              singleInputRef.current?.click();
                            }}
                            className="text-[10px] font-bold text-[#C68B59] hover:underline"
                          >
                            + Upload Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hidden Single Slot Input */}
            <input
              ref={singleInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleSingleSlotUpload}
              className="hidden"
            />
          </div>

          {/* Deployment / Static Hosting Note */}
          <div className="p-4 bg-[#F3EDE2] rounded-2xl border border-[#3E2723]/10 text-[#795548] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#3E2723]">
              <Info className="w-4 h-4 text-[#C68B59]" />
              <span>Permanent Web Hosting Tip</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              When deploying this web application to production on any web server, you can also drop the image files directly into your project's <code className="bg-white/70 px-1 py-0.5 rounded font-mono text-[10px]">public/images/</code> folder. The app will immediately resolve them statically without requiring browser upload!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#3E2723]/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#795548]">
            {totalLoaded} real photos stored in browser session.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#3E2723] hover:bg-[#2E1C18] text-white font-display text-xs font-bold rounded-xl shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
