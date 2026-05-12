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

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      await AccessibilityInfo.announceForAccessibility('Login successful');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please try again');
      await AccessibilityInfo.announceForAccessibility('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      accessible={true}
      accessibilityLabel="Login screen"
    >
      <View style={styles.content}>
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="AccessChat Login"
        >
          AccessChat
        </Text>

        <Text
          style={styles.subtitle}
          accessible={true}
          accessibilityLabel="Accessible chat application for blind users"
        >
          Accessible Chat for Everyone
        </Text>

        <View style={styles.form}>
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
              accessibilityHint="Enter your password"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isLoading ? 'Logging in' : 'Login button'}
            accessibilityHint="Press to log in to your account"
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Create new account"
            accessibilityHint="Press to go to registration screen"
          >
            <Text style={styles.link}>
              Don't have an account? <Text style={styles.linkBold}>Register</Text>
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
