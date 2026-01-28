import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';
import { deleteProperty, getOwnerProperties, getProfile } from '../../src/services/service';
import { decodeToken, getToken, getUser } from '../../src/utils/auth';

export default function MyListings() {
    const router = useRouter();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadListings();
        }, [])
    );

    const loadListings = async () => {
        try {
            setLoading(true);
            let userId;

            // 1. Try Local Storage
            const user = await getUser();
            if (user && user.id) {
                userId = user.id;
            }

            // 2. Decode Token (Robust & Fast)
            if (!userId) {
                const token = await getToken();
                if (token) {
                    const decoded = decodeToken(token);
                    if (decoded && (decoded.id || decoded.sub)) {
                        userId = decoded.id || decoded.sub;
                    }
                }
            }

            // 3. Fallback to Profile API
            if (!userId) {
                try {
                    const profile = await getProfile();
                    console.log("DEBUG: getProfile response:", JSON.stringify(profile));
                    if (profile?.id) userId = profile.id;
                    else if (profile?.user?.id) userId = profile.user.id;
                    else if (profile?.data?.id) userId = profile.data.id;
                } catch (e) {
                    console.log("Failed to get profile", e);
                }
            }

            if (userId) {
                const data = await getOwnerProperties(userId);
                if (Array.isArray(data)) {
                    const formatted = data.map((item: any) => ({
                        id: item.id?.toString() || Math.random().toString(),
                        title: item.title || item.name || 'Untitled Property',
                        address: item.address || item.location || 'No address provided',
                        price: item.price ? `$${item.price}` : 'Price on request',
                        image:
                            // item.image?.uri || item.images?.[0] ||
                            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                        views: item.views || 0,

                        status: item.status || 'Active'
                    }));
                    setListings(formatted);
                }
            } else {
                console.error("Could not find User ID from local storage or profile API");
            }
        } catch (error) {
            console.error("Failed to load listings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteListing = async (id: string, title: string) => {
        Alert.alert(
            "Delete Listing",
            `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await deleteProperty(id);
                            Alert.alert("Success", "Listing deleted successfully");
                            loadListings();
                        } catch (error: any) {
                            Alert.alert("Error", error.message || "Failed to delete listing");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
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
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => router.push({
                                pathname: '/dashboard/add-property',
                                params: { id: item.id }
                            })}
                        >
                            <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => handleDeleteListing(item.id, item.title)}
                        >
                            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

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
                data={listings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: COLORS.textSecondary }}>No properties found.</Text>
                    </View>
                }
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
