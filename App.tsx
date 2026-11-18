import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens/SplashScreen';
import { LanguageSelectScreen } from './src/screens/LanguageSelectScreen';
import { AuthHomeScreen } from './src/screens/AuthHomeScreen';
import { RegisterUserScreen } from './src/screens/RegisterUserScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ChatbotScreen } from './src/screens/ChatbotScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { DriverAuthHomeScreen } from './src/screens/DriverAuthHomeScreen';
import { DriverLoginScreen } from './src/screens/DriverLoginScreen';
import { DriverHomeScreen } from './src/screens/DriverHomeScreen';
import { DriverRouteScreen } from './src/screens/DriverRouteScreen';
import { DriverMapViewScreen } from './src/screens/DriverMapViewScreen';
import { DriverAccountScreen } from './src/screens/DriverAccountScreen';
import { Language } from './src/utils/translations';

// Disable LogBox warning notifications on screen
LogBox.ignoreAllLogs();

export type ScreenType =
  | 'splash'
  | 'language'
  | 'authHome'
  | 'register'
  | 'login'
  | 'dashboard'
  | 'chatbot'
  | 'account'
  | 'driverAuthHome'
  | 'driverLogin'
  | 'driverHome'
  | 'driverRoute'
  | 'driverMapView'
  | 'driverAccount';

interface RegisteredUser {
  name: string;
  location: string;
  email: string;
  binKey: string;
  password?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [language, setLanguage] = useState<Language>('en');
  const [driverId, setDriverId] = useState<string>('DRV-22546');
  const [userProfile, setUserProfile] = useState<RegisteredUser | null>({
    name: 'Hashibara inosuke',
    location: 'Colombo 07',
    email: 'inosuke@gmail.com',
    binKey: 'BIN-AA123',
  });

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Screen Routing */}
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={() => setCurrentScreen('language')} />
        )}

        {currentScreen === 'language' && (
          <LanguageSelectScreen
            onBackToSplash={() => setCurrentScreen('splash')}
            onContinueAsUser={(lang) => {
              setLanguage(lang);
              setCurrentScreen('authHome');
            }}
            onContinueAsDriver={(lang) => {
              setLanguage(lang);
              setCurrentScreen('driverAuthHome');
            }}
          />
        )}

        {currentScreen === 'authHome' && (
          <AuthHomeScreen
            language={language}
            onRegister={() => setCurrentScreen('register')}
            onLogin={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('language')}
          />
        )}

        {currentScreen === 'register' && (
          <RegisterUserScreen
            language={language}
            onSignUpSuccess={(userData) => {
              setUserProfile(userData);
              setCurrentScreen('dashboard');
            }}
            onNavigateLogin={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('authHome')}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            language={language}
            onLoginSuccess={(profile) => {
              setUserProfile((prev) => ({
                name: profile.name,
                location: prev?.location || 'Colombo, Sri Lanka',
                email: prev?.email || 'inosuke@gmail.com',
                binKey: profile.binKey,
                password: prev?.password,
              }));
              setCurrentScreen('dashboard');
            }}
            onNavigateRegister={() => setCurrentScreen('register')}
            onBack={() => setCurrentScreen('authHome')}
            registeredUser={userProfile}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen
            language={language}
            userProfile={
              userProfile || { name: 'Hashibara inosuke', binKey: 'BIN-AA123' }
            }
            onNavigateChatbot={() => setCurrentScreen('chatbot')}
            onNavigateAccount={() => setCurrentScreen('account')}
            onLogout={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'chatbot' && (
          <ChatbotScreen
            language={language}
            onNavigateHome={() => setCurrentScreen('dashboard')}
            onNavigateAccount={() => setCurrentScreen('account')}
          />
        )}

        {currentScreen === 'account' && (
          <AccountScreen
            language={language}
            onLanguageChange={setLanguage}
            userProfile={
              userProfile || {
                name: 'Hashibara inosuke',
                email: 'inosuke@gmail.com',
                binKey: 'BIN-AA123',
              }
            }
            onNavigateHome={() => setCurrentScreen('dashboard')}
            onNavigateChatbot={() => setCurrentScreen('chatbot')}
            onLogout={() => setCurrentScreen('login')}
            onAddAccount={() => setCurrentScreen('register')}
          />
        )}

        {/* Driver Flow */}
        {currentScreen === 'driverAuthHome' && (
          <DriverAuthHomeScreen
            language={language}
            onLogin={() => setCurrentScreen('driverLogin')}
            onStartRoute={() => setCurrentScreen('driverHome')}
            onBack={() => setCurrentScreen('language')}
          />
        )}

        {currentScreen === 'driverLogin' && (
          <DriverLoginScreen
            language={language}
            onLoginSuccess={(id) => {
              setDriverId(id);
              setCurrentScreen('driverHome');
            }}
            onBack={() => setCurrentScreen('driverAuthHome')}
          />
        )}

        {currentScreen === 'driverHome' && (
          <DriverHomeScreen
            language={language}
            driverId={driverId}
            onStartRoute={() => setCurrentScreen('driverRoute')}
            onLogout={() => setCurrentScreen('driverLogin')}
          />
        )}

        {currentScreen === 'driverRoute' && (
          <DriverRouteScreen
            language={language}
            driverId={driverId}
            onNavigateHome={() => setCurrentScreen('driverHome')}
            onNavigateMap={() => setCurrentScreen('driverMapView')}
            onNavigateAccount={() => setCurrentScreen('driverAccount')}
            onLogout={() => setCurrentScreen('driverLogin')}
            onLanguageChange={setLanguage}
          />
        )}

        {currentScreen === 'driverMapView' && (
          <DriverMapViewScreen
            language={language}
            onNavigateHome={() => setCurrentScreen('driverRoute')}
            onNavigateAccount={() => setCurrentScreen('driverAccount')}
          />
        )}

        {currentScreen === 'driverAccount' && (
          <DriverAccountScreen
            language={language}
            driverProfile={{
              name: 'Hashibara inosuke',
              id: 'DRI-AA123',
              email: 'inosuke@gmail.com',
              truckNumber: 'CAN-2258',
            }}
            onNavigateHome={() => setCurrentScreen('driverRoute')}
            onNavigateMap={() => setCurrentScreen('driverMapView')}
            onLogout={() => setCurrentScreen('driverLogin')}
            onLanguageChange={setLanguage}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
