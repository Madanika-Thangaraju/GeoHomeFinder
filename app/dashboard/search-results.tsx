import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getProfile, tenantProperties } from '@/src/services/service';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { COLORS, LAYOUT } from '../../src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const HOUSE_IMAGES = [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
];

export default function SearchResultsScreen() {
    const router = useRouter();
    const [searchMode, setSearchMode] = useState('pin');
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchProperties();
        }, [])
    );

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const prefsString = await AsyncStorage.getItem('rentalPreferences');
            let filters = null;
            if (prefsString) {
                const prefs = JSON.parse(prefsString);

                // Map frontend 'Buy' to backend 'Sell'
                let listingType = prefs.purpose;
                if (listingType === 'Buy') listingType = 'Sell';

                filters = {
                    minPrice: prefs.minBudget,
                    maxPrice: prefs.maxBudget,
                    propertyType: prefs.selectedPropertyType,
                    bedrooms: prefs.selectedConfig?.split(' ')[0],
                    listingType: listingType
                };

                // If PG is selected as property type, ensure we also filter by listingType PG
                if (prefs.selectedPropertyType === 'PG/Co-living') {
                    filters.listingType = 'PG/Co-living';
                }
            }

            // Fetch from API
            const data = await tenantProperties(undefined, undefined, undefined, filters);

            const formatted = (data || []).map((prop: any, index: number) => ({
                id: prop.id?.toString(),
                price: prop.price ? `$${prop.price}` : (prop.rent_price ? `$${prop.rent_price}` : 'Price on request'),
                period: prop.rent_price ? '/mo' : '',
                address: prop.address || 'No address provided',
                image: prop.images?.[0]?.image_url || HOUSE_IMAGES[index % HOUSE_IMAGES.length],
                beds: prop.bedrooms || prop.bhk || 0,
                baths: prop.bathrooms || 0,
                sqft: prop.sqft ? `${prop.sqft} sqft` : 'N/A',
                match: `${Math.floor(Math.random() * 20) + 80}%`, // Simulated match score
                status: prop.status || 'Available',
                isTopMatch: Math.random() > 0.7,
            }));

            setProperties(formatted);
        } catch (error) {
            console.error('Failed to load properties in SearchResults', error);
        } finally {
            setLoading(false);
        }
    };

    const MapMarker = ({ price, top, left, active }: { price: string, top: number, left: number, active?: boolean }) => (
        <View style={[styles.mapMarker, { top, left }, active && styles.mapMarkerActive]}>
            {active ? (
                <Ionicons name="home" size={12} color={COLORS.white} />
            ) : (
                <Text style={styles.markerText}>{price}</Text>
            )}
            {active && <View style={styles.markerArrow} />}
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>Finding matches...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Map Header Background */}
            <View style={styles.mapContainer}>
                {/* Simulated Map Image */}
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80' }}
                    style={styles.mapImage}
                    resizeMode="cover"
                />
                {/* Fallback overlay if image doesn't load/is placeholder */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#BFDBFE', opacity: 0.3 }]} />

                {/* Header Controls */}
                <View style={styles.headerControls}>
                    <View style={styles.headerTopRow}>
                        <TouchableOpacity style={styles.roundBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <View style={styles.searchBar}>
                            <Ionicons name="location-sharp" size={16} color={COLORS.textSecondary} />
                            <Text style={styles.searchText}>Mission District, SF</Text>
                            <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                        </View>
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

                {/* Simulated Markers */}
                <MapMarker price="$2,850" top={220} left={150} />
                <MapMarker price="$2,500" top={280} left={260} active />
                <MapMarker price="$3,100" top={340} left={120} />
            </View>

            {/* Bottom Sheet Results */}
            <Animated.View style={styles.resultsSheet}>
                <View style={styles.dragHandle} />

                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsTitle}>{properties.length} {properties.length === 1 ? 'Home' : 'Homes'} Matched</Text>
                    <TouchableOpacity onPress={() => router.push('/dashboard/rental-preferences')}>
                        <Text style={styles.editFiltersText}>Edit Filters</Text>
                    </TouchableOpacity>
                </View>

                {/* Property List */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {properties.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image }} style={styles.cardImage} />
                                {item.status === 'Sold Out' ? (
                                    <View style={styles.soldOutOverlay}>
                                        <View style={styles.soldOutBadgeLarge}>
                                            <Text style={styles.soldOutTextLarge}>SOLD OUT</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[styles.statusBadge, styles.availableBadge]}>
                                        <Text style={[styles.statusText, styles.availableText]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.imageCountBadge}>
                                    <Ionicons name="camera" size={12} color={COLORS.white} />
                                    <Text style={styles.imageCountText}>8</Text>
                                </View>
                                {item.isTopMatch && (
                                    <View style={styles.topMatchBadge}>
                                        <Text style={styles.topMatchText}>HIGH MATCH</Text>
                                    </View>
                                )}
                                <TouchableOpacity style={styles.heartBtn}>
                                    <Ionicons name="heart-outline" size={20} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.4)']}
                                    style={StyleSheet.absoluteFillObject}
                                />
                            </View>

                            <View style={styles.cardContent}>
                                <View style={styles.cardHeaderRow}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.priceRow}>
                                            <Text style={styles.price}>{item.price}</Text>
                                            <Text style={styles.period}>{item.period}</Text>
                                        </View>
                                        <Text style={styles.address}>{item.address}</Text>
                                    </View>
                                    {item.match && (
                                        <View style={styles.matchBadge}>
                                            <Ionicons name="sparkles" size={14} color="#059669" />
                                            <Text style={styles.matchText}>{item.match}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.featuresRow}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="bed" size={16} color={COLORS.primary} />
                                        <Text style={styles.featureText}>{item.beds}bd</Text>
                                    </View>
                                    <View style={styles.featureDivider} />
                                    <View style={styles.featureItem}>
                                        <Ionicons name="water" size={16} color={COLORS.primary} />
                                        <Text style={styles.featureText}>{item.baths}ba</Text>
                                    </View>
                                    <View style={styles.featureDivider} />
                                    <View style={styles.featureItem}>
                                        <Ionicons name="resize" size={16} color={COLORS.primary} />
                                        <Text style={styles.featureText}>{item.sqft}</Text>
                                    </View>
                                </View>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.detailsBtn} onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}>
                                        <Text style={styles.detailsBtnText}>Details</Text>
                                    </TouchableOpacity>
                                    {item.status !== 'Sold Out' ? (
                                        <TouchableOpacity style={styles.selectBtn} onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}>
                                            <Text style={styles.selectBtnText}>Select Home</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.soldOutBtn} disabled>
                                            <Text style={styles.soldOutBtnText}>Sold Out</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* View All on Map Floating Button Area */}
                    <View style={{ height: 80 }} />
                </ScrollView>
            </Animated.View>

            <View style={styles.floatingMapBtnContainer}>
                <TouchableOpacity style={styles.floatingMapBtn}>
                    <Text style={styles.floatingMapBtnText}>View All on Map</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BFDBFE', // Map bg color fallback
    },
    mapContainer: {
        height: height * 0.45,
        width: '100%',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    headerControls: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 10,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    roundBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...LAYOUT.shadow,
    },
    searchBar: {
        flex: 1,
        height: 44,
        backgroundColor: COLORS.white,
        borderRadius: 22,
        marginLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        ...LAYOUT.shadow,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
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
        color: COLORS.white,
    },
    searchText: {
        flex: 1,
        marginLeft: 8,
        fontWeight: '500',
        color: COLORS.textPrimary,
        fontSize: 14,
    },
    mapMarker: {
        position: 'absolute',
        backgroundColor: '#1E293B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    mapMarkerActive: {
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    markerText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 10,
    },
    markerArrow: {
        position: 'absolute',
        bottom: -6,
        left: 10,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: COLORS.primary,
    },
    /* Results Sheet */
    resultsSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.7, // Slightly taller
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 12,
        ...LAYOUT.shadow,
        shadowOpacity: 0.1,
        elevation: 10,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#CBD5E1',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    editFiltersText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 13,
    },
    filterTagsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    filterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterTagText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 100, // Move home cards significantly down as requested
        paddingBottom: 100,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...LAYOUT.shadow,
    },
    imageContainer: {
        height: 180,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
    },
    availableBadge: {
        backgroundColor: COLORS.primary,
        opacity: 0.9,
    },
    soldOutBadge: {
        backgroundColor: '#64748B', // Gray
    },
    statusText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    soldOutText: { color: COLORS.white },
    availableText: { color: COLORS.white },

    heartBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 25,
        ...LAYOUT.shadow,
    },
    topMatchBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#6366F1', // Indigo for premium feel
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        zIndex: 25,
    },
    topMatchText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    imageCountBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    imageCountText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },

    cardContent: {
        padding: 16,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    period: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 2,
    },
    address: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    matchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    matchText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#059669',
    },
    featuresRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: 12,
        color: COLORS.textPrimary, // Darker for better "neatness"
        fontWeight: '600',
    },
    featureDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 10,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    detailsBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    detailsBtnText: {
        color: COLORS.textPrimary,
        fontWeight: '600',
        fontSize: 13,
    },
    selectBtn: {
        flex: 1.5,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    selectBtnText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 13,
    },
    soldOutBtn: {
        flex: 1.5,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    soldOutBtnText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
        fontSize: 13,
    },

    floatingMapBtnContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    floatingMapBtn: {
        backgroundColor: '#0F172A',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 24,
        width: '100%',
        alignItems: 'center',
        ...LAYOUT.shadow,
    },
    floatingMapBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    soldOutOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    soldOutBadgeLarge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        transform: [{ rotate: '-15deg' }],
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    soldOutTextLarge: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
