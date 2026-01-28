import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';

export default function RoleSelectionScreen() {
    const router = useRouter();
    const { fromLogin } = useLocalSearchParams();
    const isFromLogin = fromLogin === 'true';

    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isRequesting, setIsRequesting] = useState(false);

    const requestLiveLocation = async () => {
        try {
            setIsRequesting(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Permission Denied",
                    "We need location access to show you homes in your current area. You can still proceed, but the experience won't be personalized.",
                    [{ text: "OK" }]
                );
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
            });
        } catch (error: any) {
            console.error("Error getting live location:", error.message);
            if (error.message.includes('unavailable') || error.message.includes('disabled')) {
                Alert.alert("GPS Required", "Please turn on your device's Location Services (GPS) and try again.");
            } else {
                Alert.alert("Error", "Could not fetch your live location. Please try again or proceed without it.");
            }
        } finally {
            setIsRequesting(false);
        }
    };

    const handleSelectRole = (role: 'Owner' | 'Tenant') => {
        if (role === 'Owner') {
            router.push('/dashboard/owner');
        } else {
            router.push('/dashboard/tenant');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Setup Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
                {/* Placeholder Icon */}
                <View style={styles.iconWrapper}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="layers" size={32} color={COLORS.primary} />
                    </View>
                </View>

                <Text style={styles.title}>Who are you?</Text>
                <Text style={styles.subtitle}>Choose your role to personalize your property discovery.</Text>

                {isFromLogin && (
                    <Animated.View entering={FadeInDown.delay(300)} style={styles.locationSection}>
                        <View style={styles.permissionCard}>
                            <View style={styles.permissionIconWrapper}>
                                <Ionicons
                                    name={location ? "location" : "location-outline"}
                                    size={28}
                                    color={location ? COLORS.success : COLORS.primary}
                                />
                            </View>
                            <View style={styles.permissionInfo}>
                                <Text style={styles.permissionTitle}>
                                    {location ? "Location Access Granted" : "Access Live Location"}
                                </Text>
                                <Text style={styles.permissionDesc}>
                                    {location
                                        ? "We've found your position. Proceed to choice your role."
                                        : "We need your location to show properties near you."}
                                </Text>
                            </View>

                            {!location ? (
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={requestLiveLocation}
                                    disabled={isRequesting}
                                >
                                    {isRequesting ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.actionBtnText}>Enable</Text>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.successBadge}>
                                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                                </View>
                            )}
                        </View>
                    </Animated.View>
                )}

                <View style={styles.cardsContainer}>
                    {/* Tenant Card */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.roleCard}
                        onPress={() => handleSelectRole('Tenant')}
                    >
                        <View style={[styles.roleIcon, { backgroundColor: '#EFF6FF' }]}>
                            <Ionicons name="search" size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.roleInfo}>
                            <Text style={styles.roleName}>I am a Tenant</Text>
                            <Text style={styles.roleDesc}>Find your perfect home with our AI-powered recommendations.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>

                    {/* Owner Card */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.roleCard}
                        onPress={() => handleSelectRole('Owner')}
                    >
                        <View style={[styles.roleIcon, { backgroundColor: '#F0FDF4' }]}>
                            <Ionicons name="key" size={24} color={COLORS.success} />
                        </View>
                        <View style={styles.roleInfo}>
                            <Text style={styles.roleName}>I am an Owner</Text>
                            <Text style={styles.roleDesc}>List properties and find verified tenants in your area.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footerNote}>
                    <Ionicons name="information-circle" size={16} color={COLORS.primary} />
                    <Text style={styles.noteText}>
                        Your selection helps us tailor the search filters and dashboard tools for your needs.
                    </Text>
                </View>

                {/* Debug Button */}
                <TouchableOpacity
                    style={styles.debugBtn}
                    onPress={async () => {
                        try {
                            const res = await fetch("http://192.168.29.40:3000/ping");
                            const text = await res.text();
                            Alert.alert("Connection Result", `Status: ${res.status}\nBody: ${text}`);
                        } catch (err: any) {
                            Alert.alert("Connection Failed", err.message);
                        }
                    }}
                >
                    <Text style={styles.debugBtnText}>Test Server Connection</Text>
                </TouchableOpacity>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: 60,
        paddingBottom: SPACING.m,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.l,
        alignItems: 'center',
    },
    iconWrapper: {
        marginBottom: SPACING.l,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.s,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xxl,
        lineHeight: 24,
        maxWidth: '80%',
    },
    cardsContainer: {
        width: '100%',
        gap: SPACING.m,
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.l,
        borderRadius: LAYOUT.radius.l,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...LAYOUT.shadow,
        shadowOpacity: 0.05,
    },
    roleIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    roleInfo: {
        flex: 1,
    },
    roleName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    roleDesc: {
        fontSize: 12,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    footerNote: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: SPACING.m,
        borderRadius: LAYOUT.radius.m,
        marginTop: SPACING.xl,
        gap: SPACING.s,
    },
    noteText: {
        flex: 1,
        fontSize: 12,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    locationSection: {
        width: '100%',
        marginBottom: SPACING.xl,
        paddingHorizontal: 4,
    },
    permissionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: LAYOUT.radius.l,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...LAYOUT.shadow,
        shadowOpacity: 0.03,
    },
    permissionIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    permissionInfo: {
        flex: 1,
    },
    permissionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    permissionDesc: {
        fontSize: 11,
        color: COLORS.textSecondary,
        lineHeight: 16,
    },
    actionBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    actionBtnText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: 'bold',
    },
    successBadge: {
        padding: 4,
    },
    debugBtn: {
        marginTop: SPACING.xxl,
        padding: 10,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    debugBtnText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    }
});
