import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// We still use GradientBackground for the map placeholder simulation but different style
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../../src/components/shared/GradientBackground';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

const MOCK_PROPERTIES = [
    { id: 1, price: '₹12,500', type: '2 BHK', size: '950 sqft', dist: '0.2 km', address: 'Gandhipuram, Coimbatore', match: '90% Match' },
    { id: 2, price: '₹18,000', type: '1 BHK', size: 'Loft Style', dist: '1.2 km', address: 'RS Puram, Coimbatore', match: '85% Match' },
];

export default function TenantDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Search Header (Floating) */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.searchPlaceholder}>Gandhipuram, Coimbatore</Text>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.filterRow}>
                    <TouchableOpacity style={[styles.filterPill, styles.activePill]}>
                        <Text style={styles.activePillText}>Pin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterPill, { backgroundColor: COLORS.primary }]}>
                        <Text style={[styles.pillText, { color: COLORS.white }]}>Radius</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterPill}>
                        <Text style={styles.pillText}>Draw</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Map Layer (Simulated) */}
            <View style={styles.mapLayer}>
                {/* This would be <MapView /> in real app */}
                <GradientBackground style={{ opacity: 0.1 }}>
                    {/* Map UI Elements */}
                    <View style={styles.radiusCircle} />
                    <View style={[styles.mapPin, { top: '40%', left: '50%' }]}>
                        <Ionicons name="home" size={16} color={COLORS.white} />
                    </View>
                </GradientBackground>
            </View>

            {/* Side Controls */}
            <View style={styles.sideControls}>
                <TouchableOpacity style={styles.controlBtn}>
                    <Ionicons name="navigate" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet Listing */}
            <View style={styles.bottomSheet}>
                {/* Handle */}
                <View style={styles.sheetHandle} />

                {/* Alert Toggle */}
                <View style={styles.alertToggle}>
                    <View style={styles.alertIcon}>
                        <Ionicons name="wifi" size={16} color={COLORS.success} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.alertTitle}>Push Alerts Active</Text>
                        <Text style={styles.alertSubtitle}>Notifying you when entering this zone.</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="toggle" size={28} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>


                {/* Radius Slider Placeholder */}
                <View style={styles.radiusSlider}>
                    <Text style={styles.sliderLabel}>Alert Radius</Text>
                    <Text style={styles.sliderValue}>1.5 km</Text>
                </View>
                <View style={styles.sliderLine}>
                    <View style={styles.sliderKnob} />
                </View>

                <View style={styles.listHeader}>
                    <Text style={styles.listCount}>3 homes near you</Text>
                    <View style={styles.liveBadge}>
                        <View style={styles.badgeDot} />
                        <Text style={styles.badgeText}>LIVE UPDATES</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.propertyList}
                    showsVerticalScrollIndicator={false}
                >
                    {MOCK_PROPERTIES.map((prop) => (
                        <TouchableOpacity
                            key={prop.id}
                            activeOpacity={0.9}
                            onPress={() => router.push({ pathname: '/property/[id]', params: { id: prop.id } })}
                        >
                            <View style={styles.propertyCard}>
                                <View style={styles.cardImage} />
                                <View style={styles.cardContent}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardPrice}>{prop.price}<Text style={styles.cardPeriod}>/mo</Text></Text>
                                        <Ionicons name="heart-outline" size={20} color={COLORS.textSecondary} />
                                    </View>
                                    <Text style={styles.cardDetails}>{prop.type} • {prop.type === '2 BHK' ? '2 Bath' : '1 Bath'} • {prop.size}</Text>
                                    <Text style={styles.cardAddress}>{prop.address}</Text>

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.matchScore}>{prop.match}</Text>
                                        <Text style={styles.petBadge}>Pet Friendly</Text>
                                    </View>

                                    <View style={styles.distBadge}>
                                        <Ionicons name="location" size={10} color={COLORS.white} />
                                        <Text style={styles.distText}>{prop.dist}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    searchContainer: {
        position: 'absolute',
        top: 60,
        left: SPACING.l,
        right: SPACING.l,
        zIndex: 10,
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: LAYOUT.radius.l,
        alignItems: 'center',
        ...LAYOUT.shadow,
        marginBottom: SPACING.m,
    },
    searchPlaceholder: {
        flex: 1,
        marginLeft: SPACING.s,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.s,
    },
    filterPill: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        ...LAYOUT.shadow,
    },
    activePill: {
        backgroundColor: COLORS.white,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    activePillText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    mapLayer: {
        height: '50%',
        width: '100%',
    },
    radiusCircle: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '80%',
        height: 300,
        borderRadius: 150,
        borderWidth: 2,
        borderColor: 'rgba(37, 99, 235, 0.3)',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
    },
    mapPin: {
        position: 'absolute',
        width: 32,
        height: 32,
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
        ...LAYOUT.shadow,
    },
    sideControls: {
        position: 'absolute',
        right: SPACING.l,
        top: '35%',
    },
    controlBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...LAYOUT.shadow,
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -40,
        paddingTop: SPACING.s,
        ...LAYOUT.shadow,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#CBD5E1',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: SPACING.m,
    },
    alertToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginHorizontal: SPACING.l,
        padding: SPACING.m,
        borderRadius: LAYOUT.radius.l,
        marginBottom: SPACING.l,
        ...LAYOUT.shadow,
    },
    alertIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    alertTitle: {
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    alertSubtitle: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    radiusSlider: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.s,
    },
    sliderLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    sliderValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    sliderLine: {
        height: 4,
        backgroundColor: '#E2E8F0',
        marginHorizontal: SPACING.l,
        borderRadius: 2,
        marginBottom: SPACING.l,
    },
    sliderKnob: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        marginTop: -6,
        marginLeft: '40%',
        borderWidth: 2,
        borderColor: COLORS.white,
        ...LAYOUT.shadow,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.m,
    },
    listCount: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
        marginRight: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    propertyList: {
        paddingHorizontal: SPACING.l,
    },
    propertyCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: LAYOUT.radius.m,
        marginBottom: SPACING.m,
        overflow: 'hidden',
        ...LAYOUT.shadow,
        shadowOpacity: 0.05,
        height: 120,
    },
    cardImage: {
        width: 100,
        backgroundColor: '#64748B',
    },
    cardContent: {
        flex: 1,
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    cardPeriod: {
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: 'normal',
    },
    cardDetails: {
        fontSize: 12,
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    cardAddress: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 8,
    },
    matchScore: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    petBadge: {
        fontSize: 10,
        color: COLORS.textSecondary,
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    distBadge: {
        position: 'absolute',
        left: -90, // Position over image
        top: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    distText: {
        color: COLORS.white,
        fontSize: 10,
    }
});
