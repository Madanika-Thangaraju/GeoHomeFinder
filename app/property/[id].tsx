import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT } from '../../src/constants/theme';
import { PROPERTIES } from '../../src/data/properties';

const { width, height } = Dimensions.get('window');

export default function PropertyDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const property = PROPERTIES.find(p => p.id === Number(id)) || PROPERTIES[0];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Scrollable Content */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* HERO SECTION */}
                <View style={styles.heroContainer}>
                    <Image source={property.image} style={styles.heroImage} resizeMode="cover" />

                    {/* Gradient Overlay for Text Readability */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFillObject}
                    />

                    {/* Header Actions */}
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={styles.rightIcons}>
                            <TouchableOpacity style={styles.circleBtn}>
                                <Ionicons name="share-social-outline" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.circleBtn}>
                                <Ionicons name="heart-outline" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Centered Video Tour Button */}
                    <View style={styles.videoTourContainer}>
                        <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                            <Ionicons name="play" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <Text style={styles.videoText}>VIDEO TOUR</Text>
                    </View>

                    {/* Bottom Hero Info */}
                    <View style={styles.heroContent}>
                        <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.matchBadge}
                        >
                            <Ionicons name="sparkles" size={12} color={COLORS.white} />
                            <Text style={styles.matchText}>{property.match}</Text>
                        </LinearGradient>

                        <Text style={styles.propertyTitle}>{property.title}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={16} color={COLORS.white} />
                            <Text style={styles.locationText}>{property.address}</Text>
                        </View>
                    </View>
                </View>

                {/* MAIN CONTENT CARD */}
                <View style={styles.detailsCard}>
                    {/* Drag Handle */}
                    <View style={styles.dragHandle} />

                    <View style={styles.priceSection}>
                        <View>
                            <Text style={styles.priceLabel}>MONTHLY RENT</Text>
                            <Text style={styles.priceValue}>{property.price}</Text>
                        </View>
                        <TouchableOpacity style={styles.breakdownBtn}>
                            <Text style={styles.breakdownText}>View Breakdown</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Property Highlights */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Property Highlights</Text>
                            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
                        </View>
                        <Text style={styles.sectionSubtitle}>Key features & amenities</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightScroll}>
                            <View style={styles.highlightCard}>
                                <View style={styles.highlightIconBg}>
                                    <Ionicons name="bed" size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.highlightValue}>{property.bedrooms}</Text>
                                <Text style={styles.highlightLabel}>BEDROOMS</Text>
                            </View>

                            <View style={styles.highlightCard}>
                                <View style={styles.highlightIconBg}>
                                    <Ionicons name="water" size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.highlightValue}>{property.bathrooms}</Text>
                                <Text style={styles.highlightLabel}>BATHROOMS</Text>
                            </View>

                            <View style={styles.highlightCard}>
                                <View style={styles.highlightIconBg}>
                                    <Ionicons name="resize" size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.highlightValue} numberOfLines={1}>{property.size}</Text>
                                <Text style={styles.highlightLabel}>AREA/TYPE</Text>
                            </View>
                        </ScrollView>
                    </View>

                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About this home</Text>
                        <Text style={styles.descriptionText} numberOfLines={4}>
                            {property.description}
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.readMore}>Read more</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Location Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <View style={styles.mapCard}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80' }}
                                style={styles.mapImage}
                            />
                            <View style={styles.mapOverlay}>
                                <View style={styles.mapPin}>
                                    <Ionicons name="location" size={20} color={COLORS.primary} />
                                </View>
                                <TouchableOpacity style={styles.exploreBtn}>
                                    <Text style={styles.exploreText}>Tap to explore</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Owner Section */}
                    <View style={styles.ownerCard}>
                        <View style={styles.ownerHeader}>
                            <Image source={property.owner.image} style={styles.ownerAvatar} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.ownerName}>{property.owner.name}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={10} color="#B45309" />
                                        <Text style={styles.ratingText}>{property.owner.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.ownerRole}>PROPERTY OWNER</Text>
                                <Text style={styles.reviewCount}>{property.owner.reviews} Reviews</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.chatOwnerBtn} onPress={() => router.push({ pathname: '/chat/[id]', params: { id } })}>
                            <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.white} />
                            <Text style={styles.chatOwnerText}>Chat with Owner</Text>
                        </TouchableOpacity>

                        <View style={styles.replyStatus}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Typically replies within {property.owner.responseTime}</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Sticky Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.requestTourBtn}>
                    <Text style={styles.requestTourText}>Request Tour</Text>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCircleBtn} onPress={() => router.push({ pathname: '/chat/[id]', params: { id } })}>
                    <Ionicons name="chatbubble" size={20} color={COLORS.white} />
                    <Text style={styles.actionLabel}>CHAT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionCircleBtn, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="call" size={20} color={COLORS.success} />
                    <Text style={[styles.actionLabel, { color: COLORS.success }]}>CALL</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    heroContainer: {
        height: height * 0.45,
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    headerBar: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    circleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)', // Note: backdropFilter not supported in pure RN, but keeping for intent
    },
    rightIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    videoTourContainer: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: [{ translateX: -40 }, { translateY: -40 }], // Approx center manually
        alignItems: 'center',
    },
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
        marginBottom: 8,
    },
    videoText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    heroContent: {
        position: 'absolute',
        bottom: 40, // More space for rounded card overlap
        left: 20,
        right: 20,
    },
    matchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 8,
        gap: 6,
    },
    matchText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    propertyTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    detailsCard: {
        marginTop: -30,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
        minHeight: 500,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    priceLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    breakdownBtn: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    breakdownText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    highlightScroll: {
        marginHorizontal: -24, // pull out to edge
        paddingHorizontal: 24, // push content back in
    },
    highlightCard: {
        width: 100,
        height: 120,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        borderRadius: 16,
        padding: 12,
        marginRight: 12,
        ...LAYOUT.shadow,
        shadowOpacity: 0.03,
        justifyContent: 'center',
    },
    highlightIconBg: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    highlightValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    highlightLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    descriptionText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: 8,
    },
    readMore: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    mapCard: {
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPin: {
        width: 48,
        height: 48,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        ...LAYOUT.shadow,
    },
    exploreBtn: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        ...LAYOUT.shadow,
    },
    exploreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    ownerCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...LAYOUT.shadow,
        shadowOpacity: 0.05,
    },
    ownerHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    ownerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E2E8F0',
    },
    ownerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#B45309',
    },
    ownerRole: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    reviewCount: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    chatOwnerBtn: {
        backgroundColor: '#6366F1',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        marginBottom: 16,
    },
    chatOwnerText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    replyStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
    },
    statusText: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    bottomActions: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        gap: 12,
        zIndex: 100,
    },
    requestTourBtn: {
        flex: 1,
        backgroundColor: '#0F172A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30, // Pill shape
        paddingVertical: 16,
        gap: 8,
        ...LAYOUT.shadow,
    },
    requestTourText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionCircleBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        ...LAYOUT.shadow,
    },
    actionLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 2,
    }
});
