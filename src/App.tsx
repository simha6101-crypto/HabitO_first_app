/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Drawer } from './components/Drawer';
import { PhotoCaptureModal } from './components/PhotoCaptureModal';
import { PhotoViewerModal } from './components/PhotoViewerModal';
import { NewHabitModal } from './components/NewHabitModal';
import { HomeScreen } from './screens/HomeScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { RecapScreen } from './screens/RecapScreen';
import { FriendsScreen } from './screens/FriendsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AuthScreen } from './screens/AuthScreen';
import { StreakDetailsScreen } from './screens/StreakDetailsScreen';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, currentScreen, theme, isDarkMode } = useApp();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
      case 'my-habits':
        return <HomeScreen />;
      case 'streak-details':
        return <StreakDetailsScreen />;
      case 'gallery':
        return <GalleryScreen />;
      case 'recap':
        return <RecapScreen />;
      case 'friends':
        return <FriendsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div 
      className="min-h-screen min-h-[100dvh] flex flex-col font-sans transition-colors duration-500 selection:bg-rose-200"
      style={{
        backgroundColor: theme.colors.canvasBg,
        color: isDarkMode ? '#F8FAFC' : '#1E293B'
      }}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Viewport */}
      <main 
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-5"
        style={{
          paddingBottom: 'calc(7.5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {renderScreen()}
      </main>

      {/* Floating Pill-Shaped Bottom Navigation Bar */}
      <BottomNav />

      {/* Slide-in Navigation Drawer */}
      <Drawer />

      {/* Modals */}
      <PhotoCaptureModal />
      <PhotoViewerModal />
      <NewHabitModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
