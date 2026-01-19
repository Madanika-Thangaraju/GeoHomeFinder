import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, LAYOUT, SPACING } from '../../src/constants/theme';
import { getProfile, updateProfile } from '../../src/services/service';

export default function ProfileScreen() {
    const router = useRouter();

    // State Management
    const [showPersonalDetails, setShowPersonalDetails] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showHelpSupport, setShowHelpSupport] = useState(false);
    const [showTermsPolicies, setShowTermsPolicies] = useState(false);

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        memberSince: '',
        role: 'Tenant'
    });

    const [editData, setEditData] = useState({ ...userData });

    // Load Profile
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            const mappedData = {
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                location: data.location || 'Coimbatore, Tamil Nadu', // Default if empty
                memberSince: data.created_at ? new Date(data.created_at).toDateString() : '',
                role: 'Tenant' // Or data.role if available
            };
            setUserData(mappedData);
            setEditData(mappedData);
        } catch (error) {
            console.error('Failed to load profile', error);
            // Fallback or Alert?
        }
    };

    const handleSaveProfile = async () => {
        try {
            await updateProfile({
                name: editData.name,
                phone: editData.phone,
                location: editData.location
            });
            setUserData({ ...editData });
            setShowEditProfile(false);
            Alert.alert("Success", "Profile updated successfully");
        } catch (error) {
            console.error('Failed to update profile', error);
            Alert.alert("Error", "Failed to update profile");
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out of your account?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: () => router.replace('/') }
            ]
        );
    };

    const StatItem = ({ count, label, icon, color }: any) => (
        <View style={styles.statCard}>
            <Text style={styles.statCount}>{count}</Text>
            <View style={styles.statLabelRow}>
                <Ionicons name={icon} size={14} color={color} style={{ marginRight: 4 }} />
                <Text style={styles.statLabel}>{label}</Text>
            </View>
        </View>
    );

    const PropertyToolCard = ({ icon, color, bg, count, label }: any) => (
        <TouchableOpacity style={styles.toolCard}>
            <View style={[styles.toolIcon, { backgroundColor: bg }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={styles.toolCount}>{count}</Text>
            <Text style={styles.toolLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const RecentlyViewedItem = ({ image, title, location }: any) => (
        <View style={styles.recentCard}>
            <View style={styles.recentImageContainer}>
                <Image source={{ uri: image }} style={styles.recentImage} />
                <View style={styles.heartBtnSmall}>
                    <Ionicons name="heart" size={14} color="#EF4444" />
                </View>
            </View>
            <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>{title}</Text>
                <Text style={styles.recentLocation}>{location}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => {
                                setEditData({ ...userData });
                                setShowEditProfile(true);
                            }}
                        >
                            <Ionicons name="pencil" size={12} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{userData.name}</Text>
                    <View style={styles.roleContainer}>
                        <View style={styles.roleTag}>
                            <Text style={styles.roleText}>{userData.role}</Text>
                        </View>
                        <Text style={styles.locationText}>•  {userData.location}</Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatItem count="8" label="Saved" icon="heart" color="#EF4444" />
                    <StatItem count="42" label="Viewed" icon="eye" color="#3B82F6" />
                    <StatItem count="2" label="Applied" icon="briefcase" color="#F59E0B" />
                </View>

                {/* Property Tools */}
                <Text style={styles.sectionTitle}>Property Tools</Text>
                <View style={styles.toolsGrid}>
                    <PropertyToolCard
                        icon="bookmark"
                        color="#3B82F6"
                        bg="#EFF6FF"
                        count="3"
                        label="Saved Searches"
                    />
                    <PropertyToolCard
                        icon="notifications"
                        color="#8B5CF6"
                        bg="#F3E8FF"
                        count="5"
                        label="Active Alerts"
                    />
                </View>

                {/* Recently Viewed */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Text style={styles.sectionTitleNoMargin}>Recently Viewed</Text>
                    <TouchableOpacity>
                        <Text style={styles.historyLink}>History</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList}>
                    <RecentlyViewedItem
                        image="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80"
                        title="3BHK Apartment"
                        location="RS Puram, Coimbatore"
                    />
                    <RecentlyViewedItem
                        image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80"
                        title="2BHK Spacious"
                        location="Peelamedu, Coimbatore"
                    />
                </ScrollView>

                {/* Settings & Support */}
                <Text style={styles.sectionTitle}>Settings & Support</Text>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowPersonalDetails(true)}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="person-outline" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.menuText}>Personal Details</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.menuDivider} />
                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowHelpSupport(true)}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="help-buoy-outline" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.menuDivider} />
                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowTermsPolicies(true)}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.menuText}>Terms & Policies</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.menuDivider} />
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
                            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                        </View>
                        <Text style={[styles.menuText, { color: COLORS.error }]}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Personal Details Modal */}
            <Modal animationType="slide" transparent={true} visible={showPersonalDetails} onRequestClose={() => setShowPersonalDetails(false)}>
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
                            <TouchableOpacity style={styles.editProfileBtn} onPress={() => { setShowPersonalDetails(false); setEditData({ ...userData }); setShowEditProfile(true); }}>
                                <Text style={styles.editProfileText}>Edit Details</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal animationType="slide" transparent={true} visible={showEditProfile} onRequestClose={() => setShowEditProfile(false)}>
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
                            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 12 }]} onPress={() => setShowEditProfile(false)}>
                                <Text style={[styles.saveBtnText, { color: COLORS.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Help & Support Modal */}
            <Modal animationType="slide" transparent={true} visible={showHelpSupport} onRequestClose={() => setShowHelpSupport(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Help & Support</Text>
                            <TouchableOpacity onPress={() => setShowHelpSupport(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.sectionHeaderInner}>App Details</Text>
                            <Text style={styles.infoText}>GeoHome v1.0.0</Text>
                            <Text style={styles.infoText}>Build: 2025.12.25</Text>
                            <Text style={[styles.sectionHeaderInner, { marginTop: 20 }]}>Instructions</Text>
                            <View style={styles.instructionItem}>
                                <Ionicons name="search-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.instructionText}>Use the search bar on the home screen to find properties in your area.</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <Ionicons name="heart-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.instructionText}>Save properties you like by clicking the heart icon on any listing.</Text>
                            </View>
                            <TouchableOpacity style={[styles.editProfileBtn, { backgroundColor: '#F1F5F9', marginTop: 24 }]}>
                                <Text style={[styles.editProfileText, { color: COLORS.textPrimary }]}>Contact Support</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Terms & Policies Modal */}
            <Modal animationType="slide" transparent={true} visible={showTermsPolicies} onRequestClose={() => setShowTermsPolicies(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Terms & Policies</Text>
                            <TouchableOpacity onPress={() => setShowTermsPolicies(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.sectionHeaderInner}>Privacy Policy</Text>
                            <Text style={styles.legalText}>Your privacy is important to us. GeoHome collects only the information necessary to provide you with property search and listing services.</Text>
                            <Text style={[styles.sectionHeaderInner, { marginTop: 20 }]}>Terms of Service</Text>
                            <Text style={styles.legalText}>By using GeoHome, you agree to provide accurate information and interact respectfully with other users.</Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/tenant')}>
                    <Ionicons name="home-outline" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/saved-properties')}>
                    <Ionicons name="heart-outline" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.navText}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person" size={24} color={COLORS.primary} />
                    <Text style={[styles.navText, { color: COLORS.primary }]}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.m, paddingTop: 50, paddingBottom: SPACING.m, backgroundColor: COLORS.white },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
    scrollContent: { paddingBottom: 100 },
    profileSection: { alignItems: 'center', backgroundColor: COLORS.white, paddingVertical: 24, marginHorizontal: SPACING.m, marginTop: SPACING.m, borderRadius: 20, ...LAYOUT.shadow, shadowOpacity: 0.05 },
    avatarContainer: { position: 'relative', marginBottom: 12 },
    avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#EFF6FF' },
    editBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3B82F6', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
    userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
    roleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    roleTag: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    roleText: { color: '#166534', fontSize: 12, fontWeight: '600' },
    locationText: { color: COLORS.textSecondary, fontSize: 14 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, marginHorizontal: SPACING.m, gap: 12 },
    statCard: { flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: 16, alignItems: 'center', ...LAYOUT.shadow, shadowOpacity: 0.05 },
    statCount: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
    statLabelRow: { flexDirection: 'row', alignItems: 'center' },
    statLabel: { fontSize: 12, color: COLORS.textSecondary },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginLeft: SPACING.m, marginTop: 24, marginBottom: 12 },
    sectionTitleNoMargin: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
    toolsGrid: { flexDirection: 'row', marginHorizontal: SPACING.m, gap: 12 },
    toolCard: { flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: 16, ...LAYOUT.shadow, shadowOpacity: 0.05 },
    toolIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    toolCount: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
    toolLabel: { fontSize: 12, color: COLORS.textSecondary },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: SPACING.m, marginBottom: 12 },
    historyLink: { color: '#3B82F6', fontSize: 12, fontWeight: '600' },
    recentList: { paddingHorizontal: SPACING.m, gap: 12 },
    recentCard: { width: 160, backgroundColor: COLORS.white, borderRadius: 12, overflow: 'hidden', ...LAYOUT.shadow, shadowOpacity: 0.05 },
    recentImageContainer: { height: 100, position: 'relative' },
    recentImage: { width: '100%', height: '100%' },
    heartBtnSmall: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
    recentContent: { padding: 8 },
    recentTitle: { fontSize: 12, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 2 },
    recentLocation: { fontSize: 10, color: COLORS.textSecondary },
    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, flexDirection: 'row', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 30 },
    navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    navText: { fontSize: 10, marginTop: 4, color: COLORS.textSecondary },
    menuContainer: { backgroundColor: COLORS.white, borderRadius: 16, marginHorizontal: SPACING.m, ...LAYOUT.shadow, shadowOpacity: 0.05 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    menuIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    menuText: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
    menuDivider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 64 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
    detailRow: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12 },
    detailLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4, textTransform: 'uppercase' },
    detailValue: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '500' },
    editProfileBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
    editProfileText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
    sectionHeaderInner: { fontSize: 14, fontWeight: 'bold', color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
    infoText: { fontSize: 14, color: COLORS.textPrimary, marginBottom: 4 },
    instructionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
    instructionText: { fontSize: 14, color: COLORS.textPrimary, flex: 1, lineHeight: 20 },
    editRow: { marginBottom: 20 },
    editLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 },
    inputValue: { fontSize: 16, color: COLORS.textPrimary },
    saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    saveBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
    legalText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22, marginBottom: 16 },
});
