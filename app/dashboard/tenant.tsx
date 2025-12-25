import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Map placeholder layer

import { Ionicons } from '@expo/vector-icons';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

import { PROPERTIES } from '../../src/data/properties';

const MOCK_PROPERTIES = PROPERTIES;

export default function TenantDashboard() {
    const router = useRouter();
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [radius, setRadius] = useState(1.5);
    const [searchMode, setSearchMode] = useState('pin');

    // Simple interaction to simulate slider movement (toggle between values on tap)
    const toggleRadius = () => {
        setRadius(prev => {
            if (prev === 1.5) return 3.0;
            if (prev === 3.0) return 5.0;
            return 1.5;
        });
    };

    const getKnobPosition = () => {
        if (radius === 1.5) return '10%';
        if (radius === 3.0) return '45%';
        return '80%';
    };

    return (
        <View style={styles.container}>
            {/* Search Header (Floating) */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.searchPlaceholder}>Gandhipuram, Coimbatore</Text>
                    <TouchableOpacity onPress={() => router.push('/dashboard/rental-preferences')}>
                        <Ionicons name="filter" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterPill, searchMode === 'pin' && styles.activePill]}
                        onPress={() => setSearchMode('pin')}
                    >
                        <Text style={[styles.pillText, searchMode === 'pin' && styles.activePillText]}>Pin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterPill, searchMode === 'radius' && styles.activePill]}
                        onPress={() => setSearchMode('radius')}
                    >
                        <Text style={[styles.pillText, searchMode === 'radius' && styles.activePillText]}>Radius</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterPill, searchMode === 'draw' && styles.activePill]}
                        onPress={() => setSearchMode('draw')}
                    >
                        <Text style={[styles.pillText, searchMode === 'draw' && styles.activePillText]}>Draw</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Map Layer (Simulated) */}
            <View style={styles.mapLayer}>
                {/* Background Location Image */}
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80' }}
                    style={[StyleSheet.absoluteFillObject, { opacity: 0.8 }]}
                    resizeMode="cover"
                />

                {/* Map UI Elements */}
                <View style={styles.radiusCircle} />
                <View style={[styles.mapPin, { top: '40%', left: '50%' }]}>
                    <Ionicons name="home" size={16} color={COLORS.white} />
                </View>
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
                <TouchableOpacity
                    style={styles.alertToggle}
                    activeOpacity={0.8}
                    onPress={() => setAlertsEnabled(!alertsEnabled)}
                >
                    <View style={[styles.alertIcon, { backgroundColor: alertsEnabled ? '#DCFCE7' : '#E2E8F0' }]}>
                        <Ionicons name={alertsEnabled ? "wifi" : "wifi-outline"} size={16} color={alertsEnabled ? COLORS.success : COLORS.textSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.alertTitle}>Push Alerts {alertsEnabled ? 'Active' : 'Off'}</Text>
                        <Text style={styles.alertSubtitle}>Notifying you when entering this zone.</Text>
                    </View>
                    <View>
                        <Ionicons name={alertsEnabled ? "toggle" : "toggle-outline"} size={28} color={alertsEnabled ? COLORS.primary : COLORS.textSecondary} />
                    </View>
                </TouchableOpacity>


                {/* Radius Slider Placeholder */}
                <View style={styles.radiusSlider}>
                    <Text style={styles.sliderLabel}>Alert Radius</Text>
                    <Text style={styles.sliderValue}>{radius} km</Text>
                </View>
                {/* Interactive Slider Area */}
                <TouchableOpacity activeOpacity={0.9} onPress={toggleRadius} style={{ marginBottom: SPACING.l }}>
                    <View style={styles.sliderLine}>
                        <View style={[styles.sliderKnob, { marginLeft: getKnobPosition() }]} />
                    </View>
                </TouchableOpacity>

                <View style={styles.listHeader}>
                    <Text style={styles.listCount}>{MOCK_PROPERTIES.length} homes near you</Text>
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
                                <View style={styles.cardImageContainer}>
                                    <Image source={prop.image} style={styles.cardImage} resizeMode="cover" />
                                    <View style={styles.distBadge}>
                                        <Ionicons name="location" size={10} color={COLORS.white} />
                                        <Text style={styles.distText}>{prop.dist}</Text>
                                    </View>
                                    {prop.status === 'Sold Out' && (
                                        <View style={styles.soldOutOverlay}>
                                            <View style={styles.soldOutBadge}>
                                                <Text style={styles.soldOutText}>Sold Out</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                                <View style={[styles.cardContent, prop.status === 'Sold Out' && { opacity: 0.6 }]}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardPrice}>{prop.price}<Text style={styles.cardPeriod}>/mo</Text></Text>
                                        <Ionicons name="heart" size={20} color="#EF4444" />
                                    </View>
                                    <Text style={styles.cardDetails}>{prop.type} • {prop.type === '3 BHK' ? '3 Bath' : (prop.type === '2 BHK' ? '2 Bath' : '1 Bath')} • {prop.size}</Text>
                                    <Text style={styles.cardAddress}>{prop.address}</Text>

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.matchScore}>{prop.match}</Text>
                                        <Text style={styles.petBadge}>Pet Friendly</Text>
                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={24} color={COLORS.primary} />
                    <Text style={[styles.navText, { color: COLORS.primary }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/saved-properties')}>
                    <Ionicons name="heart-outline" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.navText}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/profile-tenant')}>
                    <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
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
        backgroundColor: COLORS.primary,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    activePillText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.white,
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
        // marginBottom: SPACING.l, // Removed since wrapped in Touchable
    },
    sliderKnob: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        marginTop: -6,
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
        borderRadius: 16, // Smoother corners for "neatness"
        marginBottom: SPACING.m,
        overflow: 'hidden',
        ...LAYOUT.shadow,
        shadowOpacity: 0.1,
        height: 120,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardImageContainer: {
        width: 120,
        height: '100%',
        position: 'relative',
    },
    soldOutOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    soldOutBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        transform: [{ rotate: '-10deg' }],
    },
    soldOutText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    cardImage: {
        width: 120,
        height: '100%',
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
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        zIndex: 10,
    },
    distText: {
        color: COLORS.white,
        fontSize: 10,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingBottom: 30, // Safe area
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        color: COLORS.textSecondary,
    },
});
