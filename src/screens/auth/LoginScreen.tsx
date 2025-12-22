import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CustomInput } from '../../components/shared/CustomInput';
import { GlassCard } from '../../components/shared/GlassCard';
import { GlowButton } from '../../components/shared/GlowButton';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Navigate to RoleSelection for demo purposes
        navigation.navigate('RoleSelection');
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue</Text>
                        </View>

                        <GlassCard style={styles.card}>
                            <CustomInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="hello@example.com"
                                keyboardType="email-address"
                            />
                            <CustomInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                secureTextEntry
                            />

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <GlowButton
                                title="Sign In"
                                onPress={handleLogin}
                                style={styles.button}
                            />
                        </GlassCard>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.link}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.l,
    },
    header: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: FONTS.sizes.h1,
        color: COLORS.white,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONTS.sizes.body,
        color: COLORS.textSecondary,
    },
    card: {
        padding: SPACING.m,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginVertical: SPACING.m,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontSize: FONTS.sizes.caption,
    },
    button: {
        marginTop: SPACING.s,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.xl,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.body,
    },
    link: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: FONTS.sizes.body,
    },
});
