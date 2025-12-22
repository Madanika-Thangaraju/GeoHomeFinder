import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { GlassCard } from '../../src/components/shared/GlassCard';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

export default function OwnerDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.locationRow}>
                        <View style={styles.locationIconBg}>
                            <Ionicons
                                name="location-sharp"
                                size={16}
                                color={COLORS.primary}
                            />
                        </View>
                        <View>
                            <Text style={styles.brandTitle}>GEOHOME</Text>
                            <Text style={styles.locationText}>Coimbatore, IN</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.notificationBtn}>
                        <Ionicons
                            name="notifications"
                            size={22}
                            color={COLORS.textSecondary}
                        />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>1</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Greeting */}
                <Animated.View entering={FadeInDown.delay(100)}>
                    <Text style={styles.greeting}>Welcome back, Owner</Text>
                    <Text style={styles.mainTitle}>
                        Manage your{'\n'}Real Estate Portfolio
                    </Text>
                </Animated.View>

                {/* Hero Section (NO IMAGE) */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.heroSection}>
                    <View style={styles.heroCard}>
                        <LinearGradient
                            colors={['#0F172A', '#1E293B', '#020617']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroBackground}
                        />

                        <View style={styles.heroContent}>
                            <View style={styles.aiTag}>
                                <Ionicons name="sparkles" size={12} color={COLORS.white} />
                                <Text style={styles.aiTagText}>AI VALUATION ACTIVE</Text>
                            </View>

                            <Text style={styles.heroDescription}>
                                AI-powered price recommendations for your location
                            </Text>

                            <TouchableOpacity style={styles.addPropertyBtn}>
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

                {/* Call Request Card */}
                <Animated.View entering={FadeInRight.delay(300)}>
                    <View style={styles.callCard}>
                        <View style={styles.callCardHeader}>
                            <View style={styles.callIconContainer}>
                                <Ionicons name="call" size={22} color="#10B981" />
                            </View>

                            <View style={styles.callInfo}>
                                <Text style={styles.callTitle}>Call Request from Renter</Text>
                                <Text style={styles.callSubtitle}>
                                    Regarding property:{' '}
                                    <Text style={styles.boldText}>
                                        Greenfield Avenue, Unit 4B
                                    </Text>
                                </Text>
                            </View>

                            <View style={styles.actionRequiredBadge}>
                                <Text style={styles.actionRequiredText}>
                                    Action{'\n'}Required
                                </Text>
                            </View>
                        </View>

                        <View style={styles.callActions}>
                            <TouchableOpacity style={styles.viewRequestBtn}>
                                <Text style={styles.viewRequestText}>View Request</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.callBackBtn}>
                                <Ionicons
                                    name="call"
                                    size={14}
                                    color={COLORS.white}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={styles.callBackText}>Call Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Stats */}
                <View style={styles.statsGrid}>
                    <GlassCard style={styles.statsCard}>
                        <View style={styles.statsIconBg}>
                            <Ionicons name="home" size={24} color="#C084FC" />
                        </View>
                        <Text style={styles.statsValue}>2</Text>
                        <Text style={styles.statsLabel}>Active Listings</Text>
                    </GlassCard>

                    <GlassCard style={styles.statsCard}>
                        <View
                            style={[
                                styles.statsIconBg,
                                { backgroundColor: 'rgba(56,189,248,0.2)' },
                            ]}
                        >
                            <Ionicons name="bar-chart" size={24} color="#38BDF8" />
                        </View>
                        <Text style={styles.statsValue}>+14%</Text>
                        <Text style={styles.statsLabel}>Views this week</Text>
                    </GlassCard>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <View style={styles.navIconActive}>
                        <Ionicons name="grid" size={22} color={COLORS.primary} />
                    </View>
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="list" size={22} color={COLORS.textSecondary} />
                    <Text style={styles.navLabel}>Listings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="chatbubble" size={22} color={COLORS.textSecondary} />
                    <Text style={styles.navLabel}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
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
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    mainTitle: {
        fontSize: 24,
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
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsIconBg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(192,132,252,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statsValue: {
        fontSize: 34,
        fontWeight: 'bold',
    },
    statsLabel: {
        fontSize: 14,
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
});
