import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';


const linking = {
    prefixes: ['geohome://', 'https://geohome.com'],
    config: {
        screens: {
            Splash: 'splash',
            Login: 'login',
            Signup: 'signup',
            RoleSelection: 'role-selection',
            OwnerDashboard: 'owner-dashboard',
            TenantDashboard: 'tenant-dashboard',
        },
    },
};

function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer linking={linking}>
                <StatusBar style="light" />
                <AppNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

registerRootComponent(App);
