import React, { useState } from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { COLORS, FONTS, LAYOUT, SPACING } from '../../constants/theme';

interface CustomInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    maxLength?: number;
    style?: ViewStyle;
    textColor?: string;
    variant?: 'glass' | 'standard';
}

export const CustomInput: React.FC<CustomInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    autoCapitalize = 'sentences',
    maxLength,
    style,
    textColor = COLORS.textPrimary,
    variant = 'glass',
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            <View style={[
                styles.inputContainer,
                variant === 'standard' ? styles.inputContainerStandard : styles.inputContainerGlass,
                isFocused && styles.inputFocused,
                isFocused && variant === 'standard' && styles.inputFocusedStandard
            ]}>
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textSecondary}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACING.s,
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.caption,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    inputContainer: {
        borderRadius: LAYOUT.radius.m,
        height: 56,
        borderWidth: 1,
    },
    inputContainerGlass: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: COLORS.glassBorder,
    },
    inputContainerStandard: {
        backgroundColor: '#F1F5F9', // Slightly darker gray
        borderColor: '#94A3B8', // Visible Slate-400 border
        borderWidth: 1.5, // Thicker border
    },
    inputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputFocusedStandard: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
    },
    input: {
        flex: 1,
        paddingHorizontal: SPACING.m,
        color: COLORS.textPrimary,
        fontSize: FONTS.sizes.body,
    },
});
