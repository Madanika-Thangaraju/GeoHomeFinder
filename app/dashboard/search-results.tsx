import { tenantProperties } from '@/src/services/service';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated from 'react-native-reanimated';
import { COLORS, LAYOUT } from '@/src/constants/theme';

const { width, height } = Dimensions.get('window');

const HOUSE_IMAGES = [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
];

export default function SearchResultsScreen() {
    const router = useRouter();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchLocation, setSearchLocation] = useState('Search results');

    const [region, setRegion] = useState({
        latitude: 11.0168,
        longitude: 76.9558,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const mapRef = useRef<MapView>(null);

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
            let prefs = null;
            if (prefsString) {
                prefs = JSON.parse(prefsString);
                let listingType = prefs.purpose;
                if (listingType === 'Buy') listingType = 'Sell';
                filters = {
                    minPrice: prefs.minBudget,
                    maxPrice: prefs.maxBudget,
                    propertyType: prefs.selectedPropertyTypes?.join(','),
                    bedrooms: prefs.selectedConfig?.split(' ')[0],
                    listingType: listingType,
                    category: prefs.category,
                    furnishing: prefs.furnishing,
                    floorNo: prefs.floorNo,
                    parking: prefs.parking,
                    mainRoadFacing: prefs.mainRoadFacing,
                    washrooms: prefs.washrooms
                };

                if (prefs.location) {
                    setSearchLocation(prefs.location.address?.split(',')[0] || 'Selected Area');
                    setRegion({
                        latitude: prefs.location.lat,
                        longitude: prefs.location.lng,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    });
                }
            }

            const targetLat = prefs?.location?.lat;
            const targetLng = prefs?.location?.lng;
            const data = await tenantProperties(targetLat, targetLng, undefined, filters);

            const formatted = (data || []).map((prop: any, index: number) => ({
                id: prop.id?.toString(),
                price: prop.price || (prop.rent_price ? `₹${prop.rent_price.toLocaleString('en-IN')}` : 'Price on request'),
                period: prop.rent_price ? '/mo' : '',
                address: prop.address || 'No address provided',
                image: prop.image?.uri || prop.images?.[0]?.image_url || HOUSE_IMAGES[index % HOUSE_IMAGES.length],
                beds: prop.bedrooms || prop.bhk || 0,
                baths: prop.bathrooms || 0,
                sqft: prop.size || (prop.sqft ? `${prop.sqft} sqft` : 'N/A'),
                match: `${Math.floor(Math.random() * 20) + 80}%`,
                status: prop.status || 'Available',
                isTopMatch: Math.random() > 0.7,
                latitude: parseFloat(prop.location?.lat || prop.latitude || 0) || 11.0168,
                longitude: parseFloat(prop.location?.lng || prop.longitude || 0) || 76.9558
            }));

            setProperties(formatted);

            if (formatted.length > 0 && !prefs?.location) {
                setRegion({
                    latitude: formatted[0].latitude,
                    longitude: formatted[0].longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
            }

        } catch (error) {
            console.error('Failed to load properties in SearchResults', error);
        } finally {
            setLoading(false);
        }
    };

    const fitAllMarkers = () => {
        if (properties.length > 0 && mapRef.current) {
            const coords = properties.map(p => ({ latitude: p.latitude, longitude: p.longitude }));
            mapRef.current.fitToCoordinates(coords, {
                edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                animated: true
            });
        }
    };

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
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFillObject}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    showsUserLocation={true}
                >
                    {properties.map((prop) => (
                        <Marker
                            key={prop.id}
                            coordinate={{ latitude: prop.latitude, longitude: prop.longitude }}
                            title={prop.address}
                        >
                            <View style={styles.mapMarker}>
                                <Text style={styles.markerText}>{prop.price}</Text>
                            </View>
                        </Marker>
                    ))}
                </MapView>

                <View style={styles.headerControls}>
                    <View style={styles.headerTopRow}>
                        <TouchableOpacity style={styles.roundBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <View style={styles.searchBar}>
                            <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
                            <Text style={styles.searchText} numberOfLines={1}>
                                {searchLocation}
                            </Text>
                            <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                        </View>
                    </View>
                </View>
            </View>

            <Animated.View style={styles.resultsSheet}>
                <View style={styles.dragHandle} />

                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsTitle}>{properties.length} {properties.length === 1 ? 'Home' : 'Homes'} Matched</Text>
                    <TouchableOpacity onPress={() => router.push('/dashboard/rental-preferences')}>
                        <Text style={styles.editFiltersText}>Edit Filters</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {properties.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.card}
                            onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
                        >
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image }} style={styles.cardImage} />
                                <View style={[styles.statusBadge, styles.availableBadge]}>
                                    <Text style={styles.statusText}>{item.status}</Text>
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
                                    <View style={styles.matchBadge}>
                                        <Ionicons name="sparkles" size={14} color="#059669" />
                                        <Text style={styles.matchText}>{item.match}</Text>
                                    </View>
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
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </Animated.View>

            <View style={styles.floatingMapBtnContainer}>
                <TouchableOpacity style={styles.floatingMapBtn} onPress={fitAllMarkers}>
                    <Text style={styles.floatingMapBtnText}>View All on Map</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    mapContainer: { height: height * 0.4, width: '100%' },
    headerControls: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 10 },
    headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    roundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...LAYOUT.shadow },
    searchBar: { flex: 1, height: 44, backgroundColor: COLORS.white, borderRadius: 22, marginLeft: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, ...LAYOUT.shadow },
    searchText: { flex: 1, marginLeft: 8, fontWeight: '500', color: COLORS.textPrimary, fontSize: 13 },
    mapMarker: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: COLORS.white, ...LAYOUT.shadow },
    markerText: { color: COLORS.white, fontWeight: 'bold', fontSize: 10 },
    resultsSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.65, backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 12, ...LAYOUT.shadow },
    dragHandle: { width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    resultsTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
    editFiltersText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
    listContent: { paddingHorizontal: 20, paddingBottom: 100 },
    card: { backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', ...LAYOUT.shadow },
    imageContainer: { height: 180, position: 'relative' },
    cardImage: { width: '100%', height: '100%' },
    statusBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, zIndex: 10 },
    availableBadge: { backgroundColor: COLORS.primary, opacity: 0.9 },
    statusText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
    heartBtn: { position: 'absolute', top: 12, right: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', zIndex: 25, ...LAYOUT.shadow },
    topMatchBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#6366F1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, zIndex: 25 },
    topMatchText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
    cardContent: { padding: 16 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline' },
    price: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
    period: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 2 },
    address: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    matchBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    matchText: { fontSize: 11, fontWeight: 'bold', color: '#059669' },
    featuresRow: { flexDirection: 'row', alignItems: 'center' },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    featureText: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '600' },
    featureDivider: { width: 1, height: 12, backgroundColor: '#CBD5E1', marginHorizontal: 10 },
    floatingMapBtnContainer: { position: 'absolute', bottom: 30, left: 20, right: 20, alignItems: 'center' },
    floatingMapBtn: { backgroundColor: '#0F172A', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 24, width: '100%', alignItems: 'center', ...LAYOUT.shadow },
    floatingMapBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
});
