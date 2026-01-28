import { getProfile, tenantProperties } from '@/src/services/service';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const GOOGLE_PLACES_API_KEY = "AIzaSyDw84Qp9YXjxqy2m6ECrC-Qa4_yiTyiQ6s";

interface PlacePrediction {
  placeId: string;
  text: { text: string; };
  structuredFormat: {
    mainText: { text: string; };
    secondaryText: { text: string; };
  };
}

const HOUSE_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
];

export default function TenantDashboard() {
  const router = useRouter();
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [radius, setRadius] = useState(1.5);
  const [region, setRegion] = useState({
    latitude: 11.0168,
    longitude: 76.9558,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('favorites');
        if (saved) setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load favorites', error);
      }
    };
    loadFavorites();
  }, []);

  const fetchProperties = async (lat?: number, lng?: number, rad?: number, ignoreFilters: boolean = false) => {
    try {
      setLoading(true);
      let filters = null;

      if (!ignoreFilters) {
        const prefsString = await AsyncStorage.getItem('rentalPreferences');
        if (prefsString) {
          const prefs = JSON.parse(prefsString);
          let listingType = prefs.purpose;
          if (listingType === 'Buy') listingType = 'Sell';
          filters = {
            minPrice: prefs.minBudget,
            maxPrice: prefs.maxBudget,
            propertyType: prefs.selectedPropertyType,
            bedrooms: prefs.selectedConfig?.split(' ')[0],
            listingType: listingType
          };
        }
      }

      const targetLat = lat || locationCoords?.lat;
      const targetLng = lng || locationCoords?.lng;

      const data = await tenantProperties(targetLat, targetLng, rad, filters);
      const enrichedData = (data || []).slice(0, 10).map((prop: any, index: number) => {
        let propertyImage = { uri: prop.images?.[0]?.image_url || HOUSE_IMAGES[index % HOUSE_IMAGES.length] };
        return {
          ...prop,
          image: propertyImage,
          status: 'Available',
          isSoldOut: false,
          match: `${Math.floor(Math.random() * 20) + 80}% Fit`,
        };
      });
      setProperties(enrichedData);
    } catch (error) {
      console.error('Failed to load properties', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Try for last known location first (faster and more reliable in some cases)
      let lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        const coords = { lat: lastKnown.coords.latitude, lng: lastKnown.coords.longitude };
        updateLocationState(coords);
      }

      // Try for current location
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = { lat: location.coords.latitude, lng: location.coords.longitude };
      updateLocationState(coords);

    } catch (error: any) {
      console.log('[Location] Logic failed:', error.message);

      // If we don't have ANY location, alert user about GPS
      const isUnavailable = error.message.includes('unavailable') || error.message.includes('disabled');
      if (!region.latitude && isUnavailable) {
        Alert.alert(
          "Location Unavailable",
          "Please make sure your device's GPS is turned ON in settings.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const updateLocationState = (coords: { lat: number, lng: number }) => {
    setLocationCoords(coords);
    setRegion(prev => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
    fetchProperties(coords.lat, coords.lng, radius);
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await getProfile();
      setUserProfile(profile);
      // Only fallback to profile location if live location isn't available yet
      if (profile.latitude && profile.longitude && !locationCoords) {
        const coords = { lat: parseFloat(profile.latitude), lng: parseFloat(profile.longitude) };
        setLocationCoords(coords);
        setRegion(prev => ({
          ...prev,
          latitude: coords.lat,
          longitude: coords.lng,
        }));
      }
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  const handleZoom = (type: 'in' | 'out') => {
    setRegion(prev => {
      const factor = type === 'in' ? 0.5 : 2;
      return {
        ...prev,
        latitudeDelta: prev.latitudeDelta * factor,
        longitudeDelta: prev.longitudeDelta * factor,
      };
    });
  };

  const onRegionChangeComplete = (newRegion: any) => {
    const lat = parseFloat(newRegion.latitude);
    const lng = parseFloat(newRegion.longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    const parsedRegion = {
      ...newRegion,
      latitude: lat,
      longitude: lng,
      latitudeDelta: parseFloat(newRegion.latitudeDelta) || 0.02,
      longitudeDelta: parseFloat(newRegion.longitudeDelta) || 0.02,
    };
    setRegion(parsedRegion);

    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(() => {
      fetchProperties(parsedRegion.latitude, parsedRegion.longitude, radius, true);
    }, 500);
  };

  useEffect(() => {
    getUserLocation();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (searchQuery.length < 3) {
        setPredictions([]);
        setShowPredictions(false);
        return;
      }
      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places:autocomplete`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            },
            body: JSON.stringify({
              input: searchQuery,
              locationBias: {
                circle: {
                  center: { latitude: region.latitude, longitude: region.longitude },
                  radius: 50000.0,
                },
              },
            }),
          }
        );
        const data = await response.json();
        setPredictions(data.suggestions || []);
        setShowPredictions(true);
      } catch (e) {
        console.error("Predictions error", e);
      }
    };
    const timer = setTimeout(fetchPredictions, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      fetchProperties(locationCoords?.lat, locationCoords?.lng, radius);
    }, [locationCoords, radius])
  );

  const toggleFavorite = async (propertyId: string) => {
    let updated = [...favorites];
    if (updated.includes(propertyId)) updated = updated.filter(id => id !== propertyId);
    else updated.push(propertyId);
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const selectPlace = async (prediction: any) => {
    const placeText = prediction.placePrediction?.text?.text || "";
    setSearchQuery(placeText);
    setShowPredictions(false);
    try {
      const placeId = prediction.placePrediction?.placeId;
      const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${GOOGLE_PLACES_API_KEY}`);
      const data = await response.json();
      if (data.location) {
        const newCoords = { lat: parseFloat(data.location.latitude), lng: parseFloat(data.location.longitude) };
        setLocationCoords(newCoords);
        setRegion(prev => ({
          ...prev,
          latitude: newCoords.lat,
          longitude: newCoords.lng,
        }));
        fetchProperties(newCoords.lat, newCoords.lng, radius);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handleSliderPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const sliderWidth = width - SPACING.l * 2;
    const percent = locationX / sliderWidth;
    if (percent < 0.33) setRadius(1.5);
    else if (percent < 0.66) setRadius(3.0);
    else setRadius(5.0);
  };

  const getKnobPosition = () => {
    if (radius === 1.5) return '10%';
    if (radius === 3.0) return '47%';
    return '84%';
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 6 }}>
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search location..."
            placeholderTextColor={COLORS.textSecondary}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => router.push('/dashboard/rental-preferences')}
          >
            <Ionicons name="options-outline" size={16} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {showPredictions && predictions.length > 0 && (
          <View style={styles.predictionsContainer}>
            {predictions.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.predictionItem} onPress={() => selectPlace(item)}>
                <Ionicons name="location-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.predictionMain} numberOfLines={1}>{item.placePrediction?.structuredFormat?.mainText?.text}</Text>
                  <Text style={styles.predictionSub} numberOfLines={1}>{item.placePrediction?.structuredFormat?.secondaryText?.text}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.mapLayer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          region={region}
          onRegionChangeComplete={onRegionChangeComplete}
        >
          {locationCoords && (
            <Circle
              center={{
                latitude: parseFloat(locationCoords.lat as any) || region.latitude,
                longitude: parseFloat(locationCoords.lng as any) || region.longitude
              }}
              radius={radius * 1000}
              fillColor="rgba(96, 165, 250, 0.2)"
              strokeColor="rgba(96, 165, 250, 0.5)"
            />
          )}

          {properties.map((prop) => {
            const lat = parseFloat(prop.latitude || prop.lat);
            const lng = parseFloat(prop.longitude || prop.lng);
            if (isNaN(lat) || isNaN(lng)) return null;
            return (
              <Marker
                key={prop.id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={prop.title}
                description={prop.address}
              >
                <View style={styles.mapPin}>
                  <Ionicons name="home" size={16} color={COLORS.white} />
                </View>
              </Marker>
            );
          })}
        </MapView>

        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom('in')}>
            <Ionicons name="add" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom('out')}>
            <Ionicons name="remove" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.compactControls}>
          <View style={styles.radiusSliderSection}>
            <View style={styles.sliderHeader}>
              <Ionicons name="radio-button-on" size={16} color={COLORS.primary} />
              <Text style={styles.compactLabel}>Alert Radius</Text>
              <Text style={styles.radiusValue}>{radius} km</Text>
            </View>
            <TouchableOpacity style={styles.sliderTrack} onPress={handleSliderPress} activeOpacity={1}>
              <View style={styles.sliderFill} />
              <View style={[styles.sliderKnob, { left: getKnobPosition() }]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listCount}>
            {loading ? 'Finding matching homes...' : `${properties.length} homes near you`}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={true} contentContainerStyle={{ flexGrow: 1 }}>
          {loading && properties.length === 0 && (
            <View style={{ paddingTop: 40 }}><ActivityIndicator color={COLORS.primary} size="large" /></View>
          )}
          {properties.length > 0 ? (
            properties.map((prop) => (
              <TouchableOpacity key={prop.id} onPress={() => router.push({ pathname: '/property/[id]', params: { id: prop.id } })}>
                <View style={styles.propertyCard}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: prop.image.uri }} style={styles.cardImage} />
                    <TouchableOpacity style={styles.likeButton} onPress={(e) => { e.stopPropagation(); toggleFavorite(prop.id); }}>
                      <Ionicons name={favorites.includes(prop.id) ? 'heart' : 'heart-outline'} size={20} color={favorites.includes(prop.id) ? '#EF4444' : COLORS.textPrimary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardPrice}>${prop.price || prop.rent_price}<Text style={styles.cardPeriod}> /mo</Text></Text>
                    <Text style={styles.cardDetails}>{prop.property_type || prop.type} • {prop.bedrooms || prop.bhk} Bed</Text>
                    <Text style={styles.cardAddress}>{prop.address}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.matchScore}>{prop.match}</Text>
                      <Text style={styles.petBadge}>{prop.status}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            !loading && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>No results found</Text>
                <Text style={styles.emptyStateSub}>No homes match your criteria in this area.</Text>
              </View>
            )
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/dashboard/saved-properties')}>
          <Ionicons name="heart" size={24} color={COLORS.primary} />
          <Text style={styles.navLabel}>Favorites</Text>
          {favorites.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{favorites.length}</Text></View>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/dashboard/profile-tenant')}>
          <Ionicons name="person" size={24} color={COLORS.textSecondary} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  searchContainer: { position: 'absolute', top: 60, left: 16, right: 16, zIndex: 30 },
  searchBar: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 10, borderRadius: 14, alignItems: 'center', ...LAYOUT.shadow },
  searchInput: { flex: 1, marginLeft: 6, fontWeight: '600', fontSize: 13, color: COLORS.textPrimary },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '15', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 4, marginLeft: 4 },
  filterButtonText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  predictionsContainer: { backgroundColor: COLORS.white, marginTop: 5, borderRadius: 12, padding: 8, maxHeight: 250, ...LAYOUT.shadow },
  predictionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  predictionMain: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  predictionSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  mapLayer: { height: '50%', width: '100%' },
  mapPin: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  zoomControls: { position: 'absolute', right: 16, top: '40%', backgroundColor: COLORS.white, borderRadius: 8, ...LAYOUT.shadow, zIndex: 40 },
  zoomBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  zoomDivider: { height: 1, backgroundColor: '#F1F5F9', width: '80%', alignSelf: 'center' },
  bottomSheet: { flex: 1, backgroundColor: '#F8FAFC', marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, zIndex: 20, ...LAYOUT.shadow },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginVertical: 10 },
  compactControls: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 12, ...LAYOUT.shadow },
  compactLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  radiusSliderSection: { marginTop: 4 },
  sliderHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  radiusValue: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginLeft: 'auto' },
  sliderTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, position: 'relative' },
  sliderFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3, width: '50%' },
  sliderKnob: { position: 'absolute', top: -5, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.primary, borderWidth: 3, borderColor: COLORS.white, ...LAYOUT.shadow },
  listHeader: { paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  listCount: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  propertyCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, marginHorizontal: 16, marginBottom: 16, overflow: 'hidden', ...LAYOUT.shadow },
  imageWrapper: { width: 120, height: 120, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  likeButton: { position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', alignItems: 'center', ...LAYOUT.shadow },
  cardContent: { flex: 1, padding: 12 },
  cardPrice: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  cardPeriod: { fontSize: 12, fontWeight: '400', color: COLORS.textSecondary },
  cardDetails: { fontSize: 12, color: COLORS.textSecondary, marginVertical: 4 },
  cardAddress: { fontSize: 11, color: '#64748B' },
  cardFooter: { flexDirection: 'row', gap: 10, marginTop: 10 },
  matchScore: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  petBadge: { fontSize: 11, color: '#059669', fontWeight: '600' },
  bottomNav: { flexDirection: 'row', backgroundColor: COLORS.white, paddingVertical: 12, paddingBottom: 24, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E2E8F0', ...LAYOUT.shadow },
  navButton: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, marginTop: 4, color: COLORS.textSecondary, fontWeight: '600' },
  badge: { position: 'absolute', top: -5, right: -10, backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 5, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  emptyState: { paddingTop: 60, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyStateTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 16 },
  emptyStateSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
});
