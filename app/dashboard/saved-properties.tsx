import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const SAVED_PROPERTIES = [
    {
        id: '1',
        title: '3BHK Apartment',
        location: 'RS Puram, Coimbatore',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        price: '₹25,000/mo',
        specs: '3bd  |  2ba  |  1400 sqft',
        tag: 'Verified',
        tagColor: '#52525B'
    },
    {
        id: '2',
        title: '2BHK Spacious',
        location: 'Peelamedu, Coimbatore',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        price: '₹18,000/mo',
        specs: '2bd  |  2ba  |  1100 sqft',
        tag: 'PRICE DROP',
        tagColor: '#22C55E'
    },
    {
        id: '3',
        title: 'Modern Villa',
        location: 'Saravanampatti, Coimbatore',
        image: 'https://images.unsplash.com/photo-1600596542815-e32cbb04a08f?auto=format&fit=crop&w=800&q=80',
        price: '₹45,000/mo',
        specs: '4bd  |  4ba  |  2800 sqft',
        tag: 'Sold Out',
        tagColor: '#64748B',
        isSoldOut: true
    }
];

export default function SavedPropertiesScreen() {
    // router is now imported directly from expo-router

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Properties</Text>
                <View style={{ width: 44 }} />
            </View>


            <View style={styles.subheader}>
                <Text style={styles.countText}>{SAVED_PROPERTIES.length} Properties Saved</Text>
                <Text style={styles.compareText}>Compare (0)</Text>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {SAVED_PROPERTIES.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.cardImage} />
                            <TouchableOpacity style={styles.heartBtn}>
                                <Ionicons name="heart" size={20} color="#EF4444" />
                            </TouchableOpacity>
                            {item.tag && (
                                <View style={[styles.tagBadge, { backgroundColor: item.tagColor }]}>
                                    {item.tag === 'Verified' && <Ionicons name="checkmark-circle" size={12} color={COLORS.white} style={{ marginRight: 4 }} />}
                                    <Text style={styles.tagText}>{item.tag}</Text>
                                </View>
                            )}
                            {item.isSoldOut && (
                                <View style={styles.soldOutOverlay}>
                                    <Text style={styles.soldOutOverlayText}>Sold Out</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.price}>{item.price}</Text>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.location}>{item.location}</Text>
                            <Text style={styles.specs}>{item.specs}</Text>

                            <View style={styles.cardActions}>
                                <TouchableOpacity style={styles.detailsBtn}>
                                    <Text style={styles.btnText}>Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.detailsBtn, { backgroundColor: item.isSoldOut ? '#E2E8F0' : COLORS.white, borderColor: item.isSoldOut ? '#E2E8F0' : COLORS.textPrimary, borderWidth: 1 }]} disabled={item.isSoldOut}>
                                    <Text style={[styles.btnText, { color: item.isSoldOut ? COLORS.textSecondary : COLORS.textPrimary }]}>
                                        {item.isSoldOut ? 'Sold Out' : 'Contact Owner'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
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
        paddingHorizontal: SPACING.m,
        paddingTop: 50,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    filterRow: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.white,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 8,
    },
    activeChip: {
        backgroundColor: '#1E293B',
    },
    chipText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    activeChipText: {
        fontSize: 12,
        color: COLORS.white,
        fontWeight: '600',
    },
    subheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: 12,
    },
    countText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    compareText: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: SPACING.m,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: SPACING.l,
        overflow: 'hidden',
        ...LAYOUT.shadow,
        shadowOpacity: 0.05,
    },
    imageContainer: {
        height: 180,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    heartBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    soldOutOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    soldOutOverlayText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
        backgroundColor: '#64748B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    cardContent: {
        padding: 16,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    location: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    specs: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    cardActions: {
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
    btnText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
});
