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

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

export const SignupScreen = () => {
    const navigation = useNavigation<SignupScreenNavigationProp>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
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
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Join GeoHomeFinder today</Text>
                        </View>

                        <GlassCard style={styles.card}>
                            <CustomInput
                                label="Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="John Doe"
                            />
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

                            <GlowButton
                                title="Create Account"
                                onPress={handleSignup}
                                style={styles.button}
                            />
                        </GlassCard>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.link}>Sign In</Text>
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
    button: {
        marginTop: SPACING.l,
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
