import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1a1a1a', '#222222', '#2c2c2c']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Feather name="map-pin" size={20} color="#00F2FE" />
        </View>
        <Text style={styles.logoText}>GEOHOME</Text>
      </View>

      <View style={styles.cardWrapper}>
        <ImageBackground
          source={require('@/assets/images/house.png')}
          style={styles.imageCard}
          imageStyle={styles.imageRadius}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.35)']}
            style={styles.imageOverlay}
          />
        </ImageBackground>
      </View>

      <View style={styles.textContent}>
        <Text style={styles.title}>
          Where comfort {'\n'}
          <Text style={styles.titleHighlight}>begins.</Text>
        </Text>

        <Text style={styles.quote}>
          Home is the starting place of love, hope, and dreams.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.modernButton}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/RegisterScreen')}
        >
          <View style={styles.centerContent}>
            <Feather name="user-plus" size={22} color="#00F2FE" />
            <Text style={styles.modernButtonText}>Create Account</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modernButton}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/login')}
        >
          <View style={styles.centerContent}>
            <Feather name="log-in" size={22} color="#A78BFA" />
            <Text style={styles.modernButtonText}>Log In</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 2,
    marginLeft: 10,
    fontSize: 14,
  },
  cardWrapper: {
    marginHorizontal: 24,
    height: 270,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    elevation: 6,
  },
  imageCard: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: 32,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textContent: {
    paddingHorizontal: 24,
    marginBottom: 22,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 36,
  },
  titleHighlight: {
    color: '#00F2FE',
  },
  quote: {
    marginTop: 12,
    fontSize: 16,
    color: '#aaa',
  },
  buttons: {
    paddingHorizontal: 24,
    gap: 16,
  },
  modernButton: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modernButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
