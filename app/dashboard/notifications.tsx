import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'like',
        user: 'John Doe',
        property: 'Greenfield Heights',
        time: '2 mins ago',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80'
    },
    {
        id: '2',
        type: 'like',
        user: 'Sarah Smith',
        property: 'City Center Apt',
        time: '1 hour ago',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    {
        id: '3',
        type: 'view',
        user: 'Mike Ross',
        property: 'Greenfield Heights',
        time: '3 hours ago',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
    },
];

export default function NotificationsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Today</Text>
                {MOCK_NOTIFICATIONS.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.notificationCard}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.notifContent}>
                            <Text style={styles.notifText}>
                                <Text style={styles.userName}>{item.user}</Text>
                                {item.type === 'like' ? ' liked your property ' : ' viewed your property '}
                                <Text style={styles.propertyName}>{item.property}</Text>
                            </Text>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={item.type === 'like' ? 'heart' : 'eye'}
                                size={16}
                                color={item.type === 'like' ? '#EF4444' : COLORS.primary}
                            />
                        </View>
                    </TouchableOpacity>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Yesterday</Text>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No earlier notifications</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: 60,
        paddingBottom: SPACING.l,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backBtn: {
        marginRight: SPACING.m,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.l,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: LAYOUT.radius.m,
        marginBottom: SPACING.s,
        ...LAYOUT.shadow,
        shadowOpacity: 0.05,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: SPACING.m,
    },
    notifContent: {
        flex: 1,
    },
    notifText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        lineHeight: 20,
    },
    userName: {
        fontWeight: 'bold',
    },
    propertyName: {
        fontWeight: '600',
        color: COLORS.primary,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SPACING.s,
    },
    emptyState: {
        padding: SPACING.l,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    }
});
