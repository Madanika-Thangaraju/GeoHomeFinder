import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../constants/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20 }) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} tint="light" style={styles.blur}>
                <View style={styles.content}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: LAYOUT.radius.m,
        overflow: 'hidden',
        borderColor: COLORS.glassBorder,
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fallback / Base transparency
    },
    blur: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: SPACING.m,
    },
});
