import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GlassCard } from '../../components/shared/GlassCard';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');

const MOCK_PROPERTIES = [
    { id: 1, price: '$2,400', type: 'Apartment', dist: '0.8 mi' },
    { id: 2, price: '$3,150', type: 'Condo', dist: '1.2 mi' },
    { id: 3, price: '$5,000', type: 'Villa', dist: '2.5 mi' },
];

export const TenantDashboard = () => {
    return (
        <View style={styles.container}>
            {/* Map Placeholder Layer */}
            <View style={styles.mapLayer}>
                <GradientBackground style={{ opacity: 0.8 }}>
                    {/* Simulated Map Markers */}
                    <View style={[styles.marker, { top: '30%', left: '20%' }]} />
                    <View style={[styles.marker, { top: '50%', left: '60%' }]} />
                    <View style={[styles.marker, { top: '40%', left: '80%' }]} />

                    <View style={styles.mapControls}>
                        <TouchableOpacity style={styles.mapBtn}>
                            <Ionicons name="add" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mapBtn}>
                            <Ionicons name="remove" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.mapBtn, { marginTop: SPACING.s }]}>
                            <Ionicons name="locate" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </GradientBackground>
            </View>

            {/* UI Overlay */}
            <View style={styles.uiLayer}>
                {/* Search Bar */}
                <GlassCard style={styles.searchBar}>
                    <Ionicons name="sparkles" size={20} color={COLORS.secondary} />
                    <Text style={styles.searchText}>Ask AI: Show homes under 15k near schools</Text>
                    <TouchableOpacity style={styles.micBtn}>
                        <Ionicons name="mic" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </GlassCard>

                {/* Filter Fab */}
                <TouchableOpacity style={styles.filterFab}>
                    <Ionicons name="options" size={24} color={COLORS.white} />
                </TouchableOpacity>

                {/* Horizontal Property Scroll */}
                <View style={styles.propertyListContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: SPACING.l }}
                    >
                        {MOCK_PROPERTIES.map((prop) => (
                            <GlassCard key={prop.id} style={styles.propertyCard}>
                                <View style={styles.propertyImage} />
                                <View style={styles.propertyInfo}>
                                    <Text style={styles.price}>{prop.price}<Text style={styles.perMonth}>/mo</Text></Text>
                                    <Text style={styles.details}>{prop.type} • {prop.dist}</Text>
                                </View>
                            </GlassCard>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mapLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    mapControls: {
        position: 'absolute',
        right: SPACING.m,
        top: 100,
    },
    mapBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(23, 23, 23, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xs,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    marker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        borderColor: 'rgba(255,255,255,0.5)',
        borderWidth: 4,
        position: 'absolute',
        shadowColor: COLORS.primary,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    uiLayer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 40,
    },
    searchBar: {
        marginHorizontal: SPACING.l,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.m,
        borderRadius: 30, // Pill shape
    },
    searchText: {
        flex: 1,
        color: COLORS.textSecondary,
        marginLeft: SPACING.s,
        fontSize: FONTS.sizes.caption,
    },
    micBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterFab: {
        position: 'absolute',
        top: 130,
        left: SPACING.l,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.secondary,
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    propertyListContainer: {
        height: 180,
    },
    propertyCard: {
        width: width * 0.7,
        marginRight: SPACING.m,
        padding: 0,
        height: 150,
    },
    propertyImage: {
        flex: 2,
        backgroundColor: '#475569',
    },
    propertyInfo: {
        flex: 1,
        padding: SPACING.s,
        justifyContent: 'center',
    },
    price: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: FONTS.sizes.h3,
    },
    perMonth: {
        fontSize: FONTS.sizes.small,
        color: COLORS.textSecondary,
        fontWeight: 'normal',
    },
    details: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.small,
        marginTop: 2,
    },
});
