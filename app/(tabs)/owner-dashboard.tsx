import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OwnerDashboardScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#0f0c1d', '#15112b', '#1b1f3b']}
      style={styles.container}
    >

      {/* TOP ARROWS */}
      <View style={styles.navArrows}>
        {/* BACK */}
        <TouchableOpacity onPress={() => router.back()} style={styles.arrowBtn}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        {/* FORWARD → change route path according to your app
        <TouchableOpacity onPress={() => router.push('/nextpage')} style={styles.arrowBtn}>
          <Feather name="arrow-right" size={22} color="#fff" />
        </TouchableOpacity> */}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>GEOHOME</Text>
          {/* <Text style={styles.location}></Text> */}
        </View>

        
      </View>

      {/* Welcome */}
      <Text style={styles.welcome}>Welcome back, Owner</Text>
      <Text style={styles.title}>
        Manage your{'\n'}
        <Text style={styles.highlight}>Real Estate Portfolio</Text>
      </Text>

      {/* Property Card */}
      <View style={styles.propertyCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
          }}
          style={styles.propertyImage}
        />

        <View style={styles.overlay}>
          {/* <Text style={styles.aiText}></Text> */}

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addText}>Add New Property</Text>
            <Feather name="arrow-right" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Call Request */}
      <View style={styles.callCard}>
        <View style={styles.callHeader}>
          <View style={styles.callIcon}>
            <Feather name="phone-call" size={18} color="#22c55e" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.callTitle}>Call Request from Renter</Text>
            <Text style={styles.callSub}>Greenfield Avenue, Unit 4B</Text>
          </View>

          <View style={styles.alertBadge}>
            <Text style={styles.alertText}>Action Required</Text>
          </View>
        </View>

        <View style={styles.callActions}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>View Request</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Feather name="phone" size={16} color="#000" />
            <Text style={styles.primaryText}>Call Back Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      Stats
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Feather name="home" size={20} color="#a855f7" />
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>

        <View style={styles.statCard}>
          <Feather name="trending-up" size={20} color="#38bdf8" />
          <Text style={styles.statNumber}>+14%</Text>
          <Text style={styles.statLabel}>Views this week</Text>
        </View>
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

  /* Added Arrows Row */
  navArrows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  arrowBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },

//   location: {
//     color: '#94a3b8',
//     marginTop: 4,
//   },

//   notification: {
//     position: 'relative',
//     padding: 10,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.08)',
//   },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  welcome: {
    color: '#94a3b8',
    marginTop: 6,
  },

 title: {
  fontSize: 30,
  fontWeight: '800',
  color: '#fff',
  marginBottom: 8, // ⬅ reduced (was 20)
},


  highlight: {
    color: '#38bdf8',
  },

  propertyCard: {
  borderRadius: 26,
  overflow: 'hidden',
  marginBottom: 28,
  marginTop: -6, // ⬅ lifts content slightly upward
},


  propertyImage: {
    width: '100%',
    height: 200,
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

//   aiText: {
//     color: '#e5e7eb',
//     marginBottom: 12,
//   },

  addButton: {
    backgroundColor: '#22d3ee',
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  addText: {
    fontWeight: '700',
    fontSize: 15,
  },

  callCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  callIcon: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    padding: 10,
    borderRadius: 20,
  },

  callTitle: {
    color: '#fff',
    fontWeight: '700',
  },

  callSub: {
    color: '#94a3b8',
    fontSize: 12,
  },

  alertBadge: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  alertText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },

  callActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },

  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryText: {
    color: '#fff',
    fontWeight: '600',
  },

  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  primaryText: {
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },

  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
});
