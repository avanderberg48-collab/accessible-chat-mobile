import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      await AccessibilityInfo.announceForAccessibility('Registration successful');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
      await AccessibilityInfo.announceForAccessibility('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      accessible={true}
      accessibilityLabel="Registration screen"
    >
      <View style={styles.content}>
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Create Account"
        >
          Create Account
        </Text>

        <Text
          style={styles.subtitle}
          accessible={true}
          accessibilityLabel="Join AccessChat today"
        >
          Join AccessChat Today
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text
              style={styles.label}
              accessible={true}
              accessibilityLabel="Full name"
            >
              Full Name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
              accessible={true}
              accessibilityLabel="Full name input field"
              accessibilityHint="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={styles.label}
              accessible={true}
              accessibilityLabel="Email address"
            >
              Email
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
              accessible={true}
              accessibilityLabel="Email input field"
              accessibilityHint="Enter your email address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={styles.label}
              accessible={true}
              accessibilityLabel="Password"
            >
              Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              editable={!isLoading}
              accessible={true}
              accessibilityLabel="Password input field"
              accessibilityHint="Enter your password, minimum 6 characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={styles.label}
              accessible={true}
              accessibilityLabel="Confirm password"
            >
              Confirm Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              editable={!isLoading}
              accessible={true}
              accessibilityLabel="Confirm password input field"
              accessibilityHint="Confirm your password"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isLoading ? 'Creating account' : 'Register button'}
            accessibilityHint="Press to create your account"
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go to login"
            accessibilityHint="Press to go to login screen"
          >
            <Text style={styles.link}>
              Already have an account? <Text style={styles.linkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
  linkBold: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
