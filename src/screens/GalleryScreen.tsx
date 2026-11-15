import React, { useState } from 'react';
import { 
  LayoutGrid, 
  ListOrdered, 
  Calendar, 
  Clock, 
  Camera, 
  Sparkles, 
  Heart,
  Plus
} from 'lucide-react';
import { useApp, parseLocalDate } from '../context/AppContext';
import { PhotoProof, ThemeConfig } from '../types';
import { ProofCaptureSourceLabel } from '../components/ProofCaptureSourceLabel';

export const GalleryScreen: React.FC = () => {
  const { habits, theme, setViewingProof, openPhotoCapture, setIsNewHabitModalOpen } = useApp();

  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  // Collect all proofs or filtered by habit
  const allProofs: PhotoProof[] = habits.flatMap(h => h.proofs || []);
  const filteredProofs = (selectedHabitId === 'all' || !habits.some(h => h.id === selectedHabitId))
    ? allProofs
    : allProofs.filter(p => p.habitId === selectedHabitId);

  // Sort proofs descending by timestamp/date using local parsing
  const getProofTime = (p: PhotoProof) => {
    if (p.timestamp) {
      const t = new Date(p.timestamp).getTime();
      if (!isNaN(t)) return t;
    }
    return parseLocalDate(p.date).getTime();
  };

  const sortedProofs = [...filteredProofs].sort((a, b) => 
    getProofTime(b) - getProofTime(a)
  );

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border relative overflow-hidden shadow-xs"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{theme.badgeEmoji}</span>
              <span 
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
              >
                Emotional Visual Proof
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Photo Consistency Gallery
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every photo is timestamped proof of your hard work. Scroll back and see how far you've come!
            </p>
          </div>

          {/* Segmented Tab Control: Grid View vs Timeline View */}
          <div 
            className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start sm:self-center"
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-slate-900 shadow-xs scale-102' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'timeline' 
                  ? 'bg-white text-slate-900 shadow-xs scale-102' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Timeline View</span>
            </button>
          </div>
        </div>

        {/* Habit Filter Horizontal Selector */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedHabitId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              selectedHabitId === 'all'
                ? 'shadow-xs scale-105'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
            style={{
              backgroundColor: selectedHabitId === 'all' ? theme.colors.primaryBg : 'white',
              borderColor: selectedHabitId === 'all' ? theme.colors.primary : theme.colors.cardBorder,
              color: selectedHabitId === 'all' ? theme.colors.primary : undefined,
            }}
          >
            All Habits ({allProofs.length})
          </button>

          {habits.map((habit) => {
            const isSelected = selectedHabitId === habit.id;
            return (
              <button
                key={habit.id}
                onClick={() => setSelectedHabitId(habit.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected 
                    ? 'shadow-xs scale-105' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.colors.primaryBg : 'white',
                  borderColor: isSelected ? theme.colors.primary : theme.colors.cardBorder,
                  color: isSelected ? theme.colors.primary : undefined,
                }}
              >
                <span>{habit.title}</span>
                <span className="text-[11px] opacity-70">({habit.proofs.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Proof Content Display */}
      {sortedProofs.length === 0 ? (
        <div 
          className="rounded-3xl p-10 text-center border bg-white space-y-3"
          style={{ borderColor: theme.colors.cardBorder }}
        >
          <div className="text-4xl">{theme.badgeEmoji}</div>
          <h3 className="font-bold text-slate-900 text-base">No Photo Proofs Logged Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Habits need photo proof to appear here. Tap the button below to snap your first verified milestone!
          </p>
          <button
            onClick={() => {
              if (habits.length > 0) {
                openPhotoCapture(habits[0].id);
              } else {
                setIsNewHabitModalOpen(true);
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-105"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {habits.length > 0 ? 'Snap First Photo Proof' : '+ Create Your First Habit'}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (Compact 2-Column on Mobile, 3 on Tablet, 4 on Desktop) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
          {sortedProofs.map((proof) => (
            <GalleryGridCard
              key={proof.id}
              proof={proof}
              theme={theme}
              onSelect={() => setViewingProof(proof)}
            />
          ))}
        </div>
      ) : (
        /* TIMELINE VIEW (Chronological Story Feed) */
        <div className="space-y-4 max-w-2xl mx-auto">
          {sortedProofs.map((proof) => (
            <GalleryTimelineCard
              key={proof.id}
              proof={proof}
              theme={theme}
              onSelect={() => setViewingProof(proof)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPACT GALLERY GRID CARD COMPONENT
// ==========================================
const GalleryGridCard: React.FC<{
  proof: PhotoProof;
  theme: ThemeConfig;
  onSelect: () => void;
}> = ({ proof, theme, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className="group rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-offset-1 select-none"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.cardBorder
      }}
    >
      {/* 1:1 Square Thumbnail Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-900/5 dark:bg-slate-800">
        {imageError || !proof.photoUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Camera className="w-5 h-5 text-slate-400 stroke-[1.5]" />
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1">
              Image unavailable
            </span>
          </div>
        ) : (
          <img
            src={proof.photoUrl}
            alt={proof.habitTitle}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Floating sticker badge */}
        <div className="absolute top-1.5 right-1.5 bg-black/45 backdrop-blur-xs text-white text-[11px] px-1.5 py-0.5 rounded-full select-none shadow-xs pointer-events-none">
          {proof.sticker || theme.badgeEmoji}
        </div>
      </div>

      {/* Compact Card Metadata */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 gap-1 min-w-0">
        <div className="min-w-0">
          <h3 
            className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate leading-tight" 
            title={proof.habitTitle}
          >
            {proof.habitTitle}
          </h3>
          {proof.caption && (
            <p 
              className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 leading-snug mt-0.5" 
              title={proof.caption}
            >
              {proof.caption}
            </p>
          )}
        </div>

        {/* Compact Footer: Date, Capture Source, Heart count */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60 mt-0.5 gap-1">
          <div className="flex items-center gap-1 min-w-0 overflow-hidden">
            <span className="shrink-0">{proof.date}</span>
            <ProofCaptureSourceLabel captureSource={proof.captureSource} className="shrink-0" />
          </div>
          <span className="flex items-center gap-0.5 text-rose-500 font-semibold shrink-0 ml-auto">
            <Heart className="w-2.5 h-2.5 fill-current" />
            {proof.likes || 1}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// GALLERY TIMELINE CARD COMPONENT
// ==========================================
const GalleryTimelineCard: React.FC<{
  proof: PhotoProof;
  theme: ThemeConfig;
  onSelect: () => void;
}> = ({ proof, theme, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className="p-3.5 sm:p-5 rounded-3xl border shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5 text-left focus:outline-none focus:ring-2 focus:ring-offset-1 select-none"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.cardBorder
      }}
    >
      {/* Header with Habit title, date & time */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl select-none shrink-0">{proof.sticker || theme.badgeEmoji}</span>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{proof.habitTitle}</h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {proof.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(proof.timestamp || proof.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <ProofCaptureSourceLabel captureSource={proof.captureSource} />
            </div>
          </div>
        </div>

        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
        >
          Verified
        </span>
      </div>

      {/* Photo Display */}
      <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-900/10 dark:bg-slate-950">
        {imageError || !proof.photoUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-100 dark:bg-slate-900 text-slate-400">
            <Camera className="w-8 h-8 text-slate-400 stroke-[1.5]" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">
              Photo unavailable
            </span>
          </div>
        ) : (
          <img
            src={proof.photoUrl}
            alt={proof.habitTitle}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Caption & Cheer count */}
      <div className="flex items-center justify-between text-xs pt-0.5 gap-2">
        <p className="text-slate-700 dark:text-slate-300 italic font-medium line-clamp-2">
          “{proof.caption || 'Habit completed with photo evidence!'}”
        </p>
        <div className="flex items-center gap-1 text-rose-500 font-bold shrink-0">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{proof.likes || 1}</span>
        </div>
      </div>
    </div>
  );
};
