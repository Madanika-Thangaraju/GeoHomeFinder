import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GradientBackground } from '../components/shared/GradientBackground';
import { COLORS, FONTS, SPACING } from '../constants/theme';

// Define navigation types roughly here or import from a types file
type RootStackParamList = {
    Login: undefined;
    // ... other routes
};

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1000 });
        scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });

        const timeout = setTimeout(() => {
            // Navigate away after animation
            navigation.replace('Login');
        }, 2500);

        return () => clearTimeout(timeout);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <GradientBackground style={styles.container}>
            <Animated.View style={[styles.content, animatedStyle]}>
                {/* Placeholder for Logo - In a real app, use an SVG or Image */}
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>🏠</Text>
                </View>
                <Text style={styles.title}>GeoHomeFinder</Text>
                <Text style={styles.tagline}>Discover Homes Around You</Text>
            </Animated.View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    iconText: {
        fontSize: 50,
    },
    title: {
        fontSize: FONTS.sizes.h1,
        color: COLORS.white,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
        marginTop: SPACING.m,
    },
    tagline: {
        fontSize: FONTS.sizes.body,
        color: COLORS.textSecondary,
        letterSpacing: 1,
    },
});
