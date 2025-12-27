import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CustomInput } from '../../src/components/shared/CustomInput';
import { GlowButton } from '../../src/components/shared/GlowButton';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Wait", "Please enter your details to continue.");
            return;
        }

        if (!isAgreed) {
            Alert.alert("Required", "Please agree to the Terms & Conditions to continue.");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push('/auth/role-selection');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sign Up</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Animated.View entering={FadeInUp.delay(100)} style={styles.content}>
                        <Text style={styles.title}>Create Account </Text>
                        <Text style={styles.subtitle}>Start your journey in GeoHome today 🏠</Text>

                        <View style={styles.form}>
                            <CustomInput
                                label="Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. Madhu "
                                style={styles.inputSpacer}
                                variant="standard"
                            />
                            <CustomInput
                                label="Email or Phone Number"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="name@example.com"
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

                            <View style={styles.agreement}>
                                <TouchableOpacity
                                    style={[styles.checkbox, isAgreed && styles.checkboxActive]}
                                    onPress={() => setIsAgreed(!isAgreed)}
                                >
                                    {isAgreed && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                                </TouchableOpacity>
                                <Text style={styles.agreementText}>
                                    I agree to the <Text style={{ color: COLORS.primary }}>Terms & Conditions</Text> and <Text style={{ color: COLORS.primary }}>Privacy Policy</Text>.
                                </Text>
                            </View>

                            <GlowButton
                                title={isLoading ? "Creating Account..." : "Create Account"}
                                onPress={handleSignup}
                                style={styles.signupBtn}
                                disabled={isLoading}
                            />
                        </View>

                        <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/auth/login')}>
                            <Text style={styles.loginText}>Already have an account? <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>Log In</Text></Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingTop: 60,
        paddingBottom: SPACING.m,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.l,
    },
    scrollContent: {
        paddingBottom: SPACING.xl,
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
        gap: SPACING.s,
    },
    inputSpacer: {
        marginBottom: SPACING.s,
    },
    agreement: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.s,
        marginBottom: SPACING.l,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
        borderRadius: 4,
        marginRight: SPACING.s,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    agreementText: {
        flex: 1,
        fontSize: 12,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    signupBtn: {
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
    loginLink: {
        alignItems: 'center',
    },
    loginText: {
        color: COLORS.textSecondary,
    },
});
