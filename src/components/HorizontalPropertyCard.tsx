import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../constants/theme';

interface PropertyProps {
    id: string | number;
    image: any;
    price: string;
    type: string;
    size: string;
    address: string;
    match: string;
    dist?: string;
    status?: string;
}

interface HorizontalPropertyCardProps {
    property: PropertyProps;
    isSaved: boolean;
    onToggleSave: (id: number) => void;
    onPress: () => void;
}

export function HorizontalPropertyCard({ property, isSaved, onToggleSave, onPress }: HorizontalPropertyCardProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.propertyCard}>
                <View style={styles.cardImageContainer}>
                    <Image source={property.image} style={styles.cardImage} resizeMode="cover" />
                    {property.dist && (
                        <View style={styles.distBadge}>
                            <Ionicons name="location" size={10} color={COLORS.white} />
                            <Text style={styles.distText}>{property.dist}</Text>
                        </View>
                    )}
                    {property.status === 'Sold Out' && (
                        <View style={styles.soldOutOverlay}>
                            <View style={styles.soldOutBadge}>
                                <Text style={styles.soldOutText}>Sold Out</Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardPrice}>{property.price}<Text style={styles.cardPeriod}>/mo</Text></Text>
                        <TouchableOpacity onPress={() => onToggleSave(Number(property.id))} style={{ padding: 4 }}>
                            <Ionicons
                                name={isSaved ? "heart" : "heart-outline"}
                                size={20}
                                color={isSaved ? "#EF4444" : COLORS.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.cardDetails}>{property.type} • {property.size}</Text>
                    <Text style={styles.cardAddress} numberOfLines={1}>{property.address}</Text>

                    <View style={styles.cardFooter}>
                        <View style={styles.matchBadge}>
                            <Ionicons name="sparkles" size={10} color={COLORS.primary} />
                            <Text style={styles.matchScore}>{property.match}</Text>
                        </View>
                        <View style={styles.specBadge}>
                            <Text style={styles.petBadge}>Pet Friendly</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    propertyCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: SPACING.m,
        overflow: 'hidden',
        ...LAYOUT.shadow,
        shadowOpacity: 0.1,
        height: 120,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardImageContainer: {
        width: 120,
        height: '100%',
        position: 'relative',
    },
    cardImage: {
        width: 120,
        height: '100%',
        backgroundColor: '#64748B',
    },
    distBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        zIndex: 10,
    },
    distText: {
        color: COLORS.white,
        fontSize: 10,
    },
    soldOutOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    soldOutBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        transform: [{ rotate: '-10deg' }],
    },
    soldOutText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    cardContent: {
        flex: 1,
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    cardPeriod: {
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: 'normal',
    },
    cardDetails: {
        fontSize: 12,
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    cardAddress: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 8,
    },
    matchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    matchScore: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    specBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    petBadge: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
});
