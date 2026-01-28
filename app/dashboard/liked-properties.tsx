import { getLikedPropertiesApi, likePropertyApi } from '@/src/services/service';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

export default function LikedPropertiesScreen() {
    const [likedProperties, setLikedProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLikes = async () => {
        try {
            setLoading(true);
            const data = await getLikedPropertiesApi();
            setLikedProperties(data || []);
        } catch (error) {
            console.error('Failed to load likes', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLikes();
    }, []);

    const removeLike = async (propertyId: number) => {
        try {
            await likePropertyApi(propertyId, false);
            setLikedProperties(prev => prev.filter(p => p.id !== propertyId));
        } catch (error) {
            Alert.alert("Error", "Failed to unlike property");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Liked Properties</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.subheader}>
                <Text style={styles.countText}>{likedProperties.length} Properties Liked</Text>
            </View>

            {loading ? (
                <View style={styles.emptyState}>
                    <ActivityIndicator color={COLORS.primary} size="large" />
                </View>
            ) : likedProperties.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="heart-outline" size={64} color={COLORS.textSecondary} />
                    <Text style={styles.emptyTitle}>No Liked Properties Yet</Text>
                    <Text style={styles.emptyText}>Like properties from the dashboard to see them here</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent}>
                    {likedProperties.map((item: any) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.card}
                            onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
                        >
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be' }} style={styles.cardImage} />
                                <TouchableOpacity
                                    style={styles.heartBtn}
                                    onPress={() => removeLike(item.id)}
                                >
                                    <Ionicons name="heart" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.price}>₹{item.price || item.rent_price}</Text>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.location}>{item.address}</Text>
                                <Text style={styles.specs}>{item.property_type || item.type} • {item.bedrooms || item.bhk} Bed</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.m, paddingTop: 50, paddingBottom: SPACING.m, backgroundColor: COLORS.white },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
    subheader: { paddingHorizontal: SPACING.m, paddingVertical: 12 },
    countText: { fontSize: 12, color: COLORS.textSecondary },
    listContent: { paddingHorizontal: SPACING.m, paddingBottom: 20 },
    card: { backgroundColor: COLORS.white, borderRadius: 16, marginBottom: SPACING.l, overflow: 'hidden', ...LAYOUT.shadow, shadowOpacity: 0.05 },
    imageContainer: { height: 180 },
    cardImage: { width: '100%', height: '100%' },
    heartBtn: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...LAYOUT.shadow },
    cardContent: { padding: 16 },
    price: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
    title: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
    location: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
    specs: { fontSize: 12, color: COLORS.textSecondary },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 16, marginBottom: 8 },
    emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});
