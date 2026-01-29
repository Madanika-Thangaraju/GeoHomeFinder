import { COLORS } from '@/src/constants/theme';
import { getTourRequestsApi, updateTourStatusApi } from '@/src/services/service';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TourRequestsScreen() {
    const router = useRouter();
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const res = await getTourRequestsApi('owner');
            if (res.success) {
                setTours(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch tours", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTours();
        }, [])
    );

    const handleStatusUpdate = async (id: number, status: 'accepted' | 'rejected') => {
        try {
            await updateTourStatusApi(id, status);
            fetchTours();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
                <View style={styles.headerInfo}>
                    <Text style={styles.propertyTitle}>{item.property_title}</Text>
                    <Text style={styles.dateTime}>{new Date(item.tour_date).toLocaleDateString()} at {item.tour_time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'pending' ? '#FEF3C7' : item.status === 'accepted' ? '#D1FAE5' : '#FEE2E2' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'pending' ? '#B45309' : item.status === 'accepted' ? '#065F46' : '#991B1B' }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.tenantInfo}>
                <Text style={styles.label}>Tenant:</Text>
                <Text style={styles.value}>{item.other_name}</Text>
            </View>

            {item.message && (
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>"{item.message}"</Text>
                </View>
            )}

            {item.status === 'pending' && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.btn, styles.declineBtn]}
                        onPress={() => handleStatusUpdate(item.id, 'rejected')}
                    >
                        <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, styles.acceptBtn]}
                        onPress={() => handleStatusUpdate(item.id, 'accepted')}
                    >
                        <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.status === 'accepted' && (
                <TouchableOpacity
                    style={styles.contactBtn}
                    onPress={() => { /* Logic to call/chat */ }}
                >
                    <Ionicons name="call" size={16} color={COLORS.white} />
                    <Text style={styles.contactText}>Contact: {item.other_phone}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Tour Requests</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={tours}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name="calendar-outline" size={60} color="#CBD5E1" />
                            <Text style={styles.emptyText}>No tour requests yet</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: COLORS.white },
    title: { fontSize: 18, fontWeight: 'bold' },
    list: { padding: 20 },
    card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    headerInfo: { flex: 1, marginLeft: 12 },
    propertyTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
    dateTime: { fontSize: 12, color: COLORS.textSecondary },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    tenantInfo: { flexDirection: 'row', marginBottom: 8 },
    label: { fontSize: 14, color: COLORS.textSecondary, width: 60 },
    value: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
    messageBox: { backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8, marginBottom: 12 },
    messageText: { fontSize: 13, fontStyle: 'italic', color: COLORS.textSecondary },
    actions: { flexDirection: 'row', gap: 12 },
    btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
    declineBtn: { backgroundColor: '#F1F5F9' },
    acceptBtn: { backgroundColor: COLORS.primary },
    declineText: { color: COLORS.textPrimary, fontWeight: '600' },
    acceptText: { color: COLORS.white, fontWeight: '600' },
    contactBtn: { flexDirection: 'row', backgroundColor: '#10B981', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 8 },
    contactText: { color: COLORS.white, fontWeight: 'bold' },
    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary }
});
