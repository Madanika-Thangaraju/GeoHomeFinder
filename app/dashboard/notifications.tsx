import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NotificationsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Geo Alerts</Text>

                <TouchableOpacity>
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Purpose */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>ALERT MODE</Text>

                    <View style={styles.row}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="navigate" size={18} color="#2563EB" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>Geo-Fence Alerts</Text>
                            <Text style={styles.cardSubtitle}>
                                Get notified when you enter a property zone
                            </Text>
                        </View>
                        <Switch value />
                    </View>
                </View>

                {/* Budget */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>NOTIFICATION TYPE</Text>

                    <View style={styles.row}>
                        <Ionicons name="home" size={20} color="#2563EB" />
                        <Text style={styles.rowText}>New Properties Nearby</Text>
                    </View>

                    <View style={styles.row}>
                        <Ionicons name="trending-up" size={20} color="#16A34A" />
                        <Text style={styles.rowText}>Price Drop Alerts</Text>
                    </View>

                    <View style={styles.row}>
                        <Ionicons name="heart" size={20} color="#EC4899" />
                        <Text style={styles.rowText}>Saved Property Updates</Text>
                    </View>
                </View>

                {/* Radius */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>ALERT RADIUS</Text>

                    <View style={styles.rangeRow}>
                        <Text style={styles.rangeText}>Minimum</Text>
                        <Text style={styles.rangeValue}>500 m</Text>
                    </View>

                    <View style={styles.rangeRow}>
                        <Text style={styles.rangeText}>Maximum</Text>
                        <Text style={styles.rangeValue}>2 km</Text>
                    </View>

                    <View style={styles.fakeSlider}>
                        <View style={styles.fakeThumb} />
                        <View style={[styles.fakeThumb, { left: '65%' }]} />
                    </View>
                </View>

                {/* Save */}
                <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveText}>Save Preferences</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 20,
        paddingTop: 60,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    resetText: {
        color: '#2563EB',
        fontWeight: '600',
    },

    /* Cards */
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    sectionLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 12,
        fontWeight: '600',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },

    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardTitle: {
        fontWeight: '700',
        color: '#0F172A',
    },

    cardSubtitle: {
        fontSize: 12,
        color: '#64748B',
    },

    rowText: {
        fontSize: 14,
        color: '#0F172A',
        fontWeight: '500',
    },

    /* Range */
    rangeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    rangeText: {
        fontSize: 12,
        color: '#64748B',
    },
    rangeValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },

    fakeSlider: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginTop: 12,
        position: 'relative',
    },

    fakeThumb: {
        position: 'absolute',
        top: -6,
        left: '25%',
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#2563EB',
    },

    /* Save Button */
    saveBtn: {
        flexDirection: 'row',
        height: 52,
        borderRadius: 14,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },

    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
