import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CustomInput } from '../../src/components/shared/CustomInput';
import { GlowButton } from '../../src/components/shared/GlowButton';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';
import { loginUser } from '../../src/services/service';

export default function LoginScreen() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState({
        identifier: '',
        password: '',
    });

    // Validation functions
    const validateEmail = (value: string) => {
        if (!value.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePhone = (value: string) => {
        if (!value.trim()) {
            return 'Phone number is required';
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
            return 'Phone number must be exactly 10 digits';
        }
        return '';
    };

    const validateIdentifier = (value: string) => {
        if (!value.trim()) {
            return loginMethod === 'email' ? 'Email is required' : 'Phone number is required';
        }
        
        if (loginMethod === 'email') {
            return validateEmail(value);
        } else {
            return validatePhone(value);
        }
    };

    const validatePassword = (value: string) => {
        if (!value) {
            return 'Password is required';
        }
        if (value.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    // Real-time validation handlers
    const handleIdentifierChange = (value: string) => {
        if (loginMethod === 'phone') {
            // Only allow digits for phone
            const digitsOnly = value.replace(/\D/g, '');
            setIdentifier(digitsOnly);
            if (errors.identifier) {
                setErrors({ ...errors, identifier: validatePhone(digitsOnly) });
            }
        } else {
            setIdentifier(value);
            if (errors.identifier) {
                setErrors({ ...errors, identifier: validateEmail(value) });
            }
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (errors.password) {
            setErrors({ ...errors, password: validatePassword(value) });
        }
    };

    const handleMethodChange = (method: 'email' | 'phone') => {
        setLoginMethod(method);
        setIdentifier('');
        setErrors({ identifier: '', password: '' });
    };

    const handleLogin = async () => {
        // Validate all fields
        const identifierError = validateIdentifier(identifier);
        const passwordError = validatePassword(password);

        setErrors({
            identifier: identifierError,
            password: passwordError,
        });

        // If any errors, don't proceed
        if (identifierError || passwordError) {
            return;
        }

        try {
            setIsLoading(true);

            const result = await loginUser({
                identifier,
                password,
            });

            // Success toast
            Alert.alert(
                'Welcome Back! 👋',
                'You have logged in successfully!',
                [
                    {
                        text: 'Continue',
                        onPress: () => router.push('/auth/role-selection'),
                    },
                ]
            );
        } catch (error: any) {
            // Show error message from server
            Alert.alert(
                'Login Failed',
                error.message || 'Invalid credentials. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
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
                                onPress={() => handleMethodChange('email')}
                            >
                                <Text style={[styles.toggleText, loginMethod === 'email' && styles.toggleTextActive]}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, loginMethod === 'phone' && styles.toggleBtnActive]}
                                onPress={() => handleMethodChange('phone')}
                            >
                                <Text style={[styles.toggleText, loginMethod === 'phone' && styles.toggleTextActive]}>Phone Number</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            <CustomInput
                                label={loginMethod === 'email' ? "Email Address" : "Phone Number"}
                                value={identifier}
                                onChangeText={handleIdentifierChange}
                                placeholder={loginMethod === 'email' ? "hello@example.com" : "9125261526"}
                                keyboardType={loginMethod === 'email' ? "email-address" : "phone-pad"}
                                style={styles.inputSpacer}
                                variant="standard"
                                autoCapitalize={loginMethod === 'email' ? 'none' : 'none'}
                                maxLength={loginMethod === 'phone' ? 10 : undefined}
                            />
                            {errors.identifier ? (
                                <Text style={styles.errorText}>{errors.identifier}</Text>
                            ) : null}

                            <View>
                                <CustomInput
                                    label="Password"
                                    value={password}
                                    onChangeText={handlePasswordChange}
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
                                    style={styles.inputSpacer}
                                    variant="standard"
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password ? (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            ) : null}

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
        backgroundColor: '#EFF6FF',
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
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 8,
        marginLeft: 4,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
        top: 42,
        padding: 4,
    },
});