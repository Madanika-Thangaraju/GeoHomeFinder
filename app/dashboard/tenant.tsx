import { tenantProperties } from '@/src/services/service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

export default function TenantDashboard() {
  const router = useRouter();

  // ✅ API-driven state
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [radius, setRadius] = useState(1.5);
  const [searchMode, setSearchMode] = useState<'pin' | 'radius' | 'draw'>('pin');

  // ✅ Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await tenantProperties();
        setProperties(data);
      } catch (error) {
        console.error('Failed to load properties', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading properties...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
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

        <View style={styles.listHeader}>
          <Text style={styles.listCount}>
            {properties.length} homes near you
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
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
                <Image
                  source={{ uri: prop.image.uri }}
                  style={styles.cardImage}
                />

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
          <View style={{ height: 100 }} />
        </ScrollView>
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
  searchContainer: { position: 'absolute', top: 60, left: 16, right: 16, zIndex: 10 },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    ...LAYOUT.shadow,
  },
  searchPlaceholder: { flex: 1, marginLeft: 8, fontWeight: '600' },
  filterRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 8 },
  filterPill: { padding: 8, backgroundColor: COLORS.white, borderRadius: 20 },
  activePill: { backgroundColor: COLORS.primary },
  pillText: { fontSize: 12 },
  activePillText: { color: COLORS.white },

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
  cardImage: { width: 120, height: 120 },
  cardContent: { flex: 1, padding: 12 },
  cardPrice: { fontSize: 16, fontWeight: 'bold' },
  cardPeriod: { fontSize: 10 },
  cardDetails: { fontSize: 12, marginVertical: 4 },
  cardAddress: { fontSize: 10, color: COLORS.textSecondary },
  cardFooter: { flexDirection: 'row', gap: 8, marginTop: 6 },
  matchScore: { fontSize: 10, color: COLORS.primary },
  petBadge: { fontSize: 10, color: COLORS.textSecondary },
});
