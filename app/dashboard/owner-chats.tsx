import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { io } from 'socket.io-client';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';
import { getConversationsList } from '../../src/services/service';
import { getUser } from '../../src/utils/auth';

export default function OwnerChatsScreen() {
    const router = useRouter();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useFocusEffect(
        useCallback(() => {
            let socket: any;

            const fetchData = async () => {
                try {
                    const user = await getUser();
                    setCurrentUser(user);
                    const list = await getConversationsList();
                    setConversations(list);

                    // Initialize Socket for real-time list updates
                    socket = io("http://192.168.29.40:3000"); // Use consistent URL
                    socket.emit('join_room', String(user.id));

                    socket.on('receive_message', async () => {
                        console.log("🔄 Message received, refreshing list...");
                        try {
                            const updatedList = await getConversationsList();
                            setConversations(updatedList);
                        } catch (err) {
                            console.error("Error refreshing chat list:", err);
                        }
                    });
                } catch (error: any) {
                    console.error("❌ Failed to fetch conversations:", error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();

            return () => {
                if (socket) {
                    console.log("🔌 Disconnecting socket from chat list");
                    socket.disconnect();
                }
            };
        }, [])
    );

    const renderItem = ({ item }: { item: any }) => {
        // Use the aliases returned by the model: other_user_name and other_user_id
        const displayName = item.other_user_name || item.tenant_name || 'User';

        return (
            <TouchableOpacity
                style={styles.chatCard}
                onPress={() => router.push({
                    pathname: '/chat/[id]',
                    params: {
                        id: String(item.property_id),
                        chatId: item.id,
                        otherUserId: item.other_user_id || item.tenant_id,
                        otherUserName: item.other_user_name || item.tenant_name
                    }
                })}
            >
                <View style={styles.avatarContainer}>
                    {(item.other_user_image || item.tenant_image) ? (
                        <Image
                            source={{ uri: item.other_user_image || item.tenant_image }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
                        </View>
                    )}
                    <View style={styles.activeDot} />
                </View>

                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.nameText} numberOfLines={1}>{displayName}</Text>
                        <Text style={styles.timeText}>
                            {item.last_message_at ? new Date(item.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                    </View>

                    <Text style={styles.propertyContext} numberOfLines={1}>
                        Re: {item.property_title}
                    </Text>

                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.last_message || 'No messages yet'}
                    </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : conversations.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E1" />
                    <Text style={styles.emptyText}>No conversations yet</Text>
                    <Text style={styles.emptySubtext}>When tenants contact you, they will appear here.</Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}
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
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingTop: 60,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    listContent: {
        padding: SPACING.m,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 16,
        marginBottom: SPACING.m,
        ...LAYOUT.shadow,
        shadowOpacity: 0.05,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: SPACING.m,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    activeDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.success,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    chatInfo: {
        flex: 1,
        marginRight: 8,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    propertyContext: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    lastMessage: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: SPACING.m,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 8,
    },
});
