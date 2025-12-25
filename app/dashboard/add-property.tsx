import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image as RNImage,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const PROPERTY_TYPES = [
    { id: 'house', label: 'Independent House', sub: 'Standalone property', icon: 'home' },
    { id: 'apartment', label: 'Apartment', sub: 'Flat in a building', icon: 'business' },
    { id: 'villa', label: 'Villa', sub: 'Premium gated', icon: 'business' },
    { id: 'plot', label: 'Plot / Land', sub: 'Open area', icon: 'map' },
];

const LISTING_TYPES = ['Sell', 'Rent', 'PG/Co-living'];

export default function AddPropertyScreen() {
    const router = useRouter();
    const [listingType, setListingType] = useState('Rent');
    const [propertyTitle, setPropertyTitle] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('house');
    const [address, setAddress] = useState('');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>List Property</Text>
                    <View style={styles.activeTabIndicator} />
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Title Section */}
                <View style={styles.mb_l}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <Text style={styles.sectionDesc}>Let's start with the essentials to define your property listing.</Text>
                </View>

                {/* Property Title */}
                <View style={styles.mb_l}>
                    <Text style={styles.label}>PROPERTY TITLE</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="e.g. 3BHK Apartment in Gandhipuram"
                        placeholderTextColor={COLORS.textSecondary}
                        value={propertyTitle}
                        onChangeText={setPropertyTitle}
                    />
                    <Text style={styles.helperText}>Give your property a catchy name to attract tenants.</Text>
                </View>

                {/* Listing Type */}
                <View style={styles.mb_l}>
                    <Text style={styles.label}>I WANT TO</Text>
                    <View style={styles.segmentContainer}>
                        {LISTING_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.segmentBtn,
                                    listingType === type && styles.segmentBtnActive
                                ]}
                                onPress={() => setListingType(type)}
                            >
                                <Text style={[
                                    styles.segmentText,
                                    listingType === type && styles.segmentTextActive
                                ]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Property Type */}
                <View style={styles.mb_l}>
                    <Text style={styles.label}>PROPERTY TYPE</Text>
                    <View style={styles.gridContainer}>
                        {PROPERTY_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.typeCard,
                                    selectedPropertyType === type.id && styles.typeCardActive
                                ]}
                                onPress={() => setSelectedPropertyType(type.id)}
                            >
                                {selectedPropertyType === type.id && (
                                    <View style={styles.checkIcon}>
                                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                                    </View>
                                )}
                                <Text style={styles.typeLabel}>{type.label}</Text>
                                <Text style={styles.typeSub}>{type.sub}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Address Section */}
                <View style={styles.mb_l}>
                    <Text style={styles.label}>PROPERTY ADDRESS</Text>

                    {/* Search Mock */}
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search location in Coimbatore..."
                            placeholderTextColor={COLORS.textSecondary}
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>

                    {/* Map Mock */}
                    <View style={styles.mapContainer}>
                        <RNImage
                            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80' }}
                            style={styles.mapPlaceholder}
                            resizeMode="cover"
                        />
                        <TouchableOpacity style={styles.pinBtn}>
                            <Ionicons name="location" size={16} color={COLORS.white} />
                            <Text style={styles.pinBtnText}>Pin exact location</Text>
                        </TouchableOpacity>
                        <View style={styles.mapInfo}>
                            <Ionicons name="information-circle" size={16} color={COLORS.primary} />
                            <Text style={styles.mapInfoText}>Pinning exact location helps tenants find your property 3x faster.</Text>
                        </View>
                    </View>
                </View>

                {/* Images Section */}
                <View style={styles.mb_l}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.label}>PROPERTY IMAGES</Text>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>3/10</Text>
                        </View>
                    </View>

                    <View style={styles.uploadArea}>
                        <View style={styles.uploadIconCircle}>
                            <Ionicons name="images" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.uploadText}>
                            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Click to upload</Text> or drag photos
                        </Text>
                        <Text style={styles.uploadSub}>SVG, PNG, JPG or GIF (max. 5MB)</Text>
                    </View>

                    {/* Thumbnails Mock */}
                    <View style={styles.thumbsRow}>
                        {[
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80',
                            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=200&q=80',
                            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=200&q=80'
                        ].map((uri, i) => (
                            <View key={i} style={styles.thumbBox}>
                                <RNImage source={{ uri }} style={{ width: '100%', height: '100%' }} />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.aiNote}>✨ Our AI will automatically tag and categorize your photos.</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.backFooterBtn} onPress={() => router.back()}>
                    <Text style={styles.backFooterText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveFooterBtn} onPress={() => router.back()}>
                    <Text style={styles.saveFooterText}>Save & Proceed</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: SPACING.s,
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    activeTabIndicator: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    scrollContent: {
        padding: SPACING.l,
    },

    /* Spacers */
    mb_l: { marginBottom: SPACING.l },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },

    /* Basic Info */
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },

    /* Inputs */
    label: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#64748B',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    textInput: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: LAYOUT.radius.m,
        padding: 14,
        fontSize: 14,
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    helperText: {
        fontSize: 11,
        color: '#94A3B8',
    },

    /* Segmented Control */
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        padding: 4,
        borderRadius: LAYOUT.radius.m,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: LAYOUT.radius.s,
    },
    segmentBtnActive: {
        backgroundColor: COLORS.white,
        ...LAYOUT.shadow,
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    segmentTextActive: {
        color: COLORS.textPrimary,
    },

    /* Property Type Grid */
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeCard: {
        width: '48%',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    typeCardActive: {
        backgroundColor: '#EFF6FF',
        borderColor: COLORS.primary,
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    typeLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
        marginTop: 4,
    },
    typeSub: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },

    /* Address */
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: LAYOUT.radius.m,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    mapContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    mapPlaceholder: {
        height: 140,
        backgroundColor: '#CBD5E1', // Simulating map
        width: '100%',
    },
    pinBtn: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        backgroundColor: '#1E293B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 6,
        ...LAYOUT.shadow,
    },
    pinBtnText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    mapInfo: {
        backgroundColor: '#EFF6FF',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mapInfoText: {
        fontSize: 11,
        color: '#334155',
        flex: 1,
        lineHeight: 16,
    },

    /* Images */
    countBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    countText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    uploadArea: {
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        marginBottom: 16,
    },
    uploadIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    uploadText: {
        fontSize: 12,
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    uploadSub: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    thumbsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    thumbBox: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
    },
    aiNote: {
        fontSize: 11,
        color: '#64748B',
    },

    /* Footer */
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: SPACING.l,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.m,
    },
    backFooterBtn: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    backFooterText: {
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    saveFooterBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        gap: 8,
        ...LAYOUT.shadow,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3,
    },
    saveFooterText: {
        fontWeight: 'bold',
        color: COLORS.white,
        fontSize: 14,
    },
});
