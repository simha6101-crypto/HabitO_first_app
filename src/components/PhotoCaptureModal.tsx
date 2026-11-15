import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Check, 
  Sparkles, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { useApp, parseLocalDate } from '../context/AppContext';
import { validateImageFile, compressImage } from '../utils/imageCompressor';
import { PhotoCaptureSource } from '../types';
import { createImageDHash } from '../utils/imageHash';
import { findSimilarProof, SimilarProofMatch } from '../utils/proofSimilarity';

export const PhotoCaptureModal: React.FC = () => {
  const { 
    photoModalHabitId, 
    closePhotoCapture, 
    habits, 
    addPhotoProof, 
    theme, 
    selectedDate 
  } = useApp();

  const habit = habits.find(h => h.id === photoModalHabitId);

  // Mode: 'camera' | 'preview'
  const [activeTab, setActiveTab] = useState<'camera' | 'preview'>('preview');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [selectedSticker, setSelectedSticker] = useState<string>('');
  const [selectedCaptureSource, setSelectedCaptureSource] = useState<PhotoCaptureSource | undefined>();
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [similarProofMatch, setSimilarProofMatch] = useState<SimilarProofMatch | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Set default theme sticker when modal opens
  useEffect(() => {
    if (!selectedSticker && theme.stickers[0]?.emoji) {
      setSelectedSticker(theme.stickers[0].emoji);
    }
  }, [theme, selectedSticker]);

  // Clean up camera stream when modal unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Stop camera whenever leaving camera tab
  useEffect(() => {
    if (activeTab !== 'camera') {
      stopCamera();
    }
  }, [activeTab]);

  // Stop camera when switching browser tabs/windows
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Ensure stream is attached to video element when camera mode renders
  useEffect(() => {
    if (activeTab === 'camera' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [activeTab, isCameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore error on already stopped track
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    // Stop any previous camera stream first
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      const errorObj = err as { name?: string };
      let msg = 'Camera access not available or denied. You can upload a photo from your device instead.';
      if (errorObj?.name === 'NotAllowedError' || errorObj?.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in your browser or upload a photo instead.';
      } else if (errorObj?.name === 'NotFoundError' || errorObj?.name === 'DevicesNotFoundError') {
        msg = 'No camera device was detected on your system. You can upload a photo from your device!';
      }
      setCameraError(msg);
      setIsCameraActive(false);
      stopCamera();
    }
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      let width = video.videoWidth || 640;
      let height = video.videoHeight || 480;

      if (width === 0 || height === 0) {
        setCameraError('Camera stream is not ready yet. Please wait a moment and try again.');
        return;
      }

      // Resize to max dimension 800px while preserving aspect ratio
      const maxDimension = 800;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);
        // JPEG output with ~0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setSelectedPhotoUrl(dataUrl);
        setSelectedCaptureSource('camera');
        stopCamera();
        setActiveTab('preview'); // Return to preview
      } else {
        setCameraError('Unable to process camera frame. Please try uploading a photo instead.');
      }
    } catch (err) {
      console.warn('Camera capture error:', err);
      setCameraError('An error occurred while capturing the photo. Please try uploading instead.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Always reset input value immediately so selecting the same file again triggers onChange
    e.target.value = '';

    if (!file) return;

    // Validate MIME type and size <= 5 MB
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file.');
      return;
    }

    setUploadError(null);
    setIsProcessingImage(true);

    try {
      // Compress to max dimension 800px and JPEG quality ~0.7
      const compressedDataUrl = await compressImage(file, 800, 0.7);
      if (compressedDataUrl) {
        setSelectedPhotoUrl(compressedDataUrl);
        setSelectedCaptureSource('gallery');
        setActiveTab('preview'); // Return to preview tab
      } else {
        setUploadError('Unable to process the image. The file may be corrupted or in an unsupported format.');
      }
    } catch {
      setUploadError('Error compressing image. Please try another photo.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const saveProof = (imageHash?: string) => {
    if (!habit || !selectedPhotoUrl) return;
    addPhotoProof(habit.id, selectedPhotoUrl, caption, selectedSticker, selectedCaptureSource, imageHash);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habit || !selectedPhotoUrl || isProcessingImage || isHashing || similarProofMatch) return;
    stopCamera();
    setIsHashing(true);

    try {
      const imageHash = await createImageDHash(selectedPhotoUrl);
      const replacedProofIds = habit.proofs
        .filter(proof => proof.date === selectedDate)
        .map(proof => proof.id);
      const similarProof = imageHash
        ? findSimilarProof(imageHash, habits.flatMap(currentHabit => currentHabit.proofs), replacedProofIds)
        : undefined;

      if (similarProof) {
        setSimilarProofMatch(similarProof);
      } else {
        saveProof(imageHash);
      }
    } catch {
      // Hashing is advisory; a failure must not interrupt proof submission.
      saveProof();
    } finally {
      setIsHashing(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setSimilarProofMatch(null);
    setSelectedPhotoUrl('');
    setSelectedCaptureSource(undefined);
    setActiveTab('preview');
    setCaption('');
    setCameraError(null);
    setUploadError(null);
    closePhotoCapture();
  };

  if (!habit || !photoModalHabitId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: theme.colors.cardBorder }}
      >
        {/* Header */}
        <div 
          className="p-5 border-b flex items-center justify-between"
          style={{ backgroundColor: theme.colors.primaryBg, borderColor: theme.colors.cardBorder }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: theme.colors.cardBg }}
            >
              <Camera className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Log Photo Proof
              </h3>
              <p className="text-xs text-slate-600">
                {habit.title} · {selectedDate}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Mode Selector */}
        <div className="px-5 pt-4">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setUploadError(null);
                setActiveTab('camera');
                startCamera();
              }}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'camera' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopCamera();
                setActiveTab('preview');
                setUploadError(null);
                fileInputRef.current?.click();
              }}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'preview' && selectedPhotoUrl && selectedCaptureSource === 'gallery'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload from Gallery</span>
            </button>
          </div>
        </div>

        {/* Body & Photo Selection Area */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Upload Error Banner */}
          {uploadError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setUploadError(null)} 
                className="p-1 rounded-lg text-rose-400 hover:text-rose-700 transition-colors"
                aria-label="Dismiss error"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Processing image indicator */}
          {isProcessingImage && (
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 text-xs flex items-center justify-center gap-2 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
              <span>Optimizing and compressing photo (max 800px)...</span>
            </div>
          )}

          {isHashing && (
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 text-xs flex items-center justify-center gap-2 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
              <span>Checking this photo against previous proofs...</span>
            </div>
          )}

          {/* Camera View Mode */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center border border-slate-700">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                
                {cameraError && (
                  <div className="absolute inset-0 bg-slate-900/90 p-5 text-center flex flex-col items-center justify-center text-white text-xs space-y-3">
                    <AlertCircle className="w-6 h-6 text-rose-400" />
                    <p className="max-w-xs">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        setActiveTab('preview');
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo Instead</span>
                    </button>
                  </div>
                )}
              </div>

              {isCameraActive && !cameraError && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={captureCameraFrame}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Proof Photo</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Active Photo Preview & Empty Selection Area */}
          {activeTab !== 'camera' && (
            <div className="space-y-3">
              {selectedPhotoUrl ? (
                /* Selected Photo Preview */
                <div 
                  className="relative rounded-2xl overflow-hidden aspect-16/10 border-2 shadow-xs group"
                  style={{ borderColor: theme.colors.cardBorder }}
                >
                  <img 
                    src={selectedPhotoUrl} 
                    alt="Proof Preview" 
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.preview-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'preview-fallback absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 text-xs p-4 text-center';
                        fallback.innerHTML = '<span>📷</span><span class="text-xs mt-1">Image preview unavailable</span>';
                        parent.appendChild(fallback);
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  {/* Selected theme sticker stamp overlay */}
                  {selectedSticker && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1 border border-white">
                      <span>{selectedSticker}</span>
                      <span className="text-[10px] text-slate-700 uppercase tracking-wider">{theme.character}</span>
                    </div>
                  )}

                  {/* Retake / Change Photo hover & quick action overlay */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadError(null);
                        setActiveTab('camera');
                        startCamera();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1 transition-all"
                      title="Retake using camera"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Retake</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadError(null);
                        fileInputRef.current?.click();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1 transition-all"
                      title="Upload different photo"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Initial Direct Selection & Empty State */
                <div 
                  className="rounded-2xl border-2 border-dashed p-6 sm:p-7 flex flex-col items-center justify-center text-center gap-3 transition-colors"
                  style={{ 
                    backgroundColor: `${theme.colors.canvasBg}80`,
                    borderColor: theme.colors.cardBorder 
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
                    style={{ 
                      backgroundColor: theme.colors.primaryBg, 
                      color: theme.colors.primary 
                    }}
                  >
                    <Camera className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Add Real Habit Photo Proof
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                      ProofHabit requires your own real photos to verify consistency. Snap a live photo or upload from your device gallery.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadError(null);
                        setActiveTab('camera');
                        startCamera();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:scale-105 active:scale-95"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadError(null);
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border text-slate-700 shadow-xs hover:bg-slate-50 transition-all active:scale-95"
                      style={{ borderColor: theme.colors.cardBorder }}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Gallery</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Celebration Sticker Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
              <span>Theme Proof Sticker Stamp</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {theme.stickers.map((stk) => {
                const isSelected = selectedSticker === stk.emoji;
                return (
                  <button
                    key={stk.name}
                    type="button"
                    onClick={() => setSelectedSticker(stk.emoji)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected 
                        ? 'shadow-xs scale-105 font-bold' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                    style={{
                      backgroundColor: isSelected ? theme.colors.primaryBg : 'white',
                      borderColor: isSelected ? theme.colors.primary : theme.colors.cardBorder,
                      color: isSelected ? theme.colors.primary : undefined
                    }}
                  >
                    <span>{stk.emoji}</span>
                    <span>{stk.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caption Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Note or Reflection
            </label>
            <input 
              type="text" 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Completed today's sets! Felt so good."
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{
                borderColor: theme.colors.cardBorder
              }}
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              style={{ borderColor: theme.colors.cardBorder }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!selectedPhotoUrl || isProcessingImage || isHashing || !!similarProofMatch}
              className="flex-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all duration-200 hover:opacity-95 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.colors.primary,
                boxShadow: `0 4px 14px ${theme.colors.cardBorder}`
              }}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Verify & Save Proof</span>
            </button>
          </div>
        </form>

        {similarProofMatch && (
          <div className="absolute inset-0 z-20 bg-white/98 backdrop-blur-xs p-5 flex items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-4 shadow-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Similar proof detected</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    This photo appears too similar to an existing proof and cannot be saved. Please choose another photo to verify your habit.
                  </p>
                  <p className="text-xs font-medium text-slate-700 mt-2">
                    Previous similar proof: {parseLocalDate(similarProofMatch.proof.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSimilarProofMatch(null);
                    setSelectedPhotoUrl('');
                    setSelectedCaptureSource(undefined);
                    setActiveTab('preview');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
                  style={{ borderColor: theme.colors.cardBorder }}
                >
                  Choose Another Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
