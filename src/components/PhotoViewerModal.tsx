import React from 'react';
import { X, Calendar, Clock, Heart, Trash2, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp, parseLocalDate } from '../context/AppContext';
import { ProofCaptureSourceLabel } from './ProofCaptureSourceLabel';

export const PhotoViewerModal: React.FC = () => {
  const { viewingProof, setViewingProof, deletePhotoProof, theme } = useApp();

  if (!viewingProof) return null;

  const formattedDate = viewingProof.date
    ? parseLocalDate(viewingProof.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : new Date(viewingProof.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

  const formattedTime = new Date(viewingProof.timestamp || viewingProof.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setViewingProof(null)}
      />

      {/* Modal Card */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: theme.colors.cardBorder }}
      >
        {/* Top Header */}
        <div 
          className="p-4 border-b flex items-center justify-between"
          style={{ backgroundColor: theme.colors.primaryBg, borderColor: theme.colors.cardBorder }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">{viewingProof.sticker || theme.badgeEmoji}</span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">
                {viewingProof.habitTitle}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formattedTime}
                </span>
                <ProofCaptureSourceLabel captureSource={viewingProof.captureSource} />
              </div>
            </div>
          </div>

          <button
            onClick={() => setViewingProof(null)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full Photo Preview */}
        <div className="relative bg-slate-950 aspect-4/3 flex items-center justify-center overflow-hidden">
          <img 
            src={viewingProof.photoUrl || ''} 
            alt={viewingProof.habitTitle} 
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.img-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'img-fallback absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs p-4 text-center';
                fallback.innerHTML = '<span>📷</span><span class="text-sm font-semibold mt-1">Photo unavailable</span>';
                parent.appendChild(fallback);
              }
            }}
            className="w-full h-full object-cover"
          />

          {/* Verified Ribbon */}
          <div className="absolute top-3 left-3 bg-emerald-500/90 text-white backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Proof</span>
          </div>

          {/* Theme Mascot Stamp */}
          <div 
            className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 border border-white/50"
            style={{ backgroundColor: `${theme.colors.cardBg}EE` }}
          >
            <span className="text-base">{viewingProof.sticker || theme.badgeEmoji}</span>
            <span className="text-slate-700 text-[10px] uppercase font-bold">{theme.character}</span>
          </div>
        </div>

        {/* Caption & Actions Footer */}
        <div className="p-4 sm:p-5 space-y-4">
          {viewingProof.caption && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
              “{viewingProof.caption}”
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-rose-500 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-current" />
                {viewingProof.likes || 1} Cheer
              </span>
              <span className="text-slate-400">·</span>
              <span>Encrypted on-chain proof</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Delete this photo proof? This will decrement your streak.')) {
                    deletePhotoProof(viewingProof.id);
                  }
                }}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                title="Delete proof"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Proof share link copied to clipboard!');
                }}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Share proof"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
