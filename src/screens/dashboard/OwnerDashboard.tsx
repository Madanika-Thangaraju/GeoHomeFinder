import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { GlassCard } from '../../components/shared/GlassCard';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { COLORS, FONTS, LAYOUT, SPACING } from '../../constants/theme';

export const OwnerDashboard = () => {
    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brand}>GEOHOME</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
                            <Text style={styles.locationText}>San Francisco, CA</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.welcomeText}>Manage your Real Estate Portfolio</Text>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <GlassCard style={styles.statsCard}>
                        <Text style={styles.statsValue}>12</Text>
                        <Text style={styles.statsLabel}>Active Listings</Text>
                    </GlassCard>
                    <GlassCard style={styles.statsCard}>
                        <Text style={styles.statsValue}>2.4k</Text>
                        <Text style={styles.statsLabel}>Weekly Views</Text>
                        <View style={styles.trendContainer}>
                            <Ionicons name="trending-up" size={16} color={COLORS.success} />
                            <Text style={styles.trendText}>+12%</Text>
                        </View>
                    </GlassCard>
                </View>

                {/* Call Request */}
                <Text style={styles.sectionTitle}>Incoming Request</Text>
                <Animated.View entering={FadeInRight.delay(200).duration(800)}>
                    <GlassCard style={styles.requestCard}>
                        <View style={styles.requestHeader}>
                            <View style={styles.userAvatar}>
                                <Text style={{ fontSize: 20 }}>👤</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.requesterName}>Michael Scott</Text>
                                <Text style={styles.requestProperty}>Interested in: Sunnyvale Villa</Text>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]}>
                                <Text style={styles.actionText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]}>
                                <Text style={styles.actionText}>Accept Call</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* Featured Property Showcase */}
                <Text style={styles.sectionTitle}>Featured Property</Text>
                <GlassCard style={styles.propertyCard}>
                    <View style={styles.imagePlaceholder}>
                        <Text style={{ color: COLORS.textSecondary }}>Property Image</Text>
                        {/* Real app would use <Image source={{uri: ...}} /> */}
                    </View>
                    <View style={styles.propertyOverlay}>
                        <Text style={styles.propertyPrice}>$4,500 / mo</Text>
                        <Text style={styles.propertyAddress}>123 Marina Blvd</Text>
                    </View>
                </GlassCard>

                {/* Add Property Button */}
                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add" size={24} color={COLORS.white} />
                    <Text style={styles.addBtnText}>Add New Property</Text>
                </TouchableOpacity>

            </ScrollView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.l,
        paddingTop: SPACING.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    brand: {
        fontSize: FONTS.sizes.h2,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: 1,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    locationText: {
        color: COLORS.textSecondary,
        marginLeft: SPACING.xs,
        fontSize: FONTS.sizes.caption,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
    },
    welcomeText: {
        fontSize: FONTS.sizes.h2,
        color: COLORS.white,
        marginBottom: SPACING.l,
        lineHeight: 32,
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginBottom: SPACING.xl,
    },
    statsCard: {
        flex: 1,
        padding: SPACING.l,
        alignItems: 'center',
    },
    statsValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    statsLabel: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.small,
        marginTop: SPACING.xs,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.s,
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        paddingHorizontal: SPACING.s,
        paddingVertical: 2,
        borderRadius: 12,
    },
    trendText: {
        color: COLORS.success,
        fontSize: FONTS.sizes.small,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: FONTS.sizes.h3,
        color: COLORS.white,
        marginBottom: SPACING.m,
        marginTop: SPACING.m,
    },
    requestCard: {
        padding: SPACING.m,
    },
    requestHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    requesterName: {
        color: COLORS.white,
        fontSize: FONTS.sizes.body,
        fontWeight: 'bold',
    },
    requestProperty: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.caption,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: SPACING.s,
        borderRadius: LAYOUT.radius.s,
        alignItems: 'center',
    },
    acceptBtn: {
        backgroundColor: COLORS.success,
    },
    rejectBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    actionText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: FONTS.sizes.caption,
    },
    propertyCard: {
        height: 200,
        padding: 0,
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
    },
    propertyOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.m,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    propertyPrice: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: FONTS.sizes.h3,
    },
    propertyAddress: {
        color: COLORS.textPrimary,
        fontSize: FONTS.sizes.body,
    },
    addBtn: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: LAYOUT.radius.m,
        padding: SPACING.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING.xxl,
    },
    addBtnText: {
        color: COLORS.primary,
        marginLeft: SPACING.s,
        fontWeight: 'bold',
    },
});
