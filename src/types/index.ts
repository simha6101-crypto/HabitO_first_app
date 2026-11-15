export type ThemeId = 'spiderman' | 'doraemon' | 'ironman' | 'frozen' | 'pooh' | 'stitch';
export type AppearanceMode = 'light' | 'dark' | 'system';
export type PhotoCaptureSource = 'camera' | 'gallery';

export interface AvatarItem {
  id: string;
  name: string;
  category: 'Cute Characters' | 'Animals' | 'Fantasy' | 'Nature' | 'Minimalist';
  svgDataUri: string;
}


export interface ThemeConfig {
  id: ThemeId;
  name: string;
  category: 'Marvel' | 'Disney';
  quote: string;
  character: string;
  badgeEmoji: string;
  description: string;
  colors: {
    primary: string;         // e.g. text or solid
    primaryBg: string;       // pastel background for accents
    primaryHover: string;
    secondary: string;
    accent: string;
    canvasBg: string;        // entire app background
    cardBg: string;          // card background
    cardBorder: string;
    pillBg: string;
    pillActive: string;
    streakColor: string;
    ringColor: string;
  };
  stickers: {
    name: string;
    emoji: string;
    svgName?: string;
  }[];
}

export interface PhotoProof {
  id: string;
  habitId: string;
  habitTitle: string;
  photoUrl: string;
  caption: string;
  timestamp: string; // ISO string
  date: string;      // YYYY-MM-DD
  sticker?: string;
  likes: number;
  // Optional so proofs saved before capture-source tracking remain valid.
  captureSource?: PhotoCaptureSource;
  // Optional so existing proofs remain valid until a new image is submitted.
  imageHash?: string;
}

export interface Habit {
  id: string;
  title: string;
  category: 'Fitness' | 'Health' | 'Mindset' | 'Productivity' | 'Creativity';
  icon: string;
  cadence: 'daily' | 'weekdays' | 'custom';
  targetDaysPerWeek: number;
  streak: number;
  bestStreak: number;
  color: string;
  createdAt: string;
  proofs: PhotoProof[];
  isPaused?: boolean;
  pausePeriods?: { startedAt: string; endedAt?: string }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  level: number;
  streak: number;
  totalProofs: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'streak' | 'photos' | 'special';
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  monthlyProofs: number;
  recentProof?: {
    habitTitle: string;
    photoUrl: string;
    timeAgo: string;
  };
  isOnline: boolean;
}

export interface HabitChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  participantsCount: number;
  targetDays: number;
  daysRemaining: number;
  endsAt: string; // ISO date
  joined: boolean;
  userProgressDays: number;
  rewardBadge: string;
  rewardTitle: string;
  badgeEmoji: string;
}

export interface AppSettings {
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  soundEffects: boolean;
  highResPhotos: boolean;
  publicLeaderboard: boolean;
}
