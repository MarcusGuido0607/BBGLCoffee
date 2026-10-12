import React, { useState, useRef } from 'react';
import { useImageAssets, ASSET_CATALOG, ImageAssetMap } from '../../context/ImageAssetsContext';
import { BbglLogo } from '../brand/BbglLogo';
import { ProductArt } from '../brand/ProductArt';
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  X, 
  FolderOpen, 
  FileCheck, 
  Info, 
  RefreshCcw,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({ isOpen, onClose }) => {
  const { 
    customImages, 
    useRealPhotos, 
    setUseRealPhotos, 
    updateCustomImage, 
    removeCustomImage, 
    bulkUploadImages, 
    clearCustomImages,
    activePhotoCount 
  } = useImageAssets();

  const [isDragging, setIsDragging] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const processFiles = async (files: FileList | File[]) => {
    const result = await bulkUploadImages(files);
    if (result.matched > 0) {
      setUploadFeedback({
        message: `Successfully matched & applied ${result.matched} out of ${result.total} photo(s)!`,
        type: 'success',
      });
    } else {
      setUploadFeedback({
        message: `Processed ${result.total} file(s), but none matched the 9 BBGL item filenames. Check the filename list below.`,
        type: 'error',
      });
    }

    setTimeout(() => {
      setUploadFeedback(null);
    }, 5000);
  };

  const handleSingleItemUpload = (key: keyof ImageAssetMap, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        updateCustomImage(key, reader.result as string);
        setUploadFeedback({
          message: `Updated photo for ${key.replace('_', ' ')}!`,
          type: 'success',
        });
        setTimeout(() => setUploadFeedback(null), 3500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FDFBF7] w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col border border-[#3E2723]/15 overflow-hidden">
        {/* Header */}
        <div className="bg-[#3E2723] text-[#FDFBF7] px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C68B59] flex items-center justify-center text-white shadow-inner">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl text-white">BBGL Photo & Real Asset Studio</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C68B59] text-white">
                  Real Web Images Supported
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#FDFBF7]/80">
                Manage high-resolution photography for Customer Kiosks, Cashier POS, and Back-Office menus.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-[#FDFBF7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Answer & Guidance Banner */}
          <div className="bg-[#F3EDE2] border border-[#C68B59]/30 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-display font-semibold text-base sm:text-lg text-[#3E2723]">
                  Yes! Real images are 100% supported on the web and ready to use right now.
                </h3>
                <p className="text-xs sm:text-sm text-[#5D4037] leading-relaxed">
                  Web apps can load your real cafe photography in two ways:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
                  <div className="bg-white/80 p-3.5 rounded-xl border border-[#3E2723]/10">
                    <span className="font-bold text-[#3E2723] block mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C68B59]" /> Method 1: Instant In-App Upload (Active)
                    </span>
                    <span className="text-[#5D4037]">
                      Drop all 9 photos into the dropzone below. The app matches filenames like <code className="bg-[#F3EDE2] px-1 py-0.5 rounded font-mono text-[11px]">Logo.jpg</code> and <code className="bg-[#F3EDE2] px-1 py-0.5 rounded font-mono text-[11px]">1.1 Chocolate Coffee.jpg</code>, stores them in your browser, and instantly renders them on all screens!
                    </span>
                  </div>
                  <div className="bg-white/80 p-3.5 rounded-xl border border-[#3E2723]/10">
                    <span className="font-bold text-[#3E2723] block mb-1 flex items-center gap-1.5">
                      <FolderOpen className="w-4 h-4 text-[#2E7D32]" /> Method 2: Public Assets Directory
                    </span>
                    <span className="text-[#5D4037]">
                      For deployment, place the 9 image files into the <code className="bg-[#F3EDE2] px-1 py-0.5 rounded font-mono text-[11px]">public/images/</code> folder in the project. The app checks this path automatically with zero extra code needed.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Master Display Mode & Stats Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#3E2723]/10 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#3E2723]">Display Mode:</span>
              <div className="inline-flex rounded-xl bg-[#F3EDE2] p-1 border border-[#3E2723]/10">
                <button
                  type="button"
                  onClick={() => setUseRealPhotos(true)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    useRealPhotos
                      ? 'bg-[#3E2723] text-white shadow-xs'
                      : 'text-[#5D4037] hover:text-[#3E2723]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Real Photos ({activePhotoCount}/9 Active)
                </button>
                <button
                  type="button"
                  onClick={() => setUseRealPhotos(false)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    !useRealPhotos
                      ? 'bg-[#3E2723] text-white shadow-xs'
                      : 'text-[#5D4037] hover:text-[#3E2723]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Branded Vector Art
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#C68B59] hover:bg-[#B37845] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4" />
                Select Multiple Photos
              </button>
              {activePhotoCount > 0 && (
                <button
                  type="button"
                  onClick={clearCustomImages}
                  className="px-3.5 py-2 bg-[#F3EDE2] hover:bg-[#EADBCC] text-[#C62828] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {/* Feedback banner */}
          {uploadFeedback && (
            <div
              className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
                uploadFeedback.type === 'success'
                  ? 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20'
                  : 'bg-[#C62828]/10 text-[#C62828] border border-[#C62828]/20'
              }`}
            >
              {uploadFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <Info className="w-5 h-5 shrink-0" />
              )}
              {uploadFeedback.message}
            </div>
          )}

          {/* Drag & Drop Big Target */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#2E7D32] bg-[#2E7D32]/5 scale-[1.01]'
                : 'border-[#C68B59]/50 hover:border-[#3E2723] bg-white hover:bg-[#FDFBF7]'
            }`}
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#F3EDE2] text-[#C68B59] flex items-center justify-center mb-3">
                <Upload className="w-8 h-8 animate-bounce" />
              </div>
              <h4 className="font-display text-lg sm:text-xl font-bold text-[#3E2723]">
                Drag & Drop All Your Cafe Images Here
              </h4>
              <p className="text-xs sm:text-sm text-[#5D4037] mt-1 mb-3">
                Select or drop your files (<code className="font-mono text-xs font-semibold">Logo.jpg</code>, <code className="font-mono text-xs font-semibold">1.1 Chocolate Coffee.jpg</code>, etc.). The system will automatically map each one to its menu item!
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3EDE2] text-[#3E2723]">
                <FileCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                Auto-detection supports JPG, PNG, WEBP
              </div>
            </div>
          </div>

          {/* 9-Item Asset Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display text-lg font-bold text-[#3E2723]">
                BBGL Item Photo Mapping (9 Total Assets)
              </h4>
              <span className="text-xs text-[#5D4037]">
                Click "Replace" on any item to upload individually.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ASSET_CATALOG.map((item) => {
                const isLogo = item.key === 'logo';
                const hasCustomPhoto = !!customImages[item.key];

                return (
                  <div
                    key={item.key}
                    className="bg-white rounded-2xl border border-[#3E2723]/10 overflow-hidden shadow-xs hover:border-[#C68B59]/50 transition-all flex flex-col"
                  >
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-video bg-[#F3EDE2] overflow-hidden flex items-center justify-center border-b border-[#3E2723]/5">
                      {isLogo ? (
                        <div className="w-24 h-24 flex items-center justify-center">
                          <BbglLogo size={88} animatedSteam={false} />
                        </div>
                      ) : (
                        <ProductArt
                          artKey={item.key}
                          name={item.title}
                          aspectRatio="16/9"
                          className="w-full h-full"
                        />
                      )}

                      {/* Status pill overlay */}
                      <div className="absolute top-2.5 right-2.5">
                        {hasCustomPhoto && useRealPhotos ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2E7D32] text-white flex items-center gap-1 shadow-xs">
                            <CheckCircle2 className="w-3 h-3" /> Real Photo
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#3E2723]/80 text-[#FDFBF7] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C68B59]" /> Vector Art
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h5 className="font-display font-bold text-sm text-[#3E2723]">{item.title}</h5>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F3EDE2] text-[#5D4037]">
                            {item.category.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-[#5D4037] font-mono">
                          <span className="text-[#8D6E63]">Target filename:</span>
                          <span className="font-bold text-[#3E2723]">{item.expectedFilename}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#3E2723]/5">
                        <button
                          type="button"
                          onClick={() => itemInputRefs.current[item.key]?.click()}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-[#F3EDE2] hover:bg-[#C68B59] hover:text-white text-[#3E2723] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          {hasCustomPhoto ? 'Replace Photo' : 'Upload Photo'}
                        </button>
                        {hasCustomPhoto && (
                          <button
                            type="button"
                            onClick={() => removeCustomImage(item.key)}
                            className="p-1.5 rounded-xl hover:bg-[#C62828]/10 text-[#C62828] transition-colors"
                            title="Reset to default illustration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <input
                          type="file"
                          ref={(el) => {
                            itemInputRefs.current[item.key] = el;
                          }}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSingleItemUpload(item.key, e)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F3EDE2] px-6 sm:px-8 py-4 border-t border-[#3E2723]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#5D4037] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#C68B59]" />
            Changes apply in real time to Kiosk, POS Register, and Back-Office views.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#3E2723] hover:bg-[#2E1C18] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>Close & View in App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
