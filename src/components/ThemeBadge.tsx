import React from 'react';
import { useApp } from '../context/AppContext';

interface ThemeStickerProps {
  emoji?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeSticker: React.FC<ThemeStickerProps> = ({ 
  emoji, 
  size = 'md',
  className = '' 
}) => {
  const { theme } = useApp();
  const displayEmoji = emoji || theme.stickers[0]?.emoji || '✨';

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-xl'
  };

  return (
    <div 
      className={`inline-flex items-center justify-center rounded-full shadow-sm transition-transform hover:scale-110 select-none ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: theme.colors.pillBg,
        border: `1.5px solid ${theme.colors.cardBorder}`
      }}
    >
      <span>{displayEmoji}</span>
    </div>
  );
};
