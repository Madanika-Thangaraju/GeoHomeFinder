import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CustomInput } from '../../src/components/shared/CustomInput';
import { GlowButton } from '../../src/components/shared/GlowButton';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Wait", "Please enter your details to continue.");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(true);
            router.push('/auth/role-selection');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={styles.brandTitleRow}>
                    <Text style={styles.brandIcon}>📍</Text>
                    <Text style={styles.headerTitle}>GEOHOME</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <LinearGradient
                colors={['#F1F5F9', '#FFFFFF']}
                style={styles.topGradient}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Animated.View entering={FadeInUp.delay(100)} style={styles.content}>
                        {/* Brand Logo/Icon Highlight */}
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Ionicons name="home" size={32} color={COLORS.primary} />
                            </View>
                        </View>

                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Login to discover homes that match you.</Text>

                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, loginMethod === 'email' && styles.toggleBtnActive]}
                                onPress={() => setLoginMethod('email')}
                            >
                                <Text style={[styles.toggleText, loginMethod === 'email' && styles.toggleTextActive]}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, loginMethod === 'phone' && styles.toggleBtnActive]}
                                onPress={() => setLoginMethod('phone')}
                            >
                                <Text style={[styles.toggleText, loginMethod === 'phone' && styles.toggleTextActive]}>Phone Number</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            <CustomInput
                                label={loginMethod === 'email' ? "Email Address" : "Phone Number"}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={loginMethod === 'email' ? "hello@example.com" : "+91 98765 43210"}
                                keyboardType={loginMethod === 'email' ? "email-address" : "phone-pad"}
                                style={styles.inputSpacer}
                                variant="standard"
                            />
                            <CustomInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                secureTextEntry
                                style={styles.inputSpacer}
                                variant="standard"
                            />

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <GlowButton
                                title={isLoading ? "Logging in..." : "Login"}
                                onPress={handleLogin}
                                style={styles.loginBtn}
                                disabled={isLoading}
                            />
                        </View>

                        <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/auth/signup')}>
                            <Text style={styles.signupText}>New to GeoHomeFinder? <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>Sign Up</Text></Text>
                        </TouchableOpacity>

                        {/* Footer Section to fill space */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>By continuing, you agree to our</Text>
                            <View style={styles.footerLinks}>
                                <Text style={styles.footerLink}>Terms of Service</Text>
                                <Text style={styles.footerDivider}>•</Text>
                                <Text style={styles.footerLink}>Privacy Policy</Text>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        zIndex: -1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingTop: 60,
        paddingBottom: SPACING.m,
    },
    brandTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandIcon: {
        fontSize: 18,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.l,
    },
    scrollContent: {
        paddingBottom: SPACING.xl,
    },

    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EFF6FF', // Light blue bg
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: LAYOUT.radius.m,
        padding: 4,
        marginBottom: SPACING.l,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: LAYOUT.radius.s,
    },
    toggleBtnActive: {
        backgroundColor: COLORS.white,
        ...LAYOUT.shadow,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    toggleTextActive: {
        color: COLORS.primary,
    },
    form: {
        gap: SPACING.s,
    },
    inputSpacer: {
        marginBottom: SPACING.s,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.l,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    loginBtn: {
        borderRadius: LAYOUT.radius.m,
    },
    divider: {
        alignItems: 'center',
        marginVertical: SPACING.l,
    },
    dividerText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginBottom: SPACING.xl,
    },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 12,
        borderRadius: LAYOUT.radius.m,
        gap: 8,
    },
    socialText: {
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    signupLink: {
        alignItems: 'center',
    },
    signupText: {
        color: COLORS.textSecondary,
    },
    footer: {
        marginTop: SPACING.xxl,
        alignItems: 'center',
        opacity: 0.6,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    footerLink: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    footerDivider: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
});
