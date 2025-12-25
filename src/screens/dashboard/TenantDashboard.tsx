import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image as RNImage, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    const router = useRouter();

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
                    <Ionicons name="search" size={20} color={COLORS.textPrimary} />
                    <Text style={styles.searchText}>Gandhipuram, Coimbatore</Text>
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => router.push('/dashboard/rental-preferences')}
                    >
                        {/* CHANGED: Bell/Option icon to Filter Icon */}
                        <Ionicons name="filter" size={20} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </GlassCard>

                {/* Filter Fab - Originally present, keeping comment out if user meant to remove 'bell' (often floating) or keeping it?
                    The user said 'remove the bell icon'. The search bar icon is now filter.
                    The floating button had 'options' icon too. I will keep it commented out to be safe as per previous thought process, 
                    assuming user considers 'options' icon as 'bell' or simply wants less clutter. 
                    Structure is preserved.
                */}
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
                        {MOCK_PROPERTIES.map((prop, index) => (
                            <GlassCard key={prop.id} style={styles.propertyCard}>
                                <RNImage
                                    source={{
                                        uri: [
                                            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
                                            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
                                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
                                        ][index % 3]
                                    }}
                                    style={styles.propertyImage}
                                    resizeMode="cover"
                                />
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
    filterBtn: {
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
