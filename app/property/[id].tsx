import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from '../../src/components/shared/GradientBackground';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

export default function PropertyDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    return (
        <GradientBackground style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}></Text>
                <Text style={styles.subtitle}>ID: {id}</Text>

                <View style={styles.placeholderImg}>
                    <Text style={{ color: COLORS.textSecondary }}>High Res Image Gallery</Text>
                </View>

                <Text style={styles.description}>
                    This is a premium property located in the heart of the city through GeoHome Finder.
                    Glassmorphic details included.
                </Text>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.m,
    },
    backBtn: {
        marginTop: SPACING.xl,
        padding: SPACING.s,
    },
    content: {
        marginTop: SPACING.l,
    },
    title: {
        fontSize: FONTS.sizes.h1,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: FONTS.sizes.h3,
        color: COLORS.primary,
        marginBottom: SPACING.l,
    },
    placeholderImg: {
        height: 250,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    description: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.body,
        lineHeight: 24,
    }
});
