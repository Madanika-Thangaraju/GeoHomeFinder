import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../constants/theme';

interface AppAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
    onConfirm?: () => void;
}

export const AppAlert = ({ visible, title, message, type = 'info', onClose, onConfirm }: AppAlertProps) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            default: return 'information-circle';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success': return '#10B981';
            case 'error': return '#EF4444';
            default: return COLORS.primary;
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Ionicons name={getIcon()} size={48} color={getIconColor()} />
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        {onConfirm && (
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: getIconColor() }]}
                            onPress={onConfirm || onClose}
                        >
                            <Text style={styles.buttonText}>{onConfirm ? 'Confirm' : 'OK'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    alertBox: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: SPACING.xl,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        ...LAYOUT.shadow,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: SPACING.m,
        marginBottom: SPACING.s,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: SPACING.m,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
    },
    cancelButtonText: {
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
