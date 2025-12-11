// ============================================
// COOKINSAINTS™ - MAIN APPLICATION ENTRY
// The Complete iOS-Native Investment Platform
// Powered by SaintSal™ + HACP™
// ============================================

import React, { useState, useEffect } from 'react';
import { AuthProvider, AppProvider, useAuth } from './hooks';
import { StatusBar, TabBar, LoadingScreen } from './components';
import {
  SplashScreen,
  AuthScreen,
  HomeScreen,
  TradeScreen,
  CSRECScreen,
  CapitalScreen,
  SALScreen,
  ChatScreen,
  NotificationsScreen,
  SettingsScreen,
} from './screens';

// ============================================
// APP NAVIGATION TABS
// ============================================

const tabs = [
  { key: 'home', icon: '🏠', label: 'HOME' },
  { key: 'trade', icon: '📈', label: 'TRADE' },
  { key: 'csrec', icon: '💎', label: 'CSREC' },
  { key: 'capital', icon: '💰', label: 'CAPITAL' },
  { key: 'sal', icon: '🤖', label: 'SAL' },
];

// ============================================
// MAIN APP SHELL
// ============================================

const AppShell = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Handle splash screen
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen(isAuthenticated ? 'main' : 'auth');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isAuthenticated]);

  // Update screen when auth state changes
  useEffect(() => {
    if (!isLoading && currentScreen !== 'splash') {
      setCurrentScreen(isAuthenticated ? 'main' : 'auth');
    }
  }, [isAuthenticated, isLoading]);

  // Render current screen
  const renderScreen = () => {
    // Overlay screens
    if (showChat) {
      return <ChatScreen onClose={() => setShowChat(false)} />;
    }
    if (showNotifications) {
      return <NotificationsScreen onClose={() => setShowNotifications(false)} />;
    }
    if (showSettings) {
      return <SettingsScreen onClose={() => setShowSettings(false)} />;
    }

    // Main screens
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen(isAuthenticated ? 'main' : 'auth')} />;
      
      case 'auth':
        return <AuthScreen onComplete={() => setCurrentScreen('main')} />;
      
      case 'main':
        return renderMainScreen();
      
      default:
        return <SplashScreen onComplete={() => setCurrentScreen('auth')} />;
    }
  };

  // Render main tab screen
  const renderMainScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            onOpenChat={() => setShowChat(true)}
            onOpenNotifications={() => setShowNotifications(true)}
            onOpenSettings={() => setShowSettings(true)}
          />
        );
      case 'trade':
        return <TradeScreen />;
      case 'csrec':
        return <CSRECScreen />;
      case 'capital':
        return <CapitalScreen />;
      case 'sal':
        return <SALScreen onOpenChat={() => setShowChat(true)} />;
      default:
        return <HomeScreen onOpenChat={() => setShowChat(true)} />;
    }
  };

  // Show loading screen while checking auth
  if (isLoading && currentScreen !== 'splash') {
    return <LoadingScreen message="Loading your portfolio..." />;
  }

  return (
    <>
      {/* Status Bar - only show on main screens */}
      {currentScreen !== 'splash' && !showChat && !showNotifications && !showSettings && (
        <StatusBar />
      )}

      {/* Main Content */}
      <div style={{
        height: currentScreen === 'main' && !showChat && !showNotifications && !showSettings
          ? 'calc(100% - 140px)' 
          : currentScreen === 'splash' 
            ? '100%' 
            : 'calc(100% - 58px)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {renderScreen()}
      </div>

      {/* Tab Bar - only show on main screens */}
      {currentScreen === 'main' && !showChat && !showNotifications && !showSettings && (
        <TabBar 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </>
  );
};

// ============================================
// ROOT APPLICATION COMPONENT
// ============================================

const CookinSaintsApp = () => {
  return (
    <div style={{
      width: '100%',
      maxWidth: 430,
      height: 932,
      margin: '0 auto',
      background: '#0F0F0F',
      borderRadius: 40,
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
      border: '1px solid #2A2A2A',
    }}>
      <AuthProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </AuthProvider>
      
      {/* Global Styles */}
      <style>{`
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        
        input, textarea, button {
          font-family: inherit;
        }
        
        input::placeholder, textarea::placeholder {
          color: #555555;
        }
        
        ::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px #D4AF37, 0 0 10px #D4AF37, 0 0 15px #D4AF37;
          }
          50% { 
            box-shadow: 0 0 10px #D4AF37, 0 0 20px #D4AF37, 0 0 30px #D4AF37;
          }
        }
      `}</style>
    </div>
  );
};

export default CookinSaintsApp;


// ============================================
// EXPORTS FOR EXTERNAL USE
// ============================================

export {
  AuthProvider,
  AppProvider,
  useAuth,
} from './hooks';

export * from './components';
export * from './screens';
