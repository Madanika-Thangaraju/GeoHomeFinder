import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { GlassCard } from '../../components/shared/GlassCard';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

type RoleSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

export const RoleSelectionScreen = () => {
    const navigation = useNavigation<RoleSelectionScreenNavigationProp>();

    const handleSelectRole = (role: 'Owner' | 'Tenant') => {
        if (role === 'Owner') {
            navigation.navigate('OwnerDashboard');
        } else {
            navigation.navigate('TenantDashboard');
        }
    };

    return (
        <GradientBackground style={styles.container}>
            <Animated.View entering={FadeInUp.delay(300).duration(1000)}>
                <Text style={styles.title}>Select Your Role</Text>
                <Text style={styles.subtitle}>How do you want to use GeoHome?</Text>
            </Animated.View>

            <View style={styles.cardsContainer}>
                {/* Owner Card */}
                <Animated.View entering={FadeInDown.delay(500).duration(1000)}>
                    <TouchableOpacity onPress={() => handleSelectRole('Owner')} activeOpacity={0.8}>
                        <GlassCard style={styles.card}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(52, 211, 153, 0.2)' }]}>
                                <Ionicons name="key-outline" size={40} color={COLORS.success} />
                            </View>
                            <Text style={styles.roleTitle}>Property Owner</Text>
                            <Text style={styles.roleDescription}>Manage listings and track tenant requests effortlessly.</Text>
                        </GlassCard>
                    </TouchableOpacity>
                </Animated.View>

                {/* Tenant Card */}
                <Animated.View entering={FadeInDown.delay(700).duration(1000)}>
                    <TouchableOpacity onPress={() => handleSelectRole('Tenant')} activeOpacity={0.8}>
                        <GlassCard style={styles.card}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 229, 255, 0.2)' }]}>
                                <Ionicons name="search-outline" size={40} color={COLORS.primary} />
                            </View>
                            <Text style={styles.roleTitle}>Tenant</Text>
                            <Text style={styles.roleDescription}>Discover your dream home with AI-powered search.</Text>
                        </GlassCard>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONTS.sizes.h1,
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONTS.sizes.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xxl,
    },
    cardsContainer: {
        gap: SPACING.l,
    },
    card: {
        alignItems: 'center',
        padding: SPACING.l,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    roleTitle: {
        fontSize: FONTS.sizes.h2,
        color: COLORS.white,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
    },
    roleDescription: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.body,
        lineHeight: 22,
    },
});
