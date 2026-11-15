import React from 'react';
import { 
  Award, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Camera, 
  Flame, 
  Share2, 
  Download,
  Calendar,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RecapScreen: React.FC = () => {
  const { user, habits, theme, setViewingProof, setIsNewHabitModalOpen, setCurrentScreen } = useApp();

  const allProofs = habits.flatMap(h => h.proofs);

  // Compute finished, in-progress, missed metrics
  const totalHabits = habits.length;
  const finishedHabits = habits.filter(h => h.streak >= 7).length;
  const inProgressHabits = habits.filter(h => h.streak > 0 && h.streak < 7).length;
  const missedHabits = Math.max(0, totalHabits - finishedHabits - inProgressHabits);

  const completionRate = totalHabits > 0 
    ? Math.round(((finishedHabits * 1.0 + inProgressHabits * 0.5) / totalHabits) * 100) 
    : 0;

  const unlockedBadgesCount = user?.badges?.length ?? 0;
  const totalProofsCount = user?.totalProofs ?? 0;

  // Empty state when there are no habits
  if (totalHabits === 0) {
    return (
      <div className="space-y-6">
        {/* Header Banner */}
        <div 
          className="rounded-3xl p-5 sm:p-6 border relative overflow-hidden shadow-xs"
          style={{
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.cardBorder
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{theme.badgeEmoji}</span>
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
            >
              Monthly Consistency Recap
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Consistency Milestones & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
            Real photo evidence of your daily dedication. Create habits to start building your visual proof record.
          </p>
        </div>

        {/* Empty State Card */}
        <div 
          className="p-8 sm:p-12 rounded-3xl border text-center flex flex-col items-center justify-center space-y-4 shadow-xs"
          style={{
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.cardBorder
          }}
        >
          <div 
            className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-xs"
            style={{ backgroundColor: theme.colors.primaryBg }}
          >
            <Award className="w-8 h-8" style={{ color: theme.colors.primary }} />
          </div>

          <div className="max-w-md space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">
              No Habits Created Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              You do not have any active habits. Add a habit and log verified daily photo proofs to unlock monthly consistency stats, streak timelines, and achievement badges!
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentScreen('home');
              setIsNewHabitModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all hover:scale-105"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Your First Habit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
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
                October 2026 Monthly Recap
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Consistency Milestones & Badges
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
              Real photo evidence of your daily dedication. You’re building tangible proof of who you are becoming!
            </p>
          </div>

          <div 
            className="p-3 rounded-2xl border text-center self-start sm:self-center"
            style={{ backgroundColor: theme.colors.primaryBg, borderColor: theme.colors.cardBorder }}
          >
            <div className="text-2xl font-black" style={{ color: theme.colors.primary }}>
              {completionRate}%
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
              Consistency Rate
            </div>
          </div>
        </div>
      </div>

      {/* Finished / In-Progress / Missed Counts */}
      <div className="grid grid-cols-3 gap-3">
        {/* Finished / Mastered */}
        <div 
          className="p-4 rounded-2xl border bg-white shadow-xs flex flex-col items-center text-center justify-center space-y-1"
          style={{ borderColor: '#BBF7D0' }}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {finishedHabits}
          </div>
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Finished (7d+)
          </div>
          <div className="text-[10px] text-slate-500">Streak mastered</div>
        </div>

        {/* In-Progress */}
        <div 
          className="p-4 rounded-2xl border bg-white shadow-xs flex flex-col items-center text-center justify-center space-y-1"
          style={{ borderColor: theme.colors.cardBorder }}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
            style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {inProgressHabits}
          </div>
          <div 
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: theme.colors.primary }}
          >
            In-Progress
          </div>
          <div className="text-[10px] text-slate-500">Active streaks</div>
        </div>

        {/* Missed / Rest */}
        <div 
          className="p-4 rounded-2xl border bg-white shadow-xs flex flex-col items-center text-center justify-center space-y-1"
          style={{ borderColor: '#FED7AA' }}
        >
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {missedHabits}
          </div>
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            Missed / Rest
          </div>
          <div className="text-[10px] text-slate-500">Ready to revive</div>
        </div>
      </div>

      {/* "Look How Far You've Come" Emotional Summary Card */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border relative overflow-hidden shadow-xs space-y-4"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: theme.colors.primaryBg }}
            >
              <Camera className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                “Look How Far You’ve Come”
              </h3>
              <p className="text-xs text-slate-500">
                Your visual timeline of small wins compounding into giant results
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Recap card ready to share with friends!')}
            className="p-2 rounded-xl border text-slate-600 hover:bg-slate-50 transition-colors"
            title="Share summary card"
            style={{ borderColor: theme.colors.cardBorder }}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Montage Visual Proof Strip */}
        {allProofs.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {allProofs.slice(0, 6).map((proof) => (
              <div 
                key={proof.id}
                onClick={() => setViewingProof(proof)}
                className="group relative rounded-xl overflow-hidden aspect-square border cursor-pointer hover:scale-105 transition-all"
                style={{ borderColor: theme.colors.cardBorder }}
              >
                <img 
                  src={proof.photoUrl} 
                  alt={proof.habitTitle} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <span className="absolute bottom-1 right-1 text-[10px]">
                  {proof.sticker || theme.badgeEmoji}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="p-6 text-center text-xs text-slate-500 rounded-2xl border border-dashed"
            style={{ borderColor: theme.colors.cardBorder }}
          >
            No verified photo proofs logged yet. Complete today's habits with photo proof to start your visual timeline!
          </div>
        )}

        {/* Reflection Statement */}
        <div 
          className="p-3.5 rounded-2xl border text-xs leading-relaxed text-slate-700 italic flex items-center gap-3"
          style={{ backgroundColor: theme.colors.primaryBg, borderColor: theme.colors.cardBorder }}
        >
          <Sparkles className="w-5 h-5 shrink-0" style={{ color: theme.colors.primary }} />
          <span>
            “Every single day you showed up, took the photo, and chose growth over comfort. That is {allProofs.length} moments of verified discipline!”
          </span>
        </div>
      </div>

      {/* Earned Badges Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Earned Consistency Badges</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {unlockedBadgesCount} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user?.badges && user.badges.length > 0 ? (
            user.badges.map((badge) => (
              <div 
                key={badge.id}
                className="p-4 rounded-2xl border bg-white shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow"
                style={{ borderColor: theme.colors.cardBorder }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0"
                  style={{ backgroundColor: theme.colors.primaryBg }}
                >
                  {badge.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">{badge.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{badge.description}</p>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 inline-block">
                    Earned {badge.earnedDate}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div 
              className="p-4 rounded-2xl border border-dashed text-center text-xs text-slate-500 col-span-full"
              style={{ borderColor: theme.colors.cardBorder }}
            >
              No badges unlocked yet. Keep logging daily proofs to earn your first consistency badge!
            </div>
          )}

          {/* Locked Next Badge Preview */}
          <div 
            className="p-4 rounded-2xl border bg-slate-50/60 border-dashed border-slate-200 flex items-center gap-3.5 opacity-70"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-100 shrink-0">
              🔒
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-700 text-sm">Century Club (100 Proofs)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Log 100 total habit photos ({totalProofsCount}/100 progress)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
