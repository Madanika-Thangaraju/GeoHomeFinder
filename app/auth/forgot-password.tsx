import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CustomInput } from '../../src/components/shared/CustomInput';
import { GlowButton } from '../../src/components/shared/GlowButton';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const BASE_URL = "http://192.168.29.39:3000";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validate = () => {
        let newErrors = { email: '', password: '', confirmPassword: '' };
        let isValid = true;

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'New password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleReset = async () => {
        if (!validate()) return;

        try {
            setIsLoading(true);

            const response = await fetch(`${BASE_URL}/users/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword: password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to reset password");
            }

            Alert.alert(
                "Password Reset Successful",
                "Your password has been updated. You can now login with your new password.",
                [{ text: "Login Now", onPress: () => router.replace('/auth/login') }]
            );
        } catch (err: any) {
            Alert.alert("Error", err.message || "Something went wrong. Please try again.");
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
                <Text style={styles.headerTitle}>RESET PASSWORD</Text>
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
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Ionicons name="key-outline" size={32} color={COLORS.primary} />
                            </View>
                        </View>

                        <Text style={styles.title}>Update Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your email and a new password to reset your account credentials.
                        </Text>

                        <View style={styles.form}>
                            <CustomInput
                                label="Email Address"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                                placeholder="hello@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                variant="standard"
                            />
                            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                            <View>
                                <CustomInput
                                    label="New Password"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
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
                            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                            <View>
                                <CustomInput
                                    label="Confirm New Password"
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                    }}
                                    placeholder="••••••••"
                                    secureTextEntry={!showConfirmPassword}
                                    variant="standard"
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                            <GlowButton
                                title={isLoading ? "Resetting..." : "Update Password"}
                                onPress={handleReset}
                                style={styles.resetBtn}
                                disabled={isLoading}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.backToLogin}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.backToLoginText}>
                                Back to <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>Login</Text>
                            </Text>
                        </TouchableOpacity>
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
    form: {
        gap: SPACING.m,
    },
    resetBtn: {
        borderRadius: LAYOUT.radius.m,
        marginTop: SPACING.s,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: -8,
        marginLeft: 4,
    },
    backToLogin: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    backToLoginText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
        top: 38,
        padding: 4,
    },
});