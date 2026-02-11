import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';
import { getNotificationsApi, markNotificationReadApi } from '../../src/services/service';

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            // Get current role from AsyncStorage to filter notifications
            const role = await AsyncStorage.getItem('userRole') as 'tenant' | 'owner' | null;
            const data = await getNotificationsApi(role || undefined);
            setNotifications(data || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const handleMarkRead = async (id: number | string) => {
        try {
            await markNotificationReadApi(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        } catch (error) {
            console.error("Failed to mark read:", error);
        }
    };

    const getIconInfo = (type: string) => {
        if (type.startsWith('tour_')) {
            return { name: 'calendar', color: type.includes('accepted') ? COLORS.success : '#EF4444' };
        }
        if (type.startsWith('call_')) {
            return { name: 'call', color: type.includes('accepted') ? COLORS.success : '#EF4444' };
        }
        switch (type) {
            case 'like': return { name: 'heart', color: '#EF4444' };
            case 'save': return { name: 'bookmark', color: COLORS.primary };
            case 'view': return { name: 'eye', color: COLORS.primary };
            case 'message': return { name: 'chatbubble', color: '#3B82F6' };
            default: return { name: 'notifications', color: COLORS.primary };
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
            >
                {loading && notifications.length === 0 ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
                ) : notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={48} color="#CBD5E1" />
                        <Text style={[styles.emptyText, { marginTop: 12 }]}>No notifications yet</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        {notifications.map((item) => {
                            const icon = getIconInfo(item.type);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.notificationCard, !item.is_read && { borderLeftWidth: 4, borderLeftColor: COLORS.primary }]}
                                    onPress={() => handleMarkRead(item.id)}
                                >
                                    {item.sender_image ? (
                                        <Image source={{ uri: item.sender_image }} style={styles.avatar} />
                                    ) : (
                                        <View style={[styles.avatar, { backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={{ fontSize: 18, color: COLORS.primary }}>{item.sender_name?.charAt(0) || '?'}</Text>
                                        </View>
                                    )}
                                    <View style={styles.notifContent}>
                                        <Text style={styles.notifText}>
                                            <Text style={styles.userName}>{item.sender_name || "Someone"}</Text>
                                            {item.type === 'like' && ' liked your property '}
                                            {item.type === 'save' && ' saved your property '}
                                            {item.type === 'view' && ' viewed your property '}
                                            {item.type === 'message' && ' sent you a message '}

                                            {/* For tour/call notifications, backend sends the full message */}
                                            {(item.type.startsWith('tour_') || item.type.startsWith('call_')) ? `: ${item.message}` : ''}

                                            {item.property_title && !item.type.startsWith('tour_') && (
                                                <Text style={styles.propertyName}> {item.property_title}</Text>
                                            )}
                                        </Text>
                                        <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
                                    </View>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={icon.name as any} size={16} color={icon.color} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </>
                )}
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
