import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, LAYOUT, SPACING } from "../../src/constants/theme";
import {
  getCallRequestsApi,
  getProfile,
  getTourRequestsApi,
  togglePushNotification,
  updateProfile,
} from "../../src/services/service";

const GOOGLE_PLACES_API_KEY = "AIzaSyDw84Qp9YXjxqy2m6ECrC-Qa4_yiTyiQ6s";

interface PlacePrediction {
  placeId: string;
  text: {
    text: string;
  };
  structuredFormat: {
    mainText: {
      text: string;
    };
    secondaryText: {
      text: string;
    };
  };
}

export default function OwnerProfile() {
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(false);
  const [stats, setStats] = useState({
    listings: "0",
    views: "0",
    rating: "0",
  });

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    image: null as string | null,
    memberSince: "",
    role: "Owner",
  });

  const [acceptedTours, setAcceptedTours] = useState<any[]>([]);
  const [acceptedCalls, setAcceptedCalls] = useState<any[]>([]);

  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showTermsPolicies, setShowTermsPolicies] = useState(false);
  const [editData, setEditData] = useState({ ...userData });

  // ---------- LOAD PROFILE ----------
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      const mappedData = {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        image: data.image || null,
        memberSince: data.created_at
          ? new Date(data.created_at).toDateString()
          : "",
        role: "Owner",
      };

      setUserData(mappedData);
      setEditData(mappedData);

      setPushEnabled(Boolean(data.push_enabled));

      setStats({
        listings: String(data.listings || 0),
        views: String(data.views || 0),
        rating: String(data.rating || 0),
      });

      const [tours, calls] = await Promise.all([
        getTourRequestsApi('owner'),
        getCallRequestsApi('owner')
      ]);

      if (tours.success) setAcceptedTours(tours.data.filter((r: any) => r.status === 'accepted'));
      if (calls.success) setAcceptedCalls(calls.data.filter((r: any) => r.status === 'accepted'));
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load profile");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setEditData({ ...editData, image: base64Image });
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (editData.location.length > 2 && showEditProfile) {
        searchPlaces(editData.location);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [editData.location, showEditProfile]);

  const searchPlaces = async (input: string) => {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          },
          body: JSON.stringify({
            input: input,
            locationBias: {
              circle: {
                center: {
                  latitude: 11.0168,
                  longitude: 76.9558,
                },
                radius: 50000.0,
              },
            },
          }),
        }
      );
      const data = await response.json();
      if (data.suggestions) {
        const formattedPredictions = data.suggestions.map((s: any) => s.placePrediction);
        setPredictions(formattedPredictions);
        setShowPredictions(true);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const selectPlace = async (prediction: PlacePrediction) => {
    setEditData({ ...editData, location: prediction.text.text });
    setShowPredictions(false);
    setPredictions([]);

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${prediction.placeId}?fields=location&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      if (data.location) {
        setEditData(prev => ({
          ...prev,
          latitude: data.location.latitude,
          longitude: data.location.longitude
        }));
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // ---------- SAVE PROFILE ----------
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editData.name,
        phone: editData.phone,
        location: editData.location,
        latitude: editData.latitude || undefined,
        longitude: editData.longitude || undefined,
        image: editData.image || undefined,
      });

      setUserData(editData);
      setShowEditProfile(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  // ---------- PUSH NOTIFICATIONS ----------
  const togglePush = async () => {
    try {
      const data = await togglePushNotification();
      setPushEnabled(Boolean(data.push_enabled));
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update notification settings");
    }
  };

  // ---------- LOGOUT ----------
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  // ---------- UI HELPERS ----------
  const StatItem = ({ value, label, rating }: any) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}{" "}
        {rating && <Ionicons name="star" size={14} color="#FBBF24" />}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({
    icon,
    title,
    subtitle,
    hasSwitch,
    onPress,
  }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color={COLORS.textSecondary} />
      </View>

      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>

      {hasSwitch ? (
        <Switch value={pushEnabled} onValueChange={togglePush} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );

  // ---------- UI ----------
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={userData.image ? { uri: userData.image } : { uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
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
          <Text style={styles.userNameHeader}>{userData.name}</Text>
          <View style={styles.roleContainer}>
            <View style={styles.roleTag}>
              <Text style={styles.roleText}>{userData.role}</Text>
            </View>
            <Text style={styles.locationText}>•  {userData.location}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <StatItem value={stats.listings} label="LISTINGS" />
          <StatItem value={stats.views} label="VIEWS" />
          <StatItem value={stats.rating} label="RATING" rating />
        </View>

        <MenuItem
          icon="person"
          title="Personal Details"
          onPress={() => setShowPersonalDetails(true)}
        />

        <MenuItem
          icon="notifications"
          title="Push Notifications"
          hasSwitch
        />

        <MenuItem
          icon="help-circle"
          title="Help & Support"
          onPress={() => setShowHelpSupport(true)}
        />

        <MenuItem
          icon="document-text"
          title="Terms & Policies"
          onPress={() => setShowTermsPolicies(true)}
        />

        {/* Accepted Interactions */}
        {(acceptedTours.length > 0 || acceptedCalls.length > 0) && (
          <View style={styles.acceptedSection}>
            <Text style={styles.sectionHeaderTitle}>Accepted Requests</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.acceptedScroll}>
              {acceptedCalls.map((req, idx) => (
                <View key={`owner-acc-call-${idx}`} style={styles.acceptedCard}>
                  <Ionicons name="call" size={16} color="#10B981" />
                  <View>
                    <Text style={styles.tenantName}>{req.other_name}</Text>
                    <Text style={styles.contactInfo}>{req.other_phone}</Text>
                  </View>
                </View>
              ))}
              {acceptedTours.map((req, idx) => (
                <View key={`owner-acc-tour-${idx}`} style={styles.acceptedCard}>
                  <Ionicons name="calendar" size={16} color={COLORS.primary} />
                  <View>
                    <Text style={styles.tenantName}>{req.other_name}</Text>
                    <Text style={styles.contactInfo}>{req.tour_date} • {req.tour_time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Personal Details Modal */}
      <Modal animationType="fade" transparent={true} visible={showPersonalDetails} onRequestClose={() => setShowPersonalDetails(false)}>
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
              <TouchableOpacity style={styles.editProfileBtnLarge} onPress={() => { setShowPersonalDetails(false); setEditData({ ...userData }); setShowEditProfile(true); }}>
                <Text style={styles.editProfileText}>Edit Details</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal animationType="fade" transparent={true} visible={showEditProfile} onRequestClose={() => setShowEditProfile(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.avatarEditContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarPlaceholderContainer}>
                <Image
                  source={editData.image ? { uri: editData.image } : { uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                  style={styles.avatarLarge}
                />
                <View style={styles.avatarOverlay}>
                  <Ionicons name="camera" size={24} color={COLORS.white} />
                  <Text style={styles.cameraText}>Change Photo</Text>
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.inputField}
                    value={editData.name}
                    onChangeText={(t) => setEditData({ ...editData, name: t })}
                    placeholder="Full Name"
                  />
                </View>
              </View>
              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.inputField}
                    value={editData.phone}
                    onChangeText={(t) => setEditData({ ...editData, phone: t })}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              <View style={[styles.editRow, { zIndex: 100 }]}>
                <Text style={styles.editLabel}>Location</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.inputField}
                    value={editData.location}
                    onChangeText={(t) => setEditData({ ...editData, location: t })}
                    placeholder="Search city or area"
                  />
                </View>
                {showPredictions && predictions.length > 0 && (
                  <View style={styles.predictionsModalList}>
                    {predictions.map((item) => (
                      <TouchableOpacity
                        key={item.placeId}
                        style={styles.predictionItem}
                        onPress={() => selectPlace(item)}
                      >
                        <Ionicons name="location-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 10 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.predictionMain} numberOfLines={1}>
                            {item.structuredFormat.mainText.text}
                          </Text>
                          <Text style={styles.predictionSub} numberOfLines={1}>
                            {item.structuredFormat.secondaryText.text}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.saveBtnLarge} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtnLarge, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 12 }]} onPress={() => setShowEditProfile(false)}>
                <Text style={[styles.saveBtnText, { color: COLORS.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <Modal animationType="fade" transparent={true} visible={showHelpSupport} onRequestClose={() => setShowHelpSupport(false)}>
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
              <TouchableOpacity style={[styles.editProfileBtnLarge, { backgroundColor: '#F1F5F9', marginTop: 24 }]}>
                <Text style={[styles.editProfileText, { color: COLORS.textPrimary }]}>Contact Support</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms & Policies Modal */}
      <Modal animationType="fade" transparent={true} visible={showTermsPolicies} onRequestClose={() => setShowTermsPolicies(false)}>
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
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingTop: 50,
    paddingBottom: SPACING.m,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  scrollContent: { paddingBottom: 100 },
  userName: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 },
  profileSection: { alignItems: 'center', backgroundColor: COLORS.white, paddingVertical: 24, marginHorizontal: 20, marginTop: 20, borderRadius: 20, ...LAYOUT.shadow, shadowOpacity: 0.05 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#EFF6FF' },
  avatarLarge: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F1F5F9' },
  avatarPlaceholderContainer: { position: 'relative' },
  avatarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  cameraText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  editBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3B82F6', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  userNameHeader: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
  roleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roleTag: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  roleText: { color: '#166534', fontSize: 12, fontWeight: '600' },
  locationText: { color: COLORS.textSecondary, fontSize: 14 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    ...LAYOUT.shadow,
    shadowOpacity: 0.05,
  },
  statValue: { fontSize: 18, fontWeight: "900", marginBottom: 4 },
  statLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "700" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 12, marginBottom: 8, ...LAYOUT.shadow, shadowOpacity: 0.05 },
  menuIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: "600" },
  menuSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  logoutBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 24,
  },
  logoutText: { color: COLORS.error, fontWeight: "bold", fontSize: 16 },
  acceptedSection: { marginTop: 20, marginHorizontal: 20 },
  sectionHeaderTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textSecondary, marginBottom: 12, textTransform: 'uppercase' },
  acceptedScroll: { gap: 10, paddingBottom: 5 },
  acceptedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 160,
    ...LAYOUT.shadow,
    shadowOpacity: 0.05
  },
  tenantName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  contactInfo: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 28, padding: 24, width: '85%', maxHeight: '80%', ...LAYOUT.shadow, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
  detailRow: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12 },
  detailLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4, textTransform: 'uppercase' },
  detailValue: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '500' },
  editProfileBtnLarge: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  editProfileText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  avatarEditContainer: { alignItems: 'center', marginBottom: 20 },
  editRow: { marginBottom: 20 },
  editLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 },
  inputField: { flex: 1, fontSize: 16, color: COLORS.textPrimary, paddingVertical: 0 },
  saveBtnLarge: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  sectionHeaderInner: { fontSize: 14, fontWeight: 'bold', color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  infoText: { fontSize: 14, color: COLORS.textPrimary, marginBottom: 4 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
  instructionText: { fontSize: 14, color: COLORS.textPrimary, flex: 1, lineHeight: 20 },
  legalText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22, marginBottom: 16 },
  predictionsModalList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 8,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 5,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  predictionMain: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  predictionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
