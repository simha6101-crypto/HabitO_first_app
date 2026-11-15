import React from 'react';
import { 
  Camera, 
  CheckCircle2, 
  Flame, 
  MoreVertical, 
  Image as ImageIcon, 
  Dumbbell, 
  Droplets, 
  BookOpen, 
  Monitor, 
  Sparkles,
  Heart,
  Trash2,
  Pencil,
  Pause,
  Play
} from 'lucide-react';
import { Habit } from '../types';
import { useApp, parseLocalDate, addDays } from '../context/AppContext';
import { ProofCaptureSourceLabel } from './ProofCaptureSourceLabel';

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { 
    theme, 
    selectedDate, 
    openPhotoCapture, 
    setViewingProof, 
    setCurrentScreen,
    deleteHabit,
    openHabitEditor,
    toggleHabitPaused
  } = useApp();

  const [menuOpen, setMenuOpen] = React.useState(false);

  // Icon mapping
  const renderIcon = () => {
    const props = { className: "w-5 h-5", style: { color: habit.color || theme.colors.primary } };
    switch (habit.icon) {
      case 'dumbbell': return <Dumbbell {...props} />;
      case 'droplets': return <Droplets {...props} />;
      case 'book-open': return <BookOpen {...props} />;
      case 'monitor': return <Monitor {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'sparkles': return <Sparkles {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  // Find proof for selected date
  const todayProof = habit.proofs.find(p => p.date === selectedDate);
  const isCompletedToday = !!todayProof;

  // Calculate weekly progress (number of proofs in current week of selectedDate) using local calendar dates
  const selectedDateObj = parseLocalDate(selectedDate);
  const dayOfWeek = selectedDateObj.getDay(); // 0 is Sun, 1 is Mon
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayStr = addDays(selectedDate, diffToMonday);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(mondayStr, i));

  const proofsThisWeek = habit.proofs.filter(p => weekDates.includes(p.date)).length;
  const targetDays = habit.targetDaysPerWeek || 7;
  const progressPercent = Math.min(100, Math.round((proofsThisWeek / targetDays) * 100));

  return (
    <div 
      className="rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden relative"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.cardBorder,
      }}
    >
      {/* Top Section */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Icon & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
              style={{
                backgroundColor: `${habit.color || theme.colors.primary}15`,
                border: `1px solid ${habit.color || theme.colors.primary}30`
              }}
            >
              {renderIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">
                {habit.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span>{habit.category}</span>
                <span aria-hidden="true">·</span>
                <span>{habit.targetDaysPerWeek}d / week</span>
                {habit.isPaused && (
                  <span
                    className="font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${habit.color || theme.colors.primary}18`, color: habit.color || theme.colors.primary }}
                  >
                    Paused
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Habit Menu & Streak Flame */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div 
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: theme.colors.primaryBg,
                color: theme.colors.streakColor
              }}
              title={`${habit.streak} days current streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{habit.streak}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Habit options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 text-xs">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        openHabitEditor(habit);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Habit</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        toggleHabitPaused(habit.id);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      {habit.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{habit.isPaused ? 'Resume Habit' : 'Pause Habit'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setCurrentScreen('gallery');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>View Proof Gallery ({habit.proofs.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`Delete habit "${habit.title}"?`)) {
                          deleteHabit(habit.id);
                        }
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Habit</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="text-slate-600 font-medium truncate">Weekly Consistency</span>
            <span className="font-bold text-slate-800 shrink-0">
              {proofsThisWeek}/{targetDays} days ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Proof Action or Verified State */}
      <div 
        className="p-3 sm:px-4 sm:py-3 border-t bg-slate-50/50 flex items-center justify-between gap-2 sm:gap-3"
        style={{ borderColor: `${theme.colors.cardBorder}60` }}
      >
        {habit.isPaused ? (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Pause className="w-4 h-4 shrink-0" style={{ color: habit.color || theme.colors.primary }} />
            <span className="text-xs">This habit is paused. Resume it when you are ready.</span>
          </div>
        ) : isCompletedToday ? (
          /* Proof Completed State: Click to view photo */
          <div className="flex items-center justify-between gap-2 w-full min-w-0">
            <button
              onClick={() => setViewingProof(todayProof)}
              className="flex items-center gap-2.5 sm:gap-3 text-left group min-w-0 flex-1"
            >
              {/* Photo Proof Thumbnail with Check Overlay */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border-2 border-emerald-400 shadow-xs">
                <img 
                  src={todayProof.photoUrl || ''} 
                  alt="Verified Proof" 
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.img-fallback')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'img-fallback absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-400 text-xs';
                      fallback.innerHTML = '<span>📷</span>';
                      parent.appendChild(fallback);
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Photo Proof Verified!</span>
                </div>
                <p className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-[220px]">
                  {todayProof.caption || 'Tap to view proof photo'}
                </p>
                <ProofCaptureSourceLabel captureSource={todayProof.captureSource} className="text-[10px] text-slate-400 mt-0.5" />
              </div>
            </button>

            {/* Retake / Snap new button */}
            <button
              onClick={() => openPhotoCapture(habit.id)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border text-slate-600 hover:text-slate-900 hover:bg-white transition-colors shrink-0"
              style={{ borderColor: theme.colors.cardBorder }}
              title="Replace or retake today's photo proof"
            >
              Retake
            </button>
          </div>
        ) : (
          /* Proof Pending State: Prominent "+ Photo Proof" CTA */
          <div className="flex items-center justify-between gap-2 w-full min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-600 min-w-0">
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">Photo required</span>
            </div>

            <button
              onClick={() => openPhotoCapture(habit.id)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:scale-105 active:scale-95 shrink-0"
              style={{
                backgroundColor: theme.colors.primary,
                boxShadow: `0 4px 12px ${theme.colors.cardBorder}`
              }}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>+ Photo Proof</span>
            </button>
          </div>
        )}
      </div>

      {/* Tiny theme mascot corner sticker */}
      <span 
        className="absolute top-2 right-9 text-xs opacity-40 select-none pointer-events-none"
        aria-hidden="true"
      >
        {theme.stickers[0]?.emoji}
      </span>
    </div>
  );
};
