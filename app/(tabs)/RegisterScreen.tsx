import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [role, setRole] = useState<'owner' | 'tenant' | null>(null);
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#222222', '#2c2c2c']} // SAME as HomeScreen
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Feather name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign Up</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* ROLE CARD */}
          <View style={styles.roleTopCard}>
            <Text style={styles.roleTitle}>Continue as</Text>

            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'owner' && styles.roleActive,
                ]}
                onPress={() => setRole('owner')}
              >
                <Feather
                  name="home"
                  size={18}
                  color={role === 'owner' ? '#fff' : '#cbd5e1'}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'owner' && styles.roleTextActive,
                  ]}
                >
                  Owner
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'tenant' && styles.roleActive,
                ]}
                onPress={() => setRole('tenant')}
              >
                <Feather
                  name="user"
                  size={18}
                  color={role === 'tenant' ? '#fff' : '#cbd5e1'}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'tenant' && styles.roleTextActive,
                  ]}
                >
                  Tenant
                </Text>
              </TouchableOpacity>
            </View>
          </View>

         {/* Titles */}
<Text style={styles.title}>
  Join the Future of {'\n'}
  <Text style={styles.titleHighlight}> Living</Text>
</Text>

          {/* <Text style={styles.subtitle}>
            Start your journey in Coimbatore today.
          </Text> */}

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputBox}>
            <Feather name="user" size={18} color="#9aa4b2" />
            <TextInput
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholderTextColor="#9aa4b2"
            />
          </View>

          {/* Email / Phone */}
          <Text style={styles.label}>Email or Phone Number</Text>
          <View style={styles.inputBox}>
            <Feather name="mail" size={18} color="#9aa4b2" />
            <TextInput
              placeholder="name@example.com"
              value={contact}
              onChangeText={setContact}
              style={styles.input}
              placeholderTextColor="#9aa4b2"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Feather name="lock" size={18} color="#9aa4b2" />
            <TextInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#9aa4b2"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={18}
                color="#9aa4b2"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputBox}>
            <Feather name="lock" size={18} color="#9aa4b2" />
            <TextInput
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholderTextColor="#9aa4b2"
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Feather
                name={showConfirm ? 'eye' : 'eye-off'}
                size={18}
                color="#9aa4b2"
              />
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgree(!agree)}
          >
            <View style={[styles.checkbox, agree && styles.checkboxActive]}>
              {agree && <Feather name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the
              <Text style={styles.link}> Terms & Conditions</Text> and
              <Text style={styles.link}> Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!role || !agree) && { opacity: 0.6 },
            ]}
            disabled={!role || !agree}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Already have an account?
            <Text style={styles.link}> Log In</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },

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
  titleHighlight: {
  color: '#60a5fa',  // or your preferred highlight color
  fontWeight: '800',
},


  roleTopCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 10,
  },

  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },

  roleButton: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  roleActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
  },

  roleTextActive: {
    color: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#cbd5e1',
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingHorizontal: 14,
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

  termsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  checkboxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
  },

  link: {
    color: '#60a5fa',
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: '#2563eb',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#cbd5e1',
  },
});
