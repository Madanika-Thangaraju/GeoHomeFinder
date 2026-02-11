import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, LAYOUT } from '../../src/constants/theme';
import { BlurView } from 'expo-blur';
import { getOwnerProperties, getProfile, getTourRequestsApi, getStagnantPropertiesApi, getVisitedPropertiesApi } from '../../src/services/service';
import { decodeToken, getToken, getUser } from '../../src/utils/auth';
import { useAuth } from '../../src/context/AuthContext';

const GlassCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
    <BlurView intensity={40} tint="light" style={[styles.glassCard, style]}>
        {children}
    </BlurView>
);

export default function OwnerStatsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        listings: 0,
        total: 0,
        visits: 0,
        stagnant: 0,
        sold: 0,
        pending: 0,
        favorited: 0,
        views: 0,
        conversionRate: '0.0'
    });
    const [stagnantProperties, setStagnantProperties] = useState<any[]>([]);
    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [visitedProperties, setVisitedProperties] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let userId;
                // Use user from context if available (but prefer stored id if available)
                const storedUser = await getUser();
                if (storedUser && storedUser.id) {
                    userId = storedUser.id;
                } else if (!userId) {
                    const token = await getToken();
                    if (token) {
                        const decoded = decodeToken(token);
                        if (decoded && (decoded.id || decoded.sub)) userId = decoded.id || decoded.sub;
                    }
                }

                if (userId) {
                    const [profile, tours, stagnant, allProps, visited] = await Promise.all([
                        getProfile(),
                        getTourRequestsApi('owner'),
                        getStagnantPropertiesApi(),
                        getOwnerProperties(userId),
                        getVisitedPropertiesApi()
                    ]);

                    setStagnantProperties(stagnant || []);
                    setAllProperties(allProps || []);
                    setVisitedProperties(visited || []);

                    let visitsCount = 0;
                    if (tours.success && Array.isArray(tours.data)) {
                        visitsCount = tours.data.length;
                    }

                    const totalProperties = profile?.total_listings || (Array.isArray(allProps) ? allProps.length : 0);
                    const soldCount = profile?.sold_count || 0;
                    const conversionRate = totalProperties > 0
                        ? ((soldCount / totalProperties) * 100).toFixed(1)
                        : '0.0';

                    setStats({
                        listings: profile?.listings || 0,
                        total: totalProperties,
                        visits: visitsCount,
                        sold: soldCount,
                        pending: profile?.pending_count || 0,
                        favorited: profile?.saved_count || 0,
                        views: profile?.views || 0,
                        stagnant: profile?.stagnant_count || 0,
                        conversionRate: conversionRate
                    });
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F0F9FF', '#E0F2FE', '#F0F9FF']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Performance Analytics</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Animated.View entering={FadeInDown.delay(100)} style={styles.highlightSection}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.highlightCard}>
                        <LinearGradient
                            colors={['#2563EB', '#3B82F6', '#60A5FA']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.highlightGradient}
                        >
                            <View>
                                <Text style={styles.highlightLabel}>Total Performance Index</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                                    <Text style={styles.highlightValue}>{stats.views}</Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>views</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.grid}>
                    <GlassCard style={styles.statCard}>
                        <View style={[styles.iconBg, { backgroundColor: 'rgba(37,99,235,0.15)' }]}>
                            <Ionicons name="home" size={24} color="#2563EB" />
                        </View>
                        <Text style={styles.statValue}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Registered Homes</Text>
                    </GlassCard>

                    <GlassCard style={styles.statCard}>
                        <View style={[styles.iconBg, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
                            <Ionicons name="people" size={24} color="#3B82F6" />
                        </View>
                        <Text style={styles.statValue}>{stats.visits}</Text>
                        <Text style={styles.statLabel}>Tenant Views</Text>
                    </GlassCard>

                    <GlassCard style={styles.statCard}>
                        <View style={[styles.iconBg, { backgroundColor: 'rgba(34,197,94,0.2)' }]}>
                            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                        </View>
                        <Text style={styles.statValue}>{stats.sold}</Text>
                        <Text style={styles.statLabel}>Sold</Text>
                    </GlassCard>

                    <GlassCard style={styles.statCard}>
                        <View style={[styles.iconBg, { backgroundColor: 'rgba(234,179,8,0.2)' }]}>
                            <Ionicons name="time" size={24} color="#EAB308" />
                        </View>
                        <Text style={styles.statValue}>{stats.pending}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </GlassCard>

                    <GlassCard style={styles.statCard}>
                        <View style={[styles.iconBg, { backgroundColor: 'rgba(239,68,68,0.2)' }]}>
                            <Ionicons name="alert-circle" size={24} color="#EF4444" />
                        </View>
                        <Text style={styles.statValue}>{stats.stagnant}</Text>
                        <Text style={styles.statLabel}>Long Time Not Visited</Text>
                    </GlassCard>

                    <GlassCard style={styles.statCard}>
                        <View style={[styles.iconBg, { backgroundColor: 'rgba(37,99,235,0.15)' }]}>
                            <Ionicons name="analytics" size={24} color="#2563EB" />
                        </View>
                        <Text style={styles.statValue}>{stats.conversionRate || '0.0'}%</Text>
                        <Text style={styles.statLabel}>Conversion Rate</Text>
                    </GlassCard>
                </Animated.View>

                {/* Stagnant Properties Section */}
                {stagnantProperties.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(300)} style={{ marginTop: 24, paddingHorizontal: 4 }}>
                        <Text style={styles.sectionTitle}>
                            Properties Needing Attention
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                            {stagnantProperties.map((item, index) => (
                                <TouchableOpacity key={item.id} onPress={() => router.push(`/property/${item.id}`)} activeOpacity={0.8}>
                                    <GlassCard style={styles.propertyCard}>
                                        <View style={styles.imageContainer}>
                                            {item.images && item.images.length > 0 ? (
                                                <Image
                                                    source={{ uri: item.images[0].image_url }}
                                                    style={styles.cardImage}
                                                    contentFit="cover"
                                                />
                                            ) : (
                                                <View style={styles.placeholderImage}>
                                                    <Ionicons name="image-outline" size={32} color="#cbd5e1" />
                                                </View>
                                            )}
                                            <View style={[styles.cardBadge, { backgroundColor: 'rgba(239,68,68,0.9)' }]}>
                                                <Text style={styles.badgeTextSmall}>STAGNANT</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                                            <Text numberOfLines={1} style={styles.cardLocation}>{item.location}</Text>
                                            <Text style={styles.cardPrice}>₹{item.price}</Text>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                {/* High Interest (Visited) Properties Section */}
                {visitedProperties.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: 24, paddingHorizontal: 4 }}>
                        <Text style={styles.sectionTitle}>
                            High Interest Properties
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                            {visitedProperties.map((item, index) => (
                                <TouchableOpacity key={item.id} onPress={() => router.push(`/property/${item.id}`)} activeOpacity={0.8}>
                                    <GlassCard style={styles.propertyCard}>
                                        <View style={styles.imageContainer}>
                                            {item.images && item.images.length > 0 ? (
                                                <Image
                                                    source={{ uri: item.images[0].image_url }}
                                                    style={styles.cardImage}
                                                    contentFit="cover"
                                                />
                                            ) : (
                                                <View style={styles.placeholderImage}>
                                                    <Ionicons name="image-outline" size={32} color="#cbd5e1" />
                                                </View>
                                            )}
                                            <View style={[styles.cardBadge, { backgroundColor: 'rgba(56,189,248,0.9)' }]}>
                                                <Text style={styles.badgeTextSmall}>VISITED</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                                            <Text numberOfLines={1} style={styles.cardLocation}>{item.location}</Text>
                                            <Text style={styles.cardPrice}>₹{item.price}</Text>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                {/* Active Listings Section */}
                {Array.isArray(allProperties) && allProperties.filter(p => p.status === 'active').length > 0 && (
                    <Animated.View entering={FadeInDown.delay(500)} style={{ marginTop: 24, paddingHorizontal: 4 }}>
                        <Text style={styles.sectionTitle}>
                            Active Listings
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                            {allProperties.filter(p => p.status === 'active').map((item) => (
                                <TouchableOpacity key={item.id} onPress={() => router.push(`/property/${item.id}`)} activeOpacity={0.8}>
                                    <GlassCard style={styles.propertyCard}>
                                        <View style={styles.imageContainer}>
                                            {item.images && item.images.length > 0 ? (
                                                <Image
                                                    source={{ uri: item.images[0].image_url }}
                                                    style={styles.cardImage}
                                                    contentFit="cover"
                                                />
                                            ) : (
                                                <View style={styles.placeholderImage}>
                                                    <Ionicons name="image-outline" size={32} color="#cbd5e1" />
                                                </View>
                                            )}
                                            <View style={[styles.cardBadge, { backgroundColor: 'rgba(37,99,235,0.9)' }]}>
                                                <Text style={styles.badgeTextSmall}>ACTIVE</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                                            <Text numberOfLines={1} style={styles.cardLocation}>{item.location}</Text>
                                            <Text style={styles.cardPrice}>₹{item.price}</Text>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                {/* Pending Properties Section */}
                {Array.isArray(allProperties) && allProperties.filter(p => p.status === 'pending').length > 0 && (
                    <Animated.View entering={FadeInDown.delay(600)} style={{ marginTop: 24, paddingHorizontal: 4 }}>
                        <Text style={styles.sectionTitle}>
                            Pending Deals
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                            {allProperties.filter(p => p.status === 'pending').map((item) => (
                                <TouchableOpacity key={item.id} onPress={() => router.push(`/property/${item.id}`)} activeOpacity={0.8}>
                                    <GlassCard style={styles.propertyCard}>
                                        <View style={styles.imageContainer}>
                                            {item.images && item.images.length > 0 ? (
                                                <Image
                                                    source={{ uri: item.images[0].image_url }}
                                                    style={styles.cardImage}
                                                    contentFit="cover"
                                                />
                                            ) : (
                                                <View style={styles.placeholderImage}>
                                                    <Ionicons name="image-outline" size={32} color="#cbd5e1" />
                                                </View>
                                            )}
                                            <View style={[styles.cardBadge, { backgroundColor: 'rgba(234,179,8,0.9)' }]}>
                                                <Text style={styles.badgeTextSmall}>PENDING</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                                            <Text numberOfLines={1} style={styles.cardLocation}>{item.location}</Text>
                                            <Text style={styles.cardPrice}>₹{item.price}</Text>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                {/* Sold Properties Section */}
                {Array.isArray(allProperties) && allProperties.filter(p => p.status === 'sold').length > 0 && (
                    <Animated.View entering={FadeInDown.delay(700)} style={{ marginTop: 24, paddingHorizontal: 4 }}>
                        <Text style={styles.sectionTitle}>
                            Recently Sold
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                            {allProperties.filter(p => p.status === 'sold').map((item) => (
                                <TouchableOpacity key={item.id} onPress={() => router.push(`/property/${item.id}`)} activeOpacity={0.8}>
                                    <GlassCard style={styles.propertyCard}>
                                        <View style={styles.imageContainer}>
                                            {item.images && item.images.length > 0 ? (
                                                <Image
                                                    source={{ uri: item.images[0].image_url }}
                                                    style={styles.cardImage}
                                                    contentFit="cover"
                                                />
                                            ) : (
                                                <View style={styles.placeholderImage}>
                                                    <Ionicons name="image-outline" size={32} color="#cbd5e1" />
                                                </View>
                                            )}
                                            <View style={[styles.cardBadge, { backgroundColor: 'rgba(34,197,94,0.9)' }]}>
                                                <Text style={styles.badgeTextSmall}>SOLD</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                                            <Text numberOfLines={1} style={styles.cardLocation}>{item.location}</Text>
                                            <Text style={styles.cardPrice}>₹{item.price}</Text>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                {/* All Properties Section */}
                {Array.isArray(allProperties) && allProperties.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(800)} style={{ marginTop: 24, paddingHorizontal: 4 }}>
                        <Text style={styles.sectionTitle}>
                            All Properties ({allProperties.length})
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                            {allProperties.map((item) => (
                                <TouchableOpacity key={item.id} onPress={() => router.push(`/property/${item.id}`)} activeOpacity={0.8}>
                                    <GlassCard style={styles.propertyCard}>
                                        <View style={styles.imageContainer}>
                                            {item.images && item.images.length > 0 ? (
                                                <Image
                                                    source={{ uri: item.images[0].image_url }}
                                                    style={styles.cardImage}
                                                    contentFit="cover"
                                                />
                                            ) : (
                                                <View style={styles.placeholderImage}>
                                                    <Ionicons name="image-outline" size={32} color="#cbd5e1" />
                                                </View>
                                            )}
                                            <View style={[styles.cardBadge, {
                                                backgroundColor: item.status === 'active' ? 'rgba(37,99,235,0.9)' :
                                                    item.status === 'sold' ? 'rgba(34,197,94,0.9)' :
                                                        item.status === 'pending' ? 'rgba(234,179,8,0.9)' :
                                                            'rgba(100,116,139,0.9)'
                                            }]}>
                                                <Text style={styles.badgeTextSmall}>{(item.status || 'UNKNOWN').toUpperCase()}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                                            <Text numberOfLines={1} style={styles.cardLocation}>{item.location}</Text>
                                            <Text style={styles.cardPrice}>₹{item.price}</Text>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingTop: 60,
        paddingBottom: SPACING.m,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        ...LAYOUT.shadow,
    },
    content: {
        padding: SPACING.l,
    },
    highlightSection: {
        marginBottom: SPACING.xl,
    },
    highlightCard: {
        width: '100%',
        height: 120,
        borderRadius: 24,
        overflow: 'hidden',
        ...LAYOUT.shadow,
    },
    highlightGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
    },
    highlightLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    highlightValue: {
        color: COLORS.white,
        fontSize: 42,
        fontWeight: '800',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.m,
        justifyContent: 'space-between',
    },
    glassCard: {
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        overflow: 'hidden',
    },
    statCard: {
        width: '47%',
        padding: SPACING.l,
        alignItems: 'center',
        marginBottom: SPACING.s,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    iconBg: {
        width: 52,
        height: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        ...LAYOUT.shadow,
    },
    statValue: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    propertyCard: {
        width: 220,
        padding: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    imageContainer: {
        height: 140,
        width: '100%',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    badgeTextSmall: {
        color: 'white',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    cardInfo: {
        padding: 14,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    cardLocation: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.primary,
    },
});
