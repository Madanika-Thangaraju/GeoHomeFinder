import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, FONTS, GRADIENTS, LAYOUT, SPACING } from '../../constants/theme';

interface GlowButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled
}) => {
    const colors = variant === 'primary' ? GRADIENTS.primaryButton : GRADIENTS.secondaryButton;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
            style={[
                styles.container,
                style,
                disabled && styles.disabled
            ]}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: LAYOUT.radius.l,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginVertical: SPACING.s,
    },
    gradient: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: LAYOUT.radius.l,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: COLORS.white,
        fontSize: FONTS.sizes.body,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    disabled: {
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    }
});
