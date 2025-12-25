import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { COLORS } from '../src/constants/theme';
import { AuthProvider } from '../src/context/AuthContext';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ animation: 'fade' }} />
        <Stack.Screen name="auth/signup" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/role-selection" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="dashboard/owner" options={{ animation: 'fade' }} />
        <Stack.Screen name="dashboard/tenant" options={{ animation: 'fade' }} />
        <Stack.Screen name="dashboard/my-listings" options={{ animation: 'fade' }} />
        <Stack.Screen name="dashboard/search-results" options={{ animation: 'fade' }} />
        <Stack.Screen name="property/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
