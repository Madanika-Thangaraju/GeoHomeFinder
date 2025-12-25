import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

const MOCK_LISTINGS = [
    {
        id: '1',
        title: 'Sunnyvale Villa',
        address: '123 Marina Blvd, San Francisco, CA',
        price: '$4,500 / mo',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        views: 245,
        status: 'Active',
    },
    {
        id: '2',
        title: 'Modern Downtown Loft',
        address: '456 Market St, San Francisco, CA',
        price: '$3,200 / mo',
        image: 'https://images.unsplash.com/photo-1600596542815-e32eb665bc72?auto=format&fit=crop&w=800&q=80',
        views: 112,
        status: 'Pending',
    },
    {
        id: '3',
        title: 'Cozy Suburban Home',
        address: '789 Oak Ave, Palo Alto, CA',
        price: '$5,100 / mo',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        views: 89,
        status: 'Active',
    },
];

export default function MyListings() {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof MOCK_LISTINGS[0] }) => (
        <View style={styles.card}>
            <View style={{ position: 'relative' }}>
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                <View style={[styles.statusBadge, item.status === 'Active' ? styles.activeBadge : styles.pendingBadge]}>
                    <Text style={[styles.statusText, item.status === 'Active' ? styles.activeText : styles.pendingText]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.address}>{item.address}</Text>

                <View style={styles.footer}>
                    <View style={styles.stat}>
                        <Ionicons name="eye-outline" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.statText}>{item.views} Views</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Listings</Text>
                <TouchableOpacity onPress={() => router.push('/dashboard/add-property')}>
                    <Ionicons name="add" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MOCK_LISTINGS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Should appear white/light per new theme
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: 60,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    listContent: {
        padding: SPACING.l,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: LAYOUT.radius.l,
        marginBottom: SPACING.l,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 180,
    },
    cardContent: {
        padding: SPACING.m,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 10,
    },
    activeBadge: {
        backgroundColor: '#DCFCE7', // Green-100
    },
    pendingBadge: {
        backgroundColor: '#FEF9C3', // Yellow-100
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeText: {
        color: '#166534', // Green-700
    },
    pendingText: {
        color: '#854D0E', // Yellow-700
    },
    price: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.primary,
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    address: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
});
