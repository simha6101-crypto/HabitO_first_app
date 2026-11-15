import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Smile,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BUILTIN_AVATARS, DEFAULT_AVATAR, AvatarItem } from '../data/avatars';
import { validateImageFile, compressImage } from '../utils/imageCompressor';

interface ProfilePictureStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryFilter = 'All' | 'Cute Characters' | 'Animals' | 'Fantasy' | 'Nature' | 'Minimalist';

export const ProfilePictureStudioModal: React.FC<ProfilePictureStudioModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, updateUserAvatar, theme } = useApp();

  const [activeTab, setActiveTab] = useState<'built-in' | 'upload'>('built-in');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(user?.avatar || DEFAULT_AVATAR);

  // Upload State
  const [uploadedRawUrl, setUploadedRawUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync initial selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatarUrl(user?.avatar || DEFAULT_AVATAR);
      setUploadError(null);
      setUploadedRawUrl(null);
      setZoomLevel(1);
    }
  }, [isOpen, user?.avatar]);

  if (!isOpen) return null;

  const categories: CategoryFilter[] = [
    'All',
    'Cute Characters',
    'Animals',
    'Fantasy',
    'Nature',
    'Minimalist'
  ];

  const filteredAvatars = selectedCategory === 'All'
    ? BUILTIN_AVATARS
    : BUILTIN_AVATARS.filter(a => a.category === selectedCategory);

  const currentAvatarMeta = BUILTIN_AVATARS.find(a => a.svgDataUri === selectedAvatarUrl);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input value so same file can be selected again
    e.target.value = '';
    setUploadError(null);

    if (!file) return;

    // Validate MIME type and size <= 5 MB
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUploadedRawUrl(event.target.result);
        setZoomLevel(1);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  // Crop & save uploaded photo to circular avatar
  const handleSaveUploadedPhoto = async () => {
    if (!uploadedRawUrl) return;

    try {
      setIsProcessing(true);
      setUploadError(null);

      // Create a 400x400 square canvas for circular crop
      const canvas = document.createElement('canvas');
      const size = 400;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context unavailable');
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for cropping'));
        img.src = uploadedRawUrl;
      });

      // Clear & fill background
      ctx.clearRect(0, 0, size, size);

      // Create circular clipping path
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      // Compute scaling & centering with zoomLevel
      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;
      const minDim = Math.min(naturalW, naturalH);

      const cropW = (minDim / zoomLevel);
      const cropH = (minDim / zoomLevel);
      const srcX = (naturalW - cropW) / 2;
      const srcY = (naturalH - cropH) / 2;

      ctx.drawImage(img, srcX, srcY, cropW, cropH, 0, 0, size, size);
      ctx.restore();

      // Export as JPEG with 0.8 quality and max dimension 400px
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const compressed = await compressImage(croppedDataUrl, 400, 0.8);

      updateUserAvatar(compressed);
      onClose();
    } catch (err) {
      console.error('Error saving uploaded profile picture:', err);
      setUploadError('Could not process and save image. Please try another photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveBuiltIn = () => {
    updateUserAvatar(selectedAvatarUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        style={{ borderColor: theme.colors.cardBorder }}
      >
        {/* Header */}
        <div
          className="p-4 sm:p-5 border-b flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: theme.colors.primaryBg,
            borderColor: theme.colors.cardBorder
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs"
              style={{ backgroundColor: theme.colors.cardBg }}
            >
              <Sparkles className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
                Profile Picture Studio
              </h2>
              <p className="text-xs text-slate-600">
                Choose an original illustrated avatar or upload your own picture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Mode Selector (Built-in Avatars vs Upload Your Own) */}
        <div className="px-4 sm:px-6 pt-4 shrink-0">
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('built-in');
                setUploadError(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'built-in'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Smile className="w-4 h-4" />
              <span>Illustrated Avatars ({BUILTIN_AVATARS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                setUploadError(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your Own</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'built-in' ? (
            <>
              {/* Top: Large Active Selection & Live Preview */}
              <div
                className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 transition-colors"
                style={{
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder
                }}
              >
                <div className="relative shrink-0">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 shadow-md flex items-center justify-center p-1"
                    style={{ borderColor: theme.colors.primary }}
                  >
                    <img
                      src={selectedAvatarUrl}
                      alt="Selected Avatar Preview"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </div>

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {currentAvatarMeta?.name || 'Custom Selection'}
                    </h3>
                    {currentAvatarMeta && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: theme.colors.primaryBg,
                          color: theme.colors.primary
                        }}
                      >
                        {currentAvatarMeta.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    This avatar will represent your daily streaks and habit proofs in the Navbar, Drawer, Friends Leaderboard and Settings.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSaveBuiltIn}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Save Selection</span>
                  </button>
                </div>
              </div>

              {/* Category Pills Strip */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Categories</span>
                  <span className="text-slate-500">{filteredAvatars.length} Avatars</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${isSelected
                            ? 'text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200'
                          }`}
                        style={{
                          backgroundColor: isSelected ? theme.colors.primary : undefined,
                          borderColor: isSelected ? theme.colors.primary : undefined
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Responsive Avatars Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filteredAvatars.map((avatar: AvatarItem) => {
                  const isSelected = selectedAvatarUrl === avatar.svgDataUri;

                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatarUrl(avatar.svgDataUri)}
                      className={`group flex flex-col items-center p-2 rounded-2xl border transition-all text-center relative ${isSelected
                          ? 'ring-2 shadow-sm scale-105'
                          : 'hover:scale-102 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      style={{
                        backgroundColor: theme.colors.cardBg,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.cardBorder,
                        boxShadow: isSelected ? `0 0 0 2px ${theme.colors.primary}` : undefined
                      }}
                    >
                      {/* Avatar Round Frame */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 relative">
                        <img
                          src={avatar.svgDataUri}
                          alt={avatar.name}
                          className="w-full h-full object-contain rounded-full transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div
                            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20"
                          >
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: theme.colors.primary }}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Avatar Name */}
                      <span className="text-[11px] font-semibold text-slate-800 mt-1.5 truncate max-w-full">
                        {avatar.name}
                      </span>
                      <span className="text-[9px] text-slate-600 truncate max-w-full">
                        {avatar.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Upload Your Own Screen */
            <div className="space-y-5">
              {/* Error Notice */}
              {uploadError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{uploadError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadError(null)}
                    className="text-rose-500 hover:text-rose-800 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {!uploadedRawUrl ? (
                /* Empty Upload Dropzone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all hover:border-slate-400 group space-y-3"
                  style={{
                    borderColor: theme.colors.cardBorder,
                    backgroundColor: theme.colors.cardBg
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-xs"
                    style={{
                      backgroundColor: theme.colors.primaryBg,
                      color: theme.colors.primary
                    }}
                  >
                    <Upload className="w-7 h-7" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Upload personal photo
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Select JPG, JPEG, PNG, or WebP picture. Maximum original size is 5 MB.
                    </p>
                  </div>

                  <div className="pt-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Browse Image File</span>
                    </span>
                  </div>
                </div>
              ) : (
                /* Interactive Circular Crop & Position Preview */
                <div className="space-y-4">
                  <div
                    className="rounded-3xl border p-5 text-center flex flex-col items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundColor: theme.colors.cardBg,
                      borderColor: theme.colors.cardBorder
                    }}
                  >
                    <span className="text-xs font-bold text-slate-600 mb-3">
                      Circular Framing & Positioning Preview
                    </span>

                    {/* Circular Mask Viewport */}
                    <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/80 p-0 bg-slate-950 flex items-center justify-center">
                      <img
                        ref={imgRef}
                        src={uploadedRawUrl}
                        alt="Crop preview"
                        className="max-w-none transition-transform duration-100 object-cover"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          width: '100%',
                          height: '100%'
                        }}
                      />
                      {/* Subdued Target Crosshairs */}
                      <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-full" />
                    </div>

                    {/* Zoom / Scale Controls */}
                    <div className="mt-4 flex items-center gap-3 w-full max-w-xs">
                      <button
                        type="button"
                        onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.2))}
                        className="p-1.5 rounded-lg border text-slate-600 hover:bg-slate-100"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>

                      <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.05"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                        className="flex-1 accent-current"
                        style={{ color: theme.colors.primary }}
                      />

                      <button
                        type="button"
                        onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                        className="p-1.5 rounded-lg border text-slate-600 hover:bg-slate-100"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setZoomLevel(1)}
                        className="p-1.5 rounded-lg border text-slate-600 hover:bg-slate-100"
                        title="Reset zoom"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2">
                      Adjust the zoom slider to frame your face or subject inside the circular avatar.
                    </p>
                  </div>

                  {/* Actions (Confirm & Save or Cancel/Re-select) */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedRawUrl(null);
                        setUploadError(null);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      style={{ borderColor: theme.colors.cardBorder }}
                    >
                      Choose Another File
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleSaveUploadedPhoto}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>{isProcessing ? 'Optimizing...' : 'Save Profile Picture'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
