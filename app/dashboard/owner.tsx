import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Image as RNImage,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
// ... imports
import { GlassCard } from '@/src/components/shared/GlassCard';
import { COLORS, LAYOUT, SPACING } from '@/src/constants/theme';
import { getCallRequestsApi, getNotificationsApi, getOwnerProperties, getProfile, getTourRequestsApi, updateCallStatusApi, updateTourStatusApi } from '@/src/services/service';
import { decodeToken, getToken, getUser } from '@/src/utils/auth';

// ... inside component
export default function OwnerDashboard() {
    const router = useRouter();
    const [listingsCount, setListingsCount] = useState<number | string>('-');
    const [userProfile, setUserProfile] = useState<any>(null);
    const [tourRequests, setTourRequests] = useState<any[]>([]);
    const [callRequests, setCallRequests] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    let userId;

                    // 1. Try Local Storage
                    const user = await getUser();
                    if (user && user.id) {
                        userId = user.id;
                    }

                    // 2. Decode Token (Robust & Fast)
                    if (!userId) {
                        const token = await getToken();
                        if (token) {
                            const decoded = decodeToken(token);
                            if (decoded && (decoded.id || decoded.sub)) {
                                userId = decoded.id || decoded.sub;
                            }
                        }
                    }

                    // 3. Fallback to Profile API
                    try {
                        const profile = await getProfile();
                        setUserProfile(profile);
                        if (!userId) {
                            if (profile?.id) userId = profile.id;
                            else if (profile?.user?.id) userId = profile.user.id;
                            else if (profile?.data?.id) userId = profile.data.id;
                        }
                    } catch (e) {
                        console.log("Failed to get profile", e);
                    }

                    if (userId) {
                        const [listings, tours, calls, notifications] = await Promise.all([
                            getOwnerProperties(userId),
                            getTourRequestsApi('owner'),
                            getCallRequestsApi('owner'),
                            getNotificationsApi('owner')
                        ]);

                        if (Array.isArray(listings)) setListingsCount(listings.length);
                        else setListingsCount(0);

                        if (tours.success) setTourRequests(tours.data);
                        if (calls.success) setCallRequests(calls.data);

                        if (Array.isArray(notifications)) {
                            setUnreadCount(notifications.filter((n: any) => !n.is_read).length);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch dashboard data", error);
                }
            };

            fetchData();
        }, [])
    );

    const handleInteractionStatus = async (type: 'call' | 'tour', id: number, status: 'accepted' | 'rejected') => {
        try {
            if (type === 'call') {
                await updateCallStatusApi(id, status);
            } else {
                await updateTourStatusApi(id, status);
            }
            // Refresh counts
            const [tours, calls] = await Promise.all([
                getTourRequestsApi('owner'),
                getCallRequestsApi('owner')
            ]);
            if (tours.success) setTourRequests(tours.data);
            if (calls.success) setCallRequests(calls.data);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Simplified Header */}
                <View style={[styles.header, { marginBottom: 24 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>

                    </View>

                    {/* Right Side Actions */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/dashboard/notifications')}>
                            <Ionicons
                                name="notifications"
                                size={22}
                                color={COLORS.textSecondary}
                            />
                            {unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <Animated.View entering={FadeInDown.delay(100)} style={{ marginBottom: 12 }}>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.usernameTextGreeting}>{userProfile?.name || 'Owner'}</Text>
                </Animated.View>

                {/* Main Action Title */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <Text style={styles.mainTitle}>
                        Manage your{'\n'}Real Estate Portfolio
                    </Text>
                </Animated.View>

                {/* Hero Section */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.heroSection}>
                    <View style={styles.heroCard}>
                        <RNImage
                            source={{ uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' }}
                            style={styles.heroBackground}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['rgba(15,23,42,0.1)', 'rgba(15,23,42,0.6)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.heroBackground}
                        />

                        <View style={styles.heroContent}>
                            <View style={styles.aiTag}>
                                <Ionicons name="sparkles" size={12} color={COLORS.white} />
                                <Text style={styles.aiTagText}>AI VALUATION ACTIVE</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.addPropertyBtn}
                                onPress={() => router.push('/dashboard/add-property')}
                            >
                                <LinearGradient
                                    colors={['#06B6D4', '#2563EB']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.addPropertyGradient}
                                >
                                    <Text style={styles.addPropertyText}>Add New Property</Text>
                                    <Ionicons
                                        name="arrow-forward"
                                        size={18}
                                        color={COLORS.white}
                                    />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Dynamic Call Requests */}
                {callRequests.filter(r => r.status === 'pending').length > 0 && (
                    <View style={styles.interactionsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.interactionSectionTitle}>Incoming Call Requests</Text>
                            <View style={styles.badgeCount}>
                                <Text style={styles.badgeCountText}>{callRequests.filter(r => r.status === 'pending').length}</Text>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.interactionsScroll}>
                            {callRequests.filter(r => r.status === 'pending').map((req, idx) => (
                                <View key={`owner-call-${idx}`} style={styles.interactionCard}>
                                    <View style={styles.interactionHeader}>
                                        <View style={styles.clientAvatarMini}>
                                            <Text style={styles.avatarTextMini}>{req.other_name.charAt(0)}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.clientNameMini}>{req.other_name}</Text>
                                            <Text style={styles.interactionTypeMini}>wants a call</Text>
                                        </View>
                                    </View>
                                    <View style={styles.interactionActionsMini}>
                                        <TouchableOpacity
                                            style={[styles.miniActionBtn, styles.miniDecline]}
                                            onPress={() => handleInteractionStatus('call', req.id, 'rejected')}
                                        >
                                            <Ionicons name="close" size={14} color="#EF4444" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.miniActionBtn, styles.miniAccept]}
                                            onPress={() => handleInteractionStatus('call', req.id, 'accepted')}
                                        >
                                            <Ionicons name="checkmark" size={14} color="#10B981" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Tour Requests Summary */}
                {tourRequests.filter(r => r.status === 'pending').length > 0 && (
                    <TouchableOpacity
                        style={styles.tourSummaryCard}
                        onPress={() => router.push('/dashboard/tour-requests')}
                    >
                        <View style={styles.tourSummaryIconBg}>
                            <Ionicons name="calendar" size={20} color={COLORS.primary} />
                            <View style={styles.miniBadge}>
                                <Text style={styles.miniBadgeText}>{tourRequests.filter(r => r.status === 'pending').length}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.tourSummaryTitle}>Pending Tour Requests</Text>
                            <Text style={styles.tourSummarySub}>{tourRequests.filter(r => r.status === 'pending').length} tenants waiting for response</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}

                {/* Stats */}
                {/* Stats */}
                {/* Stats */}

                {/* View Analytics Button */}
                <TouchableOpacity
                    style={styles.analyticsBtn}
                    onPress={() => router.push('/dashboard/owner-stats')}
                >
                    <LinearGradient
                        colors={['#F8FAFC', '#EFF6FF']}
                        style={styles.analyticsGradient}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={styles.analyticsIconBg}>
                                <Ionicons name="stats-chart" size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.analyticsTitle}>View Detailed Analytics</Text>
                                <Text style={styles.analyticsSub}>Check sold, pending, and favorited properties</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/owner')}>
                    <Ionicons name="grid" size={22} color={COLORS.textSecondary} />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/owner-chats')}>
                    <Ionicons name="chatbubbles" size={22} color={COLORS.textSecondary} />
                    <Text style={styles.navLabel}>Chats</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/my-listings')}>
                    <Ionicons name="list" size={22} color={COLORS.textSecondary} />
                    <Text style={styles.navLabel}>Listings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/profile-owner')}>
                    <Ionicons name="person" size={22} color={COLORS.textSecondary} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        padding: SPACING.l,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    locationIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    brandTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        color: COLORS.textPrimary,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    notificationBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    greeting: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '500',
    },
    usernameTextGreeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 2,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#60A5FA',
        marginBottom: SPACING.l,
    },
    heroSection: {
        marginBottom: SPACING.l,
    },
    heroCard: {
        height: 220,
        borderRadius: LAYOUT.radius.l,
        overflow: 'hidden',
    },
    heroBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'space-between',
    },
    aiTag: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    aiTagText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },

    heroDescription: {
        color: COLORS.white,
        fontSize: 14,
        maxWidth: '70%',
    },
    addPropertyBtn: {
        borderRadius: LAYOUT.radius.l,
        overflow: 'hidden',
    },
    addPropertyGradient: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
    },
    addPropertyText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    callCard: {
        backgroundColor: COLORS.white,
        borderRadius: LAYOUT.radius.l,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    callCardHeader: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    callIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(16,185,129,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    callInfo: {
        flex: 1,
    },
    callTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    callSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    boldText: {
        fontWeight: '600',
    },
    actionRequiredBadge: {
        backgroundColor: 'rgba(239,68,68,0.2)',
        padding: 6,
        borderRadius: 6,
    },
    actionRequiredText: {
        fontSize: 10,
        color: '#EF4444',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    callActions: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginTop: SPACING.m,
    },
    viewRequestBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    viewRequestText: {
        fontWeight: '600',
    },
    callBackBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#10B981',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    callBackText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    statsCard: {
        flex: 1,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(192,132,252,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statsValue: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    statsLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    analyticsBtn: {
        marginHorizontal: SPACING.l,
        marginBottom: SPACING.xl,
        borderRadius: LAYOUT.radius.l,
        ...LAYOUT.shadow,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    analyticsGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    analyticsIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyticsTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    analyticsSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navItem: {
        alignItems: 'center',
    },
    navIconActive: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    navLabelActive: {
        color: COLORS.primary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: COLORS.white,
    },

    tourSummaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 12,
    },
    tourSummaryText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    interactionsSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    interactionSectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    badgeCount: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeCountText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    interactionsScroll: {
        gap: 12,
        paddingRight: 20,
    },
    interactionCard: {
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 16,
        width: 160,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...LAYOUT.shadow,
    },
    interactionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    clientAvatarMini: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarTextMini: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    clientNameMini: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    interactionTypeMini: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    interactionActionsMini: {
        flexDirection: 'row',
        gap: 8,
    },
    miniActionBtn: {
        flex: 1,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniDecline: {
        backgroundColor: '#FEF2F2',
    },
    miniAccept: {
        backgroundColor: '#F0FDF4',
    },
    tourSummaryIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    miniBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#EF4444',
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    miniBadgeText: {
        color: COLORS.white,
        fontSize: 8,
        fontWeight: 'bold',
    },
    tourSummaryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    tourSummarySub: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
});
