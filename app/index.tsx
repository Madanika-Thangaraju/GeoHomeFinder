import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlowButton } from '../src/components/shared/GlowButton';
import { COLORS, FONTS, SPACING } from '../src/constants/theme';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Image Placeholder - using a solid color/gradient as fallback for now */}
            {/* Background Image */}
            <View style={styles.backgroundImage}>
                <Image
                    source={require('../assets/images/welcome-bg.jpg')}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
            </View>

            <LinearGradient
                colors={['transparent', 'rgba(15, 23, 42, 0.8)', '#0F172A']}
                style={styles.gradientOverlay}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    {/* Logo/Icon */}
                    <View style={styles.brandContainer}>
                        <Text style={styles.brandIcon}>📍</Text>
                        <Text style={styles.brandText}>GEOHOME</Text>
                    </View>
                </View>

                <Animated.View entering={FadeInDown.delay(300).duration(1000)} style={styles.mainTextContainer}>
                    <Text style={styles.heroText}>Find your{'\n'}<Text style={styles.heroTextHighlight}>home.</Text></Text>
                    <Text style={styles.subheroText}>
                        Home is the starting place of love, hope and dreams.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500).duration(1000)} style={styles.buttonContainer}>
                    <GlowButton
                        title="Log In"
                        onPress={() => router.push('/auth/login')}
                        variant="secondary" // Using darker/glass variant style
                        style={styles.loginBtn}
                    />
                    <GlowButton
                        title="Create Account"
                        onPress={() => router.push('/auth/signup')}
                        style={styles.signupBtn}
                    />
                </Animated.View>

                <TouchableOpacity onPress={() => Alert.alert("Support", "Contact support...")}>
                    <Text style={styles.footerLink}>Looking for support? Visit Help Center</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundDark,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#1E293B',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'flex-end',
        paddingBottom: SPACING.xxl,
    },
    header: {
        position: 'absolute',
        top: 60,
        left: SPACING.l,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandIcon: {
        fontSize: 20,
        color: COLORS.white,
        marginRight: SPACING.s,
    },
    brandText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 2,
    },
    mainTextContainer: {
        marginBottom: SPACING.xl,
    },
    heroText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
        lineHeight: 56,
    },
    heroTextHighlight: {
        color: COLORS.primary, // Or white with blue glow
    },
    subheroText: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.body,
        marginTop: SPACING.m,
        lineHeight: 24,
        maxWidth: '80%',
    },
    buttonContainer: {
        gap: SPACING.m,
        marginBottom: SPACING.l,
    },
    loginBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        shadowOpacity: 0,
    },
    signupBtn: {
        // Primary gradient by default
    },
    footerLink: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        fontSize: FONTS.sizes.small,
        textDecorationLine: 'underline',
    },
});
