import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';

export default function OwnerProfile() {
    const router = useRouter();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [showPersonalDetails, setShowPersonalDetails] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showHelpSupport, setShowHelpSupport] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Senthil Kumar',
        email: 'senthil.kumar@example.com',
        phone: '+91 98765 43210',
        location: 'Coimbatore, Tamil Nadu',
        memberSince: 'August 2023',
        role: 'Property Owner'
    });

    const [editData, setEditData] = useState({ ...userData });

    const handleSaveProfile = () => {
        setUserData({ ...editData });
        setShowEditProfile(false);
    };

    const StatItem = ({ value, label, rating }: { value: string; label: string; rating?: boolean }) => (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>
                {value} {rating && <Ionicons name="star" size={14} color="#FBBF24" />}
            </Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const MenuItem = ({ icon, title, subtitle, hasSwitch, rightIcon = true, image, onPress, iconColor }: any) => (
        <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={hasSwitch ? () => setPushEnabled(!pushEnabled) : onPress}
        >
            {image ? (
                <Image source={require('../../assets/images/hero_property.png')} style={styles.menuImage} />
            ) : (
                <View style={styles.menuIconContainer}>
                    {icon === 'bookmark' ? (
                        <View style={[styles.bookmarkIcon, { backgroundColor: '#3B82F6' }]}>
                            <Ionicons name={icon} size={16} color={COLORS.white} />
                        </View>
                    ) : (
                        icon && <Ionicons name={icon} size={22} color={iconColor || COLORS.textSecondary} />
                    )}
                </View>
            )}

            <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>

            {hasSwitch ? (
                <Switch
                    value={pushEnabled}
                    onValueChange={setPushEnabled}
                    trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
                />
            ) : (
                rightIcon && <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Avatar */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>SK</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editBadge}
                            onPress={() => {
                                setEditData({ ...userData });
                                setShowEditProfile(true);
                            }}
                        >
                            <Ionicons name="pencil" size={12} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>Senthil Kumar</Text>
                    <Text style={styles.userEmail}>senthil.kumar@example.com</Text>

                    {/* Owner/Tenant Toggle */}
                    {/* Role Badge */}
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>Owner</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <StatItem value="3" label="LISTINGS" />
                    <StatItem value="128" label="VIEWS" />
                    <StatItem value="4.8" label="RATING" rating />
                </View>

                {/* My Activity */}
                <Text style={styles.sectionTitle}>MY ACTIVITY</Text>
                <View style={styles.sectionCard}>
                    <MenuItem
                        image={true}
                        title="My Listings"
                        subtitle="Manage your active properties"
                        onPress={() => router.push('/dashboard/my-listings')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="bookmark"
                        title="Saved Searches & Alerts"
                        subtitle="2 active alerts in Gandhipuram"
                    // Using a custom icon renderer inside MenuItem for the blue bookmark look
                    />
                </View>

                {/* Preferences */}
                <Text style={styles.sectionTitle}>PREFERENCES</Text>
                <View style={styles.sectionCard}>
                    <MenuItem
                        icon="person"
                        title="Personal Details"
                        iconColor={COLORS.textSecondary}
                        onPress={() => setShowPersonalDetails(true)}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="notifications"
                        title="Push Notifications"
                        hasSwitch
                        iconColor={COLORS.textSecondary}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="help-circle"
                        title="Help & Support"
                        iconColor={COLORS.textSecondary}
                        onPress={() => setShowHelpSupport(true)}
                    />
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Personal Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPersonalDetails}
                onRequestClose={() => setShowPersonalDetails(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Personal Details</Text>
                            <TouchableOpacity onPress={() => setShowPersonalDetails(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Full Name</Text>
                                <Text style={styles.detailValue}>{userData.name}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Email</Text>
                                <Text style={styles.detailValue}>{userData.email}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Phone</Text>
                                <Text style={styles.detailValue}>{userData.phone}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Location</Text>
                                <Text style={styles.detailValue}>{userData.location}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Member Since</Text>
                                <Text style={styles.detailValue}>{userData.memberSince}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Account Type</Text>
                                <Text style={styles.detailValue}>{userData.role}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.editProfileBtn}
                                onPress={() => {
                                    setShowPersonalDetails(false);
                                    setEditData({ ...userData });
                                    setShowEditProfile(true);
                                }}
                            >
                                <Text style={styles.editProfileText}>Edit Details</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showEditProfile}
                onRequestClose={() => setShowEditProfile(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>
                            <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.editRow}>
                                <Text style={styles.editLabel}>Full Name</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                                    <Text style={styles.inputValue}>{editData.name}</Text>
                                    {/* Simplified for demo, in a real app these would be TextInput */}
                                </View>
                            </View>

                            <View style={styles.editRow}>
                                <Text style={styles.editLabel}>Email Address</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                                    <Text style={styles.inputValue}>{editData.email}</Text>
                                </View>
                            </View>

                            <View style={styles.editRow}>
                                <Text style={styles.editLabel}>Phone Number</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />
                                    <Text style={styles.inputValue}>{editData.phone}</Text>
                                </View>
                            </View>

                            <View style={styles.editRow}>
                                <Text style={styles.editLabel}>Location</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
                                    <Text style={styles.inputValue}>{editData.location}</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.saveBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 12 }]}
                                onPress={() => setShowEditProfile(false)}
                            >
                                <Text style={[styles.saveBtnText, { color: COLORS.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Help & Support Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showHelpSupport}
                onRequestClose={() => setShowHelpSupport(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Help & Support</Text>
                            <TouchableOpacity onPress={() => setShowHelpSupport(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.sectionHeader}>App Details</Text>
                            <Text style={styles.infoText}>GeoHome v1.0.0</Text>
                            <Text style={styles.infoText}>Build: 2025.12.25</Text>

                            <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Instructions</Text>
                            <View style={styles.instructionItem}>
                                <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.instructionText}>To add a property, go to dashboard and click "Add New Property".</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <Ionicons name="list-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.instructionText}>View and manage your listings in the "My Listings" section.</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.instructionText}>Contact support for any account related queries.</Text>
                            </View>

                            <TouchableOpacity style={[styles.editProfileBtn, { backgroundColor: '#F1F5F9', marginTop: 24 }]}>
                                <Text style={[styles.editProfileText, { color: COLORS.textPrimary }]}>Contact Support</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: SPACING.m,
        paddingTop: 50,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    scrollContent: {
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007BFF', // Blue from screenshot
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(0,123,255,0.1)',
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    avatarText: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: 'bold',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.white,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    roleBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    roleText: {
        color: '#2563EB',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#94A3B8', // Lighter text color from image
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#94A3B8',
        marginBottom: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 8,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bookmarkIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuImage: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 68,
    },
    logoutBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FECACA',
        backgroundColor: COLORS.white,
        marginBottom: 24,
    },
    logoutText: {
        color: COLORS.error,
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    detailRow: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    editProfileBtn: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    editProfileText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 12,
    },
    instructionText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        flex: 1,
        lineHeight: 20,
    },
    editRow: {
        marginBottom: 20,
    },
    editLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 12,
    },
    inputValue: {
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    saveBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
