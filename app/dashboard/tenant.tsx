import { getProfile, tenantProperties } from '@/src/services/service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

const GOOGLE_PLACES_API_KEY = "AIzaSyDw84Qp9YXjxqy2m6ECrC-Qa4_yiTyiQ6s";

interface PlacePrediction {
  placeId: string;
  text: {
    text: string;
  };
  structuredFormat: {
    mainText: {
      text: string;
    };
    secondaryText: {
      text: string;
    };
  };
}

export default function TenantDashboard() {
  const router = useRouter();

  // ✅ API-driven state
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [radius, setRadius] = useState(1.5);
  const [searchMode, setSearchMode] = useState<'pin' | 'radius' | 'draw'>('pin');

  // ✅ Favorites and search state
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

  // ✅ Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load favorites', error);
      }
    };
    loadFavorites();
  }, []);

  // ✅ Fetch properties from API and ensure high-quality images
  const fetchProperties = async (lat?: number, lng?: number, rad?: number) => {
    const HOUSE_IMAGES = [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
    ];

    try {
      setLoading(true);
      const data = await tenantProperties(lat, lng, rad);
      // Limit to 6 properties and inject high-quality house images
      const enrichedData = (data || []).slice(0, 6).map((prop: any, index: number) => ({
        ...prop,
        image: { uri: HOUSE_IMAGES[index % HOUSE_IMAGES.length] },
        status: 'Available', // Ensuring all are available as requested
        isSoldOut: false,
      }));
      setProperties(enrichedData);
    } catch (error) {
      console.error('Failed to load properties', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await getProfile();
      setUserProfile(profile);
      if (profile.latitude && profile.longitude && !locationCoords) {
        setLocationCoords({ lat: profile.latitude, lng: profile.longitude });
      }
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchProperties(locationCoords?.lat, locationCoords?.lng, radius);
  }, [locationCoords, radius]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        searchPlaces(searchQuery);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchPlaces = async (input: string) => {
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
            input: input,
            locationBias: {
              circle: {
                center: {
                  latitude: 11.0168,
                  longitude: 76.9558,
                },
                radius: 50000.0,
              },
            },
          }),
        }
      );
      const data = await response.json();
      console.log("Tenant: Autocomplete API (New) Response:", data);

      if (data.suggestions) {
        // Map New API suggestions to our internal Prediction format
        const formattedPredictions = data.suggestions.map((s: any) => s.placePrediction);
        setPredictions(formattedPredictions);
        setShowPredictions(true);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const selectPlace = async (prediction: PlacePrediction) => {
    setSearchQuery(prediction.text.text);
    setShowPredictions(false);
    setPredictions([]);

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${prediction.placeId}?fields=location&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      console.log("Tenant: Place Details (New) Response:", data);

      if (data.location) {
        const coords = {
          lat: data.location.latitude,
          lng: data.location.longitude,
        };
        console.log("Tenant: Selected Location Coords:", coords);
        setLocationCoords(coords);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // ✅ Toggle favorite functionality
  const toggleFavorite = async (propertyId: string) => {
    try {
      let updatedFavorites: string[];
      if (favorites.includes(propertyId)) {
        // Remove from favorites
        updatedFavorites = favorites.filter(id => id !== propertyId);
      } else {
        // Add to favorites
        updatedFavorites = [...favorites, propertyId];
      }
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      // Also save the property details for the favorites page
      const favoritedProperties = properties.filter(p => updatedFavorites.includes(p.id));
      await AsyncStorage.setItem('favoritedProperties', JSON.stringify(favoritedProperties));
    } catch (error) {
      console.error('Failed to update favorites', error);
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

  const getCircleStyle = () => {
    let size = 250;
    if (radius === 1.5) size = 150;
    if (radius === 5.0) size = 400;

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      top: (Dimensions.get('window').height * 0.4) - size / 2,
      left: width / 2 - size / 2,
    };
  };

  if (loading && properties.length === 0) {
    return (
      <View style={styles.loading}>
        <Text>Loading properties...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.usernameText}>{userProfile?.name || 'Tenant'}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color={COLORS.primary} />
            <Text style={styles.locationText}>{userProfile?.location || 'Coimbatore, IN'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => router.push('/dashboard/profile-tenant')}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Search Header */}
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
          <TouchableOpacity onPress={() => router.push('/dashboard/rental-preferences')}>
            <Ionicons name="filter" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Predictions List */}
        {showPredictions && predictions.length > 0 && (
          <View style={styles.predictionsContainer}>
            {predictions.map((item) => (
              <TouchableOpacity
                key={item.placeId}
                style={styles.predictionItem}
                onPress={() => selectPlace(item)}
              >
                <Ionicons name="location-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.predictionMain} numberOfLines={1}>
                    {item.structuredFormat.mainText.text}
                  </Text>
                  <Text style={styles.predictionSub} numberOfLines={1}>
                    {item.structuredFormat.secondaryText.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.filterRow}>
          {['pin', 'radius', 'draw'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.filterPill,
                searchMode === mode && styles.activePill,
              ]}
              onPress={() => setSearchMode(mode as any)}
            >
              <Text
                style={[
                  styles.pillText,
                  searchMode === mode && styles.activePillText,
                ]}
              >
                {mode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapLayer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b',
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.radiusCircle, getCircleStyle()]} />
        <View style={styles.mapPin}>
          <Ionicons name="home" size={16} color={COLORS.white} />
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        {/* Compact Controls Section */}
        <View style={styles.compactControls}>
          {/* Push Alerts Toggle */}
          <View style={styles.compactToggle}>
            <View style={styles.toggleLeft}>
              <Ionicons name="notifications" size={16} color={COLORS.primary} />
              <Text style={styles.compactLabel}>Push Alerts</Text>
            </View>
            <Switch
              value={alertsEnabled}
              onValueChange={setAlertsEnabled}
              trackColor={{ false: '#D1D5DB', true: COLORS.primary }}
              thumbColor={alertsEnabled ? COLORS.white : '#F3F4F6'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>

          {/* Alert Radius Slider */}
          <View style={styles.radiusSliderSection}>
            <View style={styles.sliderHeader}>
              <Ionicons name="radio-button-on" size={16} color={COLORS.primary} />
              <Text style={styles.compactLabel}>Alert Radius</Text>
              <Text style={styles.radiusValue}>{radius} km</Text>
            </View>
            <TouchableOpacity
              style={styles.sliderTrack}
              onPress={handleSliderPress}
              activeOpacity={1}
            >
              <View style={styles.sliderFill} />
              <View style={[styles.sliderKnob, { left: getKnobPosition() }]} />
            </TouchableOpacity>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>1.5 km</Text>
              <Text style={styles.sliderLabelText}>3.0 km</Text>
              <Text style={styles.sliderLabelText}>5.0 km</Text>
            </View>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listCount}>
            {properties.length} homes near you
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          decelerationRate="fast"
          scrollEventThrottle={16}
        >
          {properties.map((prop) => (
            <TouchableOpacity
              key={prop.id}
              onPress={() =>
                router.push({
                  pathname: '/property/[id]',
                  params: { id: prop.id },
                })
              }
            >
              <View style={styles.propertyCard}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: prop.image.uri }}
                    style={styles.cardImage}
                  />

                  {/* Like Button */}
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prop.id);
                    }}
                  >
                    <Ionicons
                      name={favorites.includes(prop.id) ? 'heart' : 'heart-outline'}
                      size={20}
                      color={favorites.includes(prop.id) ? '#EF4444' : COLORS.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardPrice}>
                    {prop.price}
                    <Text style={styles.cardPeriod}> /mo</Text>
                  </Text>

                  <Text style={styles.cardDetails}>
                    {prop.type} • {prop.bedrooms} Bed • {prop.bathrooms} Bath
                  </Text>

                  <Text style={styles.cardAddress}>{prop.address}</Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.matchScore}>{prop.match}</Text>
                    <Text style={styles.petBadge}>{prop.status}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/dashboard/saved-properties')}
        >
          <Ionicons name="heart" size={24} color={COLORS.primary} />
          <Text style={styles.navLabel}>Favorites</Text>
          {favorites.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/dashboard/profile-tenant')}
        >
          <Ionicons name="person" size={24} color={COLORS.textSecondary} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  // Header Styles
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: '#64748B', // slate-500
    fontWeight: '600',
  },
  usernameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  profileImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
    ...LAYOUT.shadow,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },

  searchContainer: { position: 'absolute', top: 130, left: 16, right: 16, zIndex: 10 },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    ...LAYOUT.shadow,
  },
  searchInput: { flex: 1, marginLeft: 6, fontWeight: '600', fontSize: 13, color: COLORS.textPrimary },
  filterRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 6 },
  filterPill: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLORS.white, borderRadius: 18 },
  activePill: { backgroundColor: COLORS.primary },
  pillText: { fontSize: 11, fontWeight: '500' },
  activePillText: { color: COLORS.white },

  predictionsContainer: {
    backgroundColor: COLORS.white,
    marginTop: 5,
    borderRadius: 12,
    padding: 8,
    maxHeight: 250,
    ...LAYOUT.shadow,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  predictionMain: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  predictionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Compact Controls in Bottom Sheet
  compactControls: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 10,
    ...LAYOUT.shadow,
  },
  compactToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  compactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  radiusSliderSection: {
    marginTop: 2,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  radiusValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 'auto',
  },
  sliderTrack: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2.5,
    position: 'relative',
    marginVertical: 6,
  },
  sliderFill: {
    height: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 2.5,
    width: '50%',
  },
  sliderKnob: {
    position: 'absolute',
    top: -4,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
    ...LAYOUT.shadow,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sliderLabelText: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },

  mapLayer: { height: '50%' },
  radiusCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(37,99,235,0.4)',
    backgroundColor: 'rgba(37,99,235,0.1)',
  },
  mapPin: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -16,
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomSheet: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },
  listHeader: { paddingHorizontal: 16, marginBottom: 8 },
  listCount: { fontSize: 12, color: COLORS.textSecondary },

  propertyCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  cardImage: { width: 120, height: 120 },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...LAYOUT.shadow,
  },
  cardContent: { flex: 1, padding: 12 },
  cardPrice: { fontSize: 16, fontWeight: 'bold' },
  cardPeriod: { fontSize: 10 },
  cardDetails: { fontSize: 12, marginVertical: 4 },
  cardAddress: { fontSize: 10, color: COLORS.textSecondary },
  cardFooter: { flexDirection: 'row', gap: 8, marginTop: 6 },
  matchScore: { fontSize: 10, color: COLORS.primary },
  petBadge: { fontSize: 10, color: COLORS.textSecondary },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 32,
    paddingBottom: 20,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...LAYOUT.shadow,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navLabel: {
    fontSize: 11,
    marginTop: 4,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
