import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { registerUser } from '../../src/services/service';

export default function SignupScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        agreement: '',
    });

    // Validation functions
    const validateName = (value: string) => {
        if (!value.trim()) {
            return 'Name is required';
        }
        if (value.trim().length < 3) {
            return 'Name must be at least 3 characters';
        }
        return '';
    };

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

    const validatePassword = (value: string) => {
        if (!value) {
            return 'Password is required';
        }
        if (value.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const validateAgreement = () => {
        if (!isAgreed) {
            return 'You must agree to Terms & Conditions';
        }
        return '';
    };

    // Real-time validation handlers
    const handleNameChange = (value: string) => {
        setName(value);
        if (errors.name) {
            setErrors({ ...errors, name: validateName(value) });
        }
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (errors.email) {
            setErrors({ ...errors, email: validateEmail(value) });
        }
    };

    const handlePhoneChange = (value: string) => {
        // Only allow digits
        const digitsOnly = value.replace(/\D/g, '');
        setPhone(digitsOnly);
        if (errors.phone) {
            setErrors({ ...errors, phone: validatePhone(digitsOnly) });
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (errors.password) {
            setErrors({ ...errors, password: validatePassword(value) });
        }
    };

    const handleSignup = async () => {
        // Validate all fields
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const phoneError = validatePhone(phone);
        const passwordError = validatePassword(password);
        const agreementError = validateAgreement();

        setErrors({
            name: nameError,
            email: emailError,
            phone: phoneError,
            password: passwordError,
            agreement: agreementError,
        });

        // If any errors, don't proceed
        if (nameError || emailError || phoneError || passwordError || agreementError) {
            return;
        }

        try {
            setIsLoading(true);

            await registerUser({
                name,
                email,
                phone,
                password,
            });

            // Success toast
            Alert.alert(
                'Success! 🎉',
                'Your account has been registered successfully!',
                [
                    {
                        text: 'Continue',
                        onPress: () => router.push('/auth/role-selection'),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Start your journey in GeoHome today 🏠
                        </Text>

                        <View style={styles.form}>
                            <CustomInput
                                label="Full Name"
                                value={name}
                                onChangeText={handleNameChange}
                                placeholder="e.g. Madhu"
                                style={styles.inputSpacer}
                                variant="standard"
                            />
                            {errors.name ? (
                                <Text style={styles.errorText}>{errors.name}</Text>
                            ) : null}

                            <CustomInput
                                label="Email"
                                value={email}
                                onChangeText={handleEmailChange}
                                placeholder="name@example.com"
                                style={styles.inputSpacer}
                                variant="standard"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email ? (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            ) : null}

                            <CustomInput
                                label="Phone Number"
                                value={phone}
                                onChangeText={handlePhoneChange}
                                placeholder="9125261526"
                                style={styles.inputSpacer}
                                variant="standard"
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                            {errors.phone ? (
                                <Text style={styles.errorText}>{errors.phone}</Text>
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

                            <View style={styles.agreement}>
                                <TouchableOpacity
                                    style={[
                                        styles.checkbox,
                                        isAgreed && styles.checkboxActive,
                                        errors.agreement && styles.checkboxError,
                                    ]}
                                    onPress={() => {
                                        setIsAgreed(!isAgreed);
                                        if (errors.agreement) {
                                            setErrors({ ...errors, agreement: '' });
                                        }
                                    }}
                                >
                                    {isAgreed && (
                                        <Ionicons
                                            name="checkmark"
                                            size={14}
                                            color={COLORS.white}
                                        />
                                    )}
                                </TouchableOpacity>

                                <Text style={styles.agreementText}>
                                    I agree to the{' '}
                                    <Text style={{ color: COLORS.primary }}>
                                        Terms & Conditions
                                    </Text>{' '}
                                    and{' '}
                                    <Text style={{ color: COLORS.primary }}>
                                        Privacy Policy
                                    </Text>
                                    .
                                </Text>
                            </View>
                            {errors.agreement ? (
                                <Text style={styles.errorText}>{errors.agreement}</Text>
                            ) : null}

                            <GlowButton
                                title={
                                    isLoading
                                        ? 'Creating Account...'
                                        : 'Create Account'
                                }
                                onPress={handleSignup}
                                style={styles.signupBtn}
                                disabled={isLoading}
                            />
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
    checkboxError: {
        borderColor: '#ef4444',
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