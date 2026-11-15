import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  Trophy, 
  Clock, 
  Camera, 
  Plus, 
  Check, 
  Award,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_AVATAR } from '../data/avatars';

export const FriendsScreen: React.FC = () => {
  const { friends, addFriend, challenges, toggleJoinChallenge, theme, user } = useApp();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');
  const [friendNameInput, setFriendNameInput] = useState('');
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendNameInput.trim()) {
      addFriend(friendNameInput.trim());
      setFriendNameInput('');
      setIsAddFriendOpen(false);
    }
  };

  // Sort friends by streak descending
  const rankedFriends = [...friends].sort((a, b) => b.streak - a.streak);

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
                Community & Accountability
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Friends & Habit Challenges
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
              Share visual proof with friends, climb the leaderboard, and join timed challenges together!
            </p>
          </div>

          {/* Segmented Tab */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'leaderboard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'challenges' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Challenges ({challenges.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* LEADERBOARD VIEW */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: theme.colors.primary }} />
              <span>Monthly Consistency Leaderboard</span>
            </h3>

            <button
              onClick={() => setIsAddFriendOpen(!isAddFriendOpen)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl text-white shadow-xs flex items-center gap-1.5"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>
          </div>

          {/* Add Friend Input Form */}
          {isAddFriendOpen && (
            <form 
              onSubmit={handleAddFriend}
              className="p-3.5 rounded-2xl border bg-white shadow-xs flex items-center gap-2 animate-in fade-in"
              style={{ borderColor: theme.colors.cardBorder }}
            >
              <input 
                type="text"
                required
                value={friendNameInput}
                onChange={(e) => setFriendNameInput(e.target.value)}
                placeholder="Enter friend's name or username..."
                className="flex-1 px-3 py-2 text-xs border rounded-xl focus:outline-none"
                style={{ borderColor: theme.colors.cardBorder }}
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Connect
              </button>
            </form>
          )}

          {/* User's Current Standing Card */}
          {user && (
            <div 
              className="p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-xs"
              style={{
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.primary,
                boxShadow: `0 0 0 1.5px ${theme.colors.primary}30`
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs"
                  style={{
                    backgroundColor: theme.colors.primaryBg,
                    color: theme.colors.primary
                  }}
                >
                  YOU
                </div>

                <div className="relative">
                  <img 
                    src={user.avatar || DEFAULT_AVATAR} 
                    alt={user.name} 
                    className="w-11 h-11 rounded-2xl object-cover border-2 shadow-xs"
                    style={{ borderColor: theme.colors.primary }}
                  />
                  <span className="absolute -bottom-1 -right-1 text-xs select-none">
                    {theme.badgeEmoji}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                    <span>{user.name} (You)</span>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
                    >
                      Hero Level {user.level || 1}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {user.totalProofs || 0} proofs verified · Active streak
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span 
                  className="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                  style={{
                    backgroundColor: theme.colors.primaryBg,
                    color: theme.colors.primary
                  }}
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{user.streak || 0}d Streak</span>
                </span>
              </div>
            </div>
          )}

          {/* Friends Ranked List */}
          <div className="space-y-2.5">
            {rankedFriends.map((friend, index) => {
              const rankMedals = ['🥇', '🥈', '🥉'];
              const isTopThree = index < 3;

              return (
                <div
                  key={friend.id}
                  className="p-3.5 sm:p-4 rounded-2xl border bg-white shadow-xs flex items-center justify-between gap-3 hover:shadow-md transition-shadow"
                  style={{ borderColor: isTopThree ? theme.colors.cardBorder : '#E2E8F0' }}
                >
                  {/* Left: Rank & Avatar & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 text-center font-black text-sm text-slate-700">
                      {index < 3 ? rankMedals[index] : `#${index + 1}`}
                    </div>

                    <div className="relative">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name} 
                        className="w-11 h-11 rounded-2xl object-cover border"
                        style={{ borderColor: theme.colors.cardBorder }}
                      />
                      {friend.isOnline && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                        <span>{friend.name}</span>
                        {index === 0 && (
                          <span className="text-xs" title="Top Consistent Friend">👑</span>
                        )}
                      </h4>

                      {friend.recentProof ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                          <Camera className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">"{friend.recentProof.habitTitle}"</span>
                          <span className="text-[10px] text-slate-400">· {friend.recentProof.timeAgo}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Verified habit member</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Stats & Latest Proof Thumbnail */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Proof thumbnail preview if present */}
                    {friend.recentProof?.photoUrl && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-xs hidden sm:block">
                        <img 
                          src={friend.recentProof.photoUrl} 
                          alt="Recent Proof" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Streak flame pill */}
                    <div 
                      className="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                      style={{
                        backgroundColor: theme.colors.primaryBg,
                        color: theme.colors.streakColor
                      }}
                    >
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{friend.streak}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHALLENGES VIEW WITH COUNTDOWN TIMERS */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: theme.colors.primary }} />
              <span>Timed Habit Challenges</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Join & earn exclusive badges
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge) => {
              const progressPct = Math.round((challenge.userProgressDays / challenge.targetDays) * 100);

              return (
                <div
                  key={challenge.id}
                  className="rounded-3xl p-5 border bg-white shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
                  style={{ borderColor: theme.colors.cardBorder }}
                >
                  {/* Top Bar with Category & Live Countdown Timer */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span 
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
                      >
                        {challenge.category}
                      </span>

                      {/* Live Countdown Timer Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                        <span>Ends in {challenge.daysRemaining}d 14h</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base mt-2.5">
                      {challenge.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Reward & Progress */}
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{challenge.rewardBadge}</span>
                        <div>
                          <span className="font-bold text-slate-800">{challenge.rewardTitle}</span>
                          <span className="block text-[10px] text-slate-500">{challenge.participantsCount} Heroes enrolled</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{challenge.targetDays} Days</span>
                    </div>

                    {challenge.joined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Your Challenge Progress</span>
                          <span className="font-bold text-slate-900">
                            {challenge.userProgressDays}/{challenge.targetDays} Days ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.max(5, progressPct)}%`,
                              backgroundColor: theme.colors.primary
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Join / Leave button */}
                    <button
                      onClick={() => toggleJoinChallenge(challenge.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        challenge.joined 
                          ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'text-white shadow-sm hover:opacity-95'
                      }`}
                      style={{
                        backgroundColor: challenge.joined ? undefined : theme.colors.primary
                      }}
                    >
                      {challenge.joined ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Joined & Tracking</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Join Challenge</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
