import { ThemeConfig, ThemeId } from '../types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  spiderman: {
    id: 'spiderman',
    name: 'Spidey Pastel',
    category: 'Marvel',
    quote: '“With great habits comes great consistency. Hang in there!”',
    character: 'Spider-Man',
    badgeEmoji: '🕷️',
    description: 'Soft web-slinger crimson and gentle skyline baby-blue pastel tones.',
    colors: {
      primary: '#EF4444',        // Soft red
      primaryBg: '#FEE2E2',      // Light pastel red/pink
      primaryHover: '#DC2626',
      secondary: '#38BDF8',      // Soft baby blue
      accent: '#F43F5E',
      canvasBg: '#FFF7F7',       // Soft pastel rosy canvas
      cardBg: '#FFFFFF',
      cardBorder: '#FECDD3',
      pillBg: '#FCE7F3',
      pillActive: '#EF4444',
      streakColor: '#F97316',
      ringColor: 'rgba(239, 68, 68, 0.25)',
    },
    stickers: [
      { name: 'Spidey Web', emoji: '🕸️' },
      { name: 'Cute Hero', emoji: '🦸‍♂️' },
      { name: 'Radioactive Spider', emoji: '🕷️' },
      { name: 'Web-Shooter', emoji: '⚡' },
      { name: 'Victory Mask', emoji: '🎭' }
    ]
  },
  doraemon: {
    id: 'doraemon',
    name: 'Doraemon Wonderland',
    category: 'Disney',
    quote: '“Pull out the Anywhere Door to your dreams, one daily habit at a time!”',
    character: 'Doraemon',
    badgeEmoji: '🔔',
    description: 'Gentle pastel azure, golden bell yellows, and whimsical gadget vibes.',
    colors: {
      primary: '#0284C7',        // Soft sky blue
      primaryBg: '#E0F2FE',      // Pastel sky blue
      primaryHover: '#0369A1',
      secondary: '#FBBF24',      // Golden bell yellow
      accent: '#F43F5E',         // Doraemon nose & collar red
      canvasBg: '#F0F9FF',       // Pastel blue-tinted canvas
      cardBg: '#FFFFFF',
      cardBorder: '#BAE6FD',
      pillBg: '#E0F2FE',
      pillActive: '#0284C7',
      streakColor: '#EA580C',
      ringColor: 'rgba(2, 132, 199, 0.25)',
    },
    stickers: [
      { name: 'Anywhere Door', emoji: '🚪' },
      { name: 'Bamboo Copter', emoji: '🚁' },
      { name: 'Golden Bell', emoji: '🔔' },
      { name: 'Dorayaki Pancake', emoji: '🥞' },
      { name: 'Magic Pocket', emoji: '✨' }
    ]
  },
  ironman: {
    id: 'ironman',
    name: 'Iron Man Armor',
    category: 'Marvel',
    quote: '“Sometimes you gotta run before you can walk. Power up your arc reactor!”',
    character: 'Iron Man',
    badgeEmoji: '🦾',
    description: 'Pastel burgundy rose, champagne gold accents, and arc reactor cyan glow.',
    colors: {
      primary: '#E11D48',        // Elegant crimson
      primaryBg: '#FFE4E6',      // Champagne rose
      primaryHover: '#BE123C',
      secondary: '#F59E0B',      // Warm gold
      accent: '#06B6D4',         // Arc cyan
      canvasBg: '#FFFDF9',       // Warm pale champagne canvas
      cardBg: '#FFFFFF',
      cardBorder: '#FDE68A',
      pillBg: '#FEF3C7',
      pillActive: '#E11D48',
      streakColor: '#D97706',
      ringColor: 'rgba(225, 29, 72, 0.25)',
    },
    stickers: [
      { name: 'Arc Reactor', emoji: '💠' },
      { name: 'Stark Gauntlet', emoji: '🦾' },
      { name: 'Energy Blast', emoji: '⚡' },
      { name: 'Gold Helmet', emoji: '🛡️' },
      { name: 'Mark VII Star', emoji: '⭐' }
    ]
  },
  frozen: {
    id: 'frozen',
    name: 'Elsa Ice Castle',
    category: 'Disney',
    quote: '“Step into your power every single day. The cold never bothered consistency anyway!”',
    character: 'Elsa & Olaf',
    badgeEmoji: '❄️',
    description: 'Serene glacier ice cyan, pastel frosted periwinkle, and crystalline sparkles.',
    colors: {
      primary: '#0284C7',        // Ice blue
      primaryBg: '#E0F2FE',      // Frosted cyan
      primaryHover: '#0369A1',
      secondary: '#818CF8',      // Soft periwinkle
      accent: '#38BDF8',
      canvasBg: '#F8FAFC',       // Clean cool white canvas
      cardBg: '#FFFFFF',
      cardBorder: '#BFDBFE',
      pillBg: '#EDE9FE',
      pillActive: '#0284C7',
      streakColor: '#0ea5e9',
      ringColor: 'rgba(2, 132, 199, 0.25)',
    },
    stickers: [
      { name: 'Magic Snowflake', emoji: '❄️' },
      { name: 'Crystal Spark', emoji: '✨' },
      { name: 'Happy Olaf', emoji: '⛄' },
      { name: 'Royal Tiara', emoji: '👑' },
      { name: 'Ice Palace', emoji: '🏰' }
    ]
  },
  pooh: {
    id: 'pooh',
    name: 'Pooh Bear Honeycomb',
    category: 'Disney',
    quote: '“A little consideration, a little thought for others, makes all the difference.”',
    character: 'Winnie the Pooh',
    badgeEmoji: '🍯',
    description: 'Warm honey pastel yellow, soft blossom terracotta, and cozy meadow bliss.',
    colors: {
      primary: '#D97706',        // Warm honey amber
      primaryBg: '#FEF3C7',      // Soft honey yellow
      primaryHover: '#B45309',
      secondary: '#F87171',      // Blossom peach
      accent: '#F59E0B',
      canvasBg: '#FFFDF5',       // Warm creamy honey canvas
      cardBg: '#FFFFFF',
      cardBorder: '#FDE68A',
      pillBg: '#FEF3C7',
      pillActive: '#D97706',
      streakColor: '#EA580C',
      ringColor: 'rgba(217, 119, 6, 0.25)',
    },
    stickers: [
      { name: 'Honey Pot', emoji: '🍯' },
      { name: 'Busy Bee', emoji: '🐝' },
      { name: 'Red Balloon', emoji: '🎈' },
      { name: 'Meadow Blossom', emoji: '🌸' },
      { name: 'Sweet Acorn', emoji: '🌰' }
    ]
  },
  stitch: {
    id: 'stitch',
    name: 'Stitch Hawaiian Oasis',
    category: 'Disney',
    quote: '“Ohana means family. Family means no daily habit gets left behind or forgotten!”',
    character: 'Stitch',
    badgeEmoji: '🌺',
    description: 'Pastel island periwinkle, tropical hibiscus pink, and calm mint sea tones.',
    colors: {
      primary: '#6366F1',        // Lavender indigo
      primaryBg: '#EEF2FF',      // Pastel lavender
      primaryHover: '#4F46E5',
      secondary: '#F472B6',      // Hibiscus pink
      accent: '#10B981',         // Island mint
      canvasBg: '#FAF5FF',       // Soft pastel orchid canvas
      cardBg: '#FFFFFF',
      cardBorder: '#E0E7FF',
      pillBg: '#FCE7F3',
      pillActive: '#6366F1',
      streakColor: '#EC4899',
      ringColor: 'rgba(99, 102, 241, 0.25)',
    },
    stickers: [
      { name: 'Hibiscus Bloom', emoji: '🌺' },
      { name: 'Cute Stitch', emoji: '👽' },
      { name: 'Ukulele Beats', emoji: '🎶' },
      { name: 'Palm Breeze', emoji: '🌴' },
      { name: 'Shave Ice', emoji: '🍧' }
    ]
  }
};

export const DARK_THEMES: Record<ThemeId, ThemeConfig> = {
  spiderman: {
    ...THEMES.spiderman,
    colors: {
      primary: '#F87171',        // Accessible soft bright crimson
      primaryBg: 'rgba(239, 68, 68, 0.20)', // Subtle crimson dark glow
      primaryHover: '#EF4444',
      secondary: '#38BDF8',      // Soft sky blue
      accent: '#FB7185',
      canvasBg: '#0F172A',       // Polished dark slate-charcoal
      cardBg: '#1E293B',         // Slightly lighter slate surface
      cardBorder: 'rgba(239, 68, 68, 0.25)', // Soft border with theme tint
      pillBg: 'rgba(239, 68, 68, 0.12)',
      pillActive: '#EF4444',
      streakColor: '#FB923C',
      ringColor: 'rgba(248, 113, 113, 0.35)',
    }
  },
  doraemon: {
    ...THEMES.doraemon,
    colors: {
      primary: '#38BDF8',        // Vivid soft sky cyan
      primaryBg: 'rgba(56, 189, 248, 0.20)',
      primaryHover: '#0284C7',
      secondary: '#FBBF24',      // Golden bell yellow
      accent: '#F43F5E',
      canvasBg: '#0B132B',       // Deep midnight navy
      cardBg: '#14213D',         // Slightly lighter navy card surface
      cardBorder: 'rgba(56, 189, 248, 0.25)',
      pillBg: 'rgba(56, 189, 248, 0.12)',
      pillActive: '#38BDF8',
      streakColor: '#FB923C',
      ringColor: 'rgba(56, 189, 248, 0.35)',
    }
  },
  ironman: {
    ...THEMES.ironman,
    colors: {
      primary: '#FB7185',        // Bright stark ruby rose
      primaryBg: 'rgba(225, 29, 72, 0.20)',
      primaryHover: '#F43F5E',
      secondary: '#FBBF24',      // Stark gold
      accent: '#22D3EE',         // Arc reactor cyan
      canvasBg: '#171217',       // Dark titanium charcoal
      cardBg: '#251E28',         // Slightly lighter titanium surface
      cardBorder: 'rgba(245, 158, 11, 0.25)',
      pillBg: 'rgba(225, 29, 72, 0.12)',
      pillActive: '#E11D48',
      streakColor: '#F59E0B',
      ringColor: 'rgba(251, 113, 133, 0.35)',
    }
  },
  frozen: {
    ...THEMES.frozen,
    colors: {
      primary: '#38BDF8',        // Glacial ice cyan
      primaryBg: 'rgba(56, 189, 248, 0.20)',
      primaryHover: '#0284C7',
      secondary: '#818CF8',      // Crystalline periwinkle
      accent: '#67E8F9',
      canvasBg: '#0B1528',       // Arctic midnight navy
      cardBg: '#13233F',         // Crystalline dark surface
      cardBorder: 'rgba(129, 140, 248, 0.25)',
      pillBg: 'rgba(56, 189, 248, 0.12)',
      pillActive: '#0284C7',
      streakColor: '#38BDF8',
      ringColor: 'rgba(56, 189, 248, 0.35)',
    }
  },
  pooh: {
    ...THEMES.pooh,
    colors: {
      primary: '#FBBF24',        // Warm honey amber gold
      primaryBg: 'rgba(245, 158, 11, 0.20)',
      primaryHover: '#F59E0B',
      secondary: '#F87171',      // Blossom peach
      accent: '#F59E0B',
      canvasBg: '#18140E',       // Warm dark honeycomb charcoal
      cardBg: '#262118',         // Slightly lighter honeycomb surface
      cardBorder: 'rgba(245, 158, 11, 0.25)',
      pillBg: 'rgba(245, 158, 11, 0.12)',
      pillActive: '#F59E0B',
      streakColor: '#FB923C',
      ringColor: 'rgba(251, 191, 36, 0.35)',
    }
  },
  stitch: {
    ...THEMES.stitch,
    colors: {
      primary: '#818CF8',        // Vivid island twilight indigo
      primaryBg: 'rgba(129, 140, 248, 0.20)',
      primaryHover: '#6366F1',
      secondary: '#F472B6',      // Hibiscus pink
      accent: '#34D399',         // Island mint
      canvasBg: '#101124',       // Deep tropical night indigo
      cardBg: '#1C1E3A',         // Island twilight card surface
      cardBorder: 'rgba(129, 140, 248, 0.25)',
      pillBg: 'rgba(129, 140, 248, 0.12)',
      pillActive: '#818CF8',
      streakColor: '#F472B6',
      ringColor: 'rgba(129, 140, 248, 0.35)',
    }
  }
};

export function getThemeConfig(themeId: ThemeId, isDark = false): ThemeConfig {
  if (isDark) {
    return DARK_THEMES[themeId] || DARK_THEMES.spiderman;
  }
  return THEMES[themeId] || THEMES.spiderman;
}

