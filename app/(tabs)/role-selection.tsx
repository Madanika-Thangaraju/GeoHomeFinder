import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#0f0c1d', '#15112b', '#1b1f3b']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select Role</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Continue as{'\n'}
        <Text style={styles.highlight}>Who are you?</Text>
      </Text>

      {/* Owner Card */}
      <TouchableOpacity
        style={styles.roleCard}
        onPress={() => router.replace('/owner-dashboard')}
      >
        <View style={styles.iconCircle}>
          <Feather name="home" size={26} color="#38bdf8" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.roleTitle}>Property Owner</Text>
          <Text style={styles.roleDesc}>
            Manage properties, listings & renters
          </Text>
        </View>

        <Feather name="chevron-right" size={22} color="#94a3b8" />
      </TouchableOpacity>

      {/* Tenant Card */}
      <TouchableOpacity
        style={styles.roleCard}
        onPress={() => router.replace('/tenant-dashboard')}
      >
        <View style={styles.iconCircle}>
          <Feather name="user" size={26} color="#22c55e" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.roleTitle}>Tenant / Renter</Text>
          <Text style={styles.roleDesc}>
            Browse homes & contact owners
          </Text>
        </View>

        <Feather name="chevron-right" size={22} color="#94a3b8" />
      </TouchableOpacity>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.bottomText}>
          Discover the best homes in your area.
        </Text>
        {/* <Image
          source={{ uri: 'https://img.icons8.com/ios-filled/200/ffffff/house.png' }}
          style={styles.bottomImage}
          resizeMode="contain"
        /> */}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 50,
  },

  highlight: {
    color: '#38bdf8',
  },

  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  roleDesc: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },

  bottomSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingBottom: 40,
  },

  bottomText: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

//   bottomImage: {
//     width: 120,
//     height: 120,
//     opacity: 0.5,
//   },
});
