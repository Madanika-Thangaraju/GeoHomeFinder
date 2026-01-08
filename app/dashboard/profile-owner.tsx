import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../src/constants/theme";
import {
  getProfile,
  togglePushNotification,
  updateProfile,
} from "../../src/services/service";

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
    memberSince: "",
    role: "Owner",
  });

  const [editData, setEditData] = useState(userData);

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
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load profile");
    }
  };

  // ---------- SAVE PROFILE ----------
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editData.name,
        phone: editData.phone,
        location: editData.location,
      });

      setUserData(editData);
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
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>

        <View style={styles.statsContainer}>
          <StatItem value={stats.listings} label="LISTINGS" />
          <StatItem value={stats.views} label="VIEWS" />
          <StatItem value={stats.rating} label="RATING" rating />
        </View>

        <MenuItem
          icon="person"
          title="Personal Details"
          onPress={() => Alert.alert("Personal Details")}
        />

        <MenuItem
          icon="notifications"
          title="Push Notifications"
          hasSwitch
        />

        <MenuItem
          icon="help-circle"
          title="Help & Support"
          onPress={() => Alert.alert("Help & Support")}
        />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: { padding: 20 },
  userName: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "900", marginBottom: 4 },
  statLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "700" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 12 },
  menuIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: COLORS.white,
    marginBottom: 24,
  },
  logoutText: { color: COLORS.error, fontWeight: "bold", fontSize: 16 },
});
