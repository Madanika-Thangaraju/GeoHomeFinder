import { Ionicons } from '@expo/vector-icons';
import * as ExpoLocation from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { COLORS, LAYOUT, SPACING } from '@/src/constants/theme';
import { createTourRequestApi, getConversation, getProperty, sendMessageToApi } from '@/src/services/service';
import { getUser } from '@/src/utils/auth';

const { width } = Dimensions.get('window');
const SOCKET_URL = "http://192.168.29.40:3000";

export default function ChatScreen() {
    const { id, otherUserId, otherUserName } = useLocalSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOpponentTyping, setIsOpponentTyping] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    // Dynamic receiver determination
    const [receiverId, setReceiverId] = useState<number | string>(0);
    const [displayInfo, setDisplayInfo] = useState({ name: '', image: null as any });
    const [chatProperty, setChatProperty] = useState<any>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const EMOJIS = [
        '😊', '😂', '🔥', '❤️', '👍', '🙌', '🎉', '✨',
        '🏠', '📍', '💰', '📅', '🤝', '👋', '😎', '💯',
        '😍', '🤩', '🤔', '😅', '🙄', '😴', '😭', '😡',
        '🙏', '💪', '👏', '👌', '✌️', '🤞', '🤙', '🖐️',
        '🏢', '🏘️', '🏙️', '🏗️', '🚶', '🚗', '🚕', '🚌'
    ];

    const handleEmojiSelect = (emoji: string) => {
        setMessage(prev => prev + emoji);
    };

    useEffect(() => {
        const setup = async () => {
            const user = await getUser();
            setCurrentUser(user);

            try {
                // Fetch property and owner details
                const propData = await getProperty(id as string);
                setChatProperty(propData);

                if (user && propData) {
                    let rId: number | string;
                    let dName: string;
                    let dImage: any;

                    // If we have otherUserId from params (navigated from owner dashboard), use it
                    if (otherUserId) {
                        rId = String(otherUserId);
                        dName = (otherUserName as string) || 'User';
                        dImage = null;
                    } else {
                        // Navigated from property details as tenant
                        rId = propData.owner?.id || propData.owner_id || 2;
                        dName = propData.owner?.name || propData.owner_name || 'Owner';
                        dImage = propData.owner?.image || (propData.owner_image ? { uri: propData.owner_image } : null);
                    }

                    setReceiverId(rId);
                    setDisplayInfo({ name: dName, image: dImage });

                    // Initialize Socket
                    const socket = io(SOCKET_URL);
                    socketRef.current = socket;
                    socket.emit('join_room', String(user.id));

                    socket.on('receive_message', (data) => {
                        console.log("📥 New message received:", data);
                        // Only add if it belongs to THIS conversation
                        if (String(data.sender_id) === String(rId)) {
                            setMessages(prev => {
                                // Prevent duplicates
                                if (prev.find(m => m.id === data.id)) return prev;
                                return [...prev, {
                                    id: data.id || Date.now().toString(),
                                    content: data.content,
                                    sender_id: data.sender_id,
                                    sender_type: data.sender_type,
                                    created_at: data.created_at || new Date().toISOString()
                                }];
                            });
                        }
                    });

                    socket.on('opponent_typing', (data) => {
                        if (String(data.sender_id) === String(rId)) {
                            setIsOpponentTyping(data.isTyping);
                        }
                    });

                    // Fetch history
                    const history = await getConversation(rId, propData?.id);
                    setMessages(history);
                }
            } catch (error: any) {
                console.error("❌ Failed to setup chat:", error.message);
            } finally {
                setLoading(false);
            }
        };

        setup();

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [id, otherUserId]);

    const handleSend = async () => {
        if (!message.trim() || !currentUser) return;

        const content = message.trim();
        setMessage('');

        const tempId = 'temp-' + Date.now();
        const newMessage = {
            id: tempId,
            content: content,
            sender_id: currentUser.id,
            sender_type: currentUser.role || 'tenant',
            created_at: new Date().toISOString(),
            is_user: true
        };

        setMessages(prev => [...prev, newMessage]);

        try {
            // 1. Save to DB
            await sendMessageToApi(receiverId, content, 'text', chatProperty?.id || id);

            // 2. Emit via socket
            if (socketRef.current) {
                socketRef.current.emit('send_message', {
                    sender_id: currentUser.id,
                    receiver_id: receiverId,
                    content: content,
                    type: 'text',
                    sender_type: currentUser.role || 'tenant'
                });
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleTyping = (text: string) => {
        setMessage(text);
        if (socketRef.current && currentUser) {
            socketRef.current.emit('typing', {
                sender_id: currentUser.id,
                receiver_id: receiverId,
                isTyping: text.length > 0
            });
        }
    };

    const handleScheduleVisit = async () => {
        if (!currentUser || !chatProperty) return;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        Alert.alert(
            "Schedule Visit",
            `Would you like to request a tour for tomorrow (${dateStr}) at 10:00 AM?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            await createTourRequestApi({
                                owner_id: Number(receiverId),
                                property_id: chatProperty.id,
                                tour_date: dateStr,
                                tour_time: "10:00 AM",
                                message: "Requested via chat quick action"
                            });

                            const msg = `📅 Requested a tour for ${dateStr} at 10:00 AM`;
                            await sendMessageToApi(receiverId, msg, 'text', chatProperty.id);
                            if (socketRef.current) {
                                socketRef.current.emit('send_message', {
                                    sender_id: currentUser.id,
                                    receiver_id: receiverId,
                                    content: msg,
                                    type: 'text',
                                    sender_type: currentUser.role
                                });
                            }
                            setMessages(prev => [...prev, {
                                id: 'tour-' + Date.now(),
                                content: msg,
                                sender_id: currentUser.id,
                                created_at: new Date().toISOString(),
                                is_user: true
                            }]);
                        } catch (error) {
                            Alert.alert("Error", "Failed to schedule tour");
                        }
                    }
                }
            ]
        );
    };

    const handleShareLocation = async () => {
        try {
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Allow location access to share your position.");
                return;
            }
            const loc = await ExpoLocation.getCurrentPositionAsync({});
            const mapsUrl = `https://www.google.com/maps?q=${loc.coords.latitude},${loc.coords.longitude}`;
            const msg = `📍 My Location: ${mapsUrl}`;

            await sendMessageToApi(receiverId, msg, 'text', chatProperty?.id || id);
            if (socketRef.current) {
                socketRef.current.emit('send_message', {
                    sender_id: currentUser.id,
                    receiver_id: receiverId,
                    content: msg,
                    type: 'text',
                    sender_type: currentUser.role
                });
            }
            setMessages(prev => [...prev, {
                id: 'loc-' + Date.now(),
                content: msg,
                sender_id: currentUser.id,
                created_at: new Date().toISOString(),
                is_user: true
            }]);
        } catch (error) {
            console.error("Location share error:", error);
            Alert.alert("Error", "Could not get current location");
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Just now' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.ownerInfo}>
                        {displayInfo.image && (typeof displayInfo.image === 'object' && displayInfo.image.uri) ? (
                            <Image source={displayInfo.image} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, { backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{displayInfo.name.charAt(0)}</Text>
                            </View>
                        )}
                        <View style={{ flex: 1 }}>
                            <Text style={styles.ownerName} numberOfLines={1}>{displayInfo.name}</Text>
                            <View style={styles.statusRow}>
                                <View style={[styles.statusDot, { backgroundColor: isOpponentTyping ? COLORS.primary : COLORS.success }]} />
                                <Text style={styles.statusText} numberOfLines={1}>
                                    {isOpponentTyping ? 'Typing...' : 'Active now'} • {chatProperty?.property_type || chatProperty?.type} in {chatProperty?.address?.split(',')[0]}...
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <TouchableOpacity onPress={() => router.push('/dashboard/liked-properties')}>
                            <Ionicons name="heart-outline" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/dashboard/profile-tenant')}>
                            <Ionicons name="person-outline" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Context Bar */}
                <View style={styles.contextBar}>
                    <Ionicons name="home-outline" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.contextText}>Interested in <Text style={{ fontWeight: 'bold' }}>{chatProperty?.property_type || chatProperty?.type} @ {chatProperty?.address?.split(',')[0]}</Text></Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} style={{ marginLeft: 'auto' }} />
                </View>
            </View>

            {/* Messages Area */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>Loading conversation...</Text>
                </View>
            ) : (
                <ScrollView
                    ref={scrollViewRef as any}
                    style={styles.messagesContainer}
                    contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: SPACING.m }}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
                >
                    <View style={styles.dateSeparator}>
                        <Text style={styles.dateText}>Today</Text>
                    </View>

                    {messages.map((msg, index) => {
                        const isUserMsg = msg.is_user || (String(msg.sender_id) === String(currentUser?.id));
                        return (
                            <View
                                key={msg.id ? msg.id.toString() : index.toString()}
                                style={[
                                    styles.messageRow,
                                    isUserMsg ? styles.userRow : styles.ownerRow
                                ]}>
                                {!isUserMsg && (
                                    displayInfo.image ? (
                                        <Image source={displayInfo.image} style={styles.msgAvatar} />
                                    ) : (
                                        <View style={[styles.msgAvatar, { backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={{ fontSize: 10, color: COLORS.primary, fontWeight: 'bold' }}>{displayInfo.name.charAt(0)}</Text>
                                        </View>
                                    )
                                )}

                                <View>
                                    <View style={[
                                        styles.bubble,
                                        isUserMsg ? styles.userBubble : styles.ownerBubble
                                    ]}>
                                        <Text style={[
                                            styles.msgText,
                                            isUserMsg ? styles.userMsgText : styles.ownerMsgText
                                        ]}>{msg.content}</Text>
                                    </View>
                                    <View style={[styles.timeRow, isUserMsg ? { justifyContent: 'flex-end' } : { marginLeft: 0 }]}>
                                        <Text style={styles.timeText}>{formatTime(msg.created_at)}</Text>
                                        {isUserMsg && msg.is_read ? (
                                            <Ionicons name="checkmark-done" size={12} color={COLORS.primary} style={{ marginLeft: 4 }} />
                                        ) : null}
                                    </View>
                                </View>
                            </View>
                        );
                    })}

                    {isOpponentTyping && (
                        <View style={styles.typingRow}>
                            {displayInfo.image ? (
                                <Image source={displayInfo.image} style={styles.msgAvatar} />
                            ) : (
                                <View style={[styles.msgAvatar, { backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ fontSize: 10, color: COLORS.primary, fontWeight: 'bold' }}>{displayInfo.name.charAt(0)}</Text>
                                </View>
                            )}
                            <View style={styles.typingBubble}>
                                <View style={styles.typingDot} />
                                <View style={[styles.typingDot, { opacity: 0.6 }]} />
                                <View style={[styles.typingDot, { opacity: 0.3 }]} />
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Input Area */}
            <View>
                {/* Quick Actions */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll} contentContainerStyle={{ paddingHorizontal: SPACING.m }}>
                    {currentUser?.role !== 'owner' && (
                        <TouchableOpacity style={styles.quickActionChip} onPress={handleScheduleVisit}>
                            <Ionicons name="calendar-outline" size={16} color={COLORS.textPrimary} />
                            <Text style={styles.quickActionText}>Schedule Visit</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.quickActionChip} onPress={handleShareLocation}>
                        <Ionicons name="location-outline" size={16} color={COLORS.textPrimary} />
                        <Text style={styles.quickActionText}>Share Location</Text>
                    </TouchableOpacity>
                </ScrollView>

                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.plusBtn}>
                        <Ionicons name="add" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.inputFieldContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor={COLORS.textSecondary}
                            value={message}
                            onChangeText={handleTyping}
                        />
                        <TouchableOpacity onPress={() => setShowEmojiPicker(true)}>
                            <Ionicons name="happy-outline" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Ionicons name="send" size={20} color={COLORS.white} style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Emoji Picker Modal */}
            <Modal
                visible={showEmojiPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEmojiPicker(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowEmojiPicker(false)}
                >
                    <View style={styles.emojiPickerContainer}>
                        <View style={styles.emojiHeader}>
                            <Text style={styles.emojiTitle}>Select Emoji</Text>
                            <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.emojiGrid}>
                            {EMOJIS.map((emoji, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.emojiItem}
                                    onPress={() => {
                                        handleEmojiSelect(emoji);
                                        setShowEmojiPicker(false);
                                    }}
                                >
                                    <Text style={styles.emojiText}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'ios' ? 50 : 30, // Safe area
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
    },
    backBtn: {
        marginRight: SPACING.m,
    },
    ownerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    ownerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
        marginRight: 4,
    },
    statusText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    contextBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingVertical: 10,
        paddingHorizontal: SPACING.m,
    },
    contextText: {
        fontSize: 12,
        color: '#1E40AF',
    },

    messagesContainer: {
        flex: 1,
    },
    dateSeparator: {
        alignItems: 'center',
        marginTop: SPACING.m,
        marginBottom: SPACING.l,
    },
    dateText: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: SPACING.m,
        maxWidth: '85%',
    },
    ownerRow: {
        alignSelf: 'flex-start',
    },
    userRow: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    msgAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
        marginTop: 2, // Align with top of bubble
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
    },
    ownerBubble: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 4,
        ...LAYOUT.shadow,
        shadowOpacity: 0.05,
    },
    userBubble: {
        backgroundColor: '#2563EB',
        borderTopRightRadius: 4,
    },
    msgText: {
        fontSize: 14,
        lineHeight: 20,
    },
    ownerMsgText: {
        color: COLORS.textPrimary,
    },
    userMsgText: {
        color: COLORS.white,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 4,
    },
    timeText: {
        fontSize: 10,
        color: '#94A3B8',
    },

    // Image Message
    imageBubble: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    msgImage: {
        width: 200,
        height: 120,
    },

    // AI Component
    aiCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        overflow: 'hidden',
        marginLeft: 36, // Indent for missing avatar
        marginBottom: 4,
        ...LAYOUT.shadow,
        shadowOpacity: 0.05,
    },
    aiBar: {
        width: 4,
        backgroundColor: '#2563EB',
    },
    aiContent: {
        padding: 12,
        flex: 1,
    },
    aiLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2563EB',
        marginBottom: 4,
    },
    aiText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        lineHeight: 20,
    },

    // Typing
    typingRow: {
        flexDirection: 'row',
        marginTop: 12,
        marginLeft: 0,
    },
    typingBubble: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 16,
        borderTopLeftRadius: 4,
        alignItems: 'center',
        gap: 4,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#94A3B8',
    },

    // Input Area
    quickActionsScroll: {
        maxHeight: 50,
        backgroundColor: COLORS.background,
        paddingTop: 8,
    },
    quickActionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: 8,
        gap: 6,
    },
    quickActionText: {
        fontSize: 12,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.s,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    plusBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    inputFieldContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 44,
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textPrimary,
        height: '100%',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },

    // Emoji Picker
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    emojiPickerContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
        maxHeight: '60%',
    },
    emojiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    emojiTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    emojiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    emojiItem: {
        width: '20%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojiText: {
        fontSize: 32,
    },
});
