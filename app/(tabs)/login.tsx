import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password.trim() === '123@456') {
      Alert.alert('Success', 'Login Successful!', [
        { text: 'OK', onPress: () => router.replace('/role-selection') },
      ]);
    } else {
      Alert.alert('Error', 'Come up with Correct password!');
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#222222', '#2c2c2c']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Log In</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Welcome Back to{'\n'}
          <Text style={styles.titleHighlight}> Smart Living</Text>
        </Text>

        {/* Card */}
        <View style={styles.loginCard}>
          <Text style={styles.label}>Email</Text>

          <View style={styles.inputBox}>
            <Feather name="mail" size={18} color="#9aa4b2" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9aa4b2"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Password</Text>

          <View style={styles.inputBox}>
            <Feather name="lock" size={18} color="#9aa4b2" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#9aa4b2"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Login</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.footerText}>
            By logging in, you agree to our
            <Text style={styles.link}> Terms & Conditions</Text> and
            <Text style={styles.link}> Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  titleHighlight: {
    color: '#60a5fa',
    fontWeight: '800',
  },
  loginCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 10,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 54,
    marginBottom: 16,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  link: {
    color: '#60a5fa',
    fontWeight: '600',
  },
});
