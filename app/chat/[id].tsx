import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';
import { PROPERTIES } from '../../src/data/properties';

const { width } = Dimensions.get('window');

// Mock data for the specific conversation from the screenshot
const MOCK_MESSAGES = [
    {
        id: '1',
        text: "Hello! Thanks for your interest in the RS Puram property.",
        isUser: false,
        time: '10:30 AM',
        type: 'text'
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        isUser: false,
        time: '10:31 AM',
        type: 'image'
    },
    {
        id: '3',
        text: "Here is a recent photo of the living area. It gets plenty of morning sunlight.",
        isUser: false,
        time: '10:31 AM',
        type: 'text'
    },
    {
        id: '4',
        text: "That looks spacious! Is the 3BHK in Peelamedu still available for viewing tomorrow?",
        isUser: true,
        time: '10:45 AM',
        type: 'text',
        isRead: true,
    },
    {
        id: '5',
        text: "Yes, it is available. I can schedule a visit for 11 AM.",
        isUser: false,
        time: '10:48 AM',
        type: 'ai-suggestion', // Special type for AI suggested response
    }
];

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState('');

    // Find property/owner details based on ID
    const property = PROPERTIES.find(p => p.id === Number(id)) || PROPERTIES[0];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.ownerInfo}>
                        <Image source={property.owner.image} style={styles.avatar} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.ownerName} numberOfLines={1}>{property.owner.name} (Owner)</Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText} numberOfLines={1}>Active now • {property.type} in {property.address.split(',')[0]}...</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <TouchableOpacity onPress={() => router.push('/dashboard/saved-properties')}>
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
                    <Text style={styles.contextText}>Interested in <Text style={{ fontWeight: 'bold' }}>{property.type} @ {property.address.split(',')[0]}</Text></Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} style={{ marginLeft: 'auto' }} />
                </View>
            </View>

            {/* Messages Area */}
            <ScrollView
                style={styles.messagesContainer}
                contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: SPACING.m }}
            >
                <View style={styles.dateSeparator}>
                    <Text style={styles.dateText}>Today</Text>
                </View>

                {MOCK_MESSAGES.map((msg) => (
                    <View key={msg.id} style={[
                        styles.messageRow,
                        msg.isUser ? styles.userRow : styles.ownerRow
                    ]}>
                        {!msg.isUser && msg.type !== 'ai-suggestion' && (
                            <Image source={property.owner.image} style={styles.msgAvatar} />
                        )}

                        {msg.type === 'text' && (
                            <View>
                                <View style={[
                                    styles.bubble,
                                    msg.isUser ? styles.userBubble : styles.ownerBubble
                                ]}>
                                    <Text style={[
                                        styles.msgText,
                                        msg.isUser ? styles.userMsgText : styles.ownerMsgText
                                    ]}>{msg.text}</Text>
                                </View>
                                <View style={[styles.timeRow, msg.isUser ? { justifyContent: 'flex-end' } : { marginLeft: 0 }]}>
                                    <Text style={styles.timeText}>{msg.time}</Text>
                                    {msg.isRead && (
                                        <Ionicons name="checkmark-done" size={12} color={COLORS.primary} style={{ marginLeft: 4 }} />
                                    )}
                                </View>
                            </View>
                        )}

                        {msg.type === 'image' && (
                            <View>
                                <View style={styles.imageBubble}>
                                    <Image source={{ uri: msg.image }} style={styles.msgImage} resizeMode="cover" />
                                </View>
                                <Text style={styles.timeText}>{msg.time}</Text>
                            </View>
                        )}

                        {/* Special AI Suggestion Card */}
                        {msg.type === 'ai-suggestion' && (
                            <View style={{ width: '100%' }}>
                                <View style={styles.aiCard}>
                                    <View style={styles.aiBar} />
                                    <View style={styles.aiContent}>
                                        <Text style={styles.aiLabel}>AI SUGGESTION</Text>
                                        <Text style={styles.aiText}>{msg.text}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.timeText, { marginLeft: 40 }]}>{msg.time}</Text>

                                {/* Typing Indicator for AI flow */}
                                <View style={styles.typingRow}>
                                    <Image source={property.owner.image} style={styles.msgAvatar} />
                                    <View style={styles.typingBubble}>
                                        <View style={styles.typingDot} />
                                        <View style={[styles.typingDot, { opacity: 0.6 }]} />
                                        <View style={[styles.typingDot, { opacity: 0.3 }]} />
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                {/* Quick Actions */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll} contentContainerStyle={{ paddingHorizontal: SPACING.m }}>
                    <TouchableOpacity style={styles.quickActionChip}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.textPrimary} />
                        <Text style={styles.quickActionText}>Schedule Visit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionChip}>
                        <Ionicons name="cash-outline" size={16} color={COLORS.textPrimary} />
                        <Text style={styles.quickActionText}>Negotiate Rent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionChip}>
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
                            onChangeText={setMessage}
                        />
                        <TouchableOpacity>
                            <Ionicons name="happy-outline" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.sendBtn}>
                        <Ionicons name="send" size={20} color={COLORS.white} style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
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
});
