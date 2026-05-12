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
import api from '../services/api';

export default function ProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [statusMessage, setStatusMessage] = useState(user?.statusMessage || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(name, statusMessage);
      setSaveSuccess(true);
      await AccessibilityInfo.announceForAccessibility('Profile saved successfully');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
      await AccessibilityInfo.announceForAccessibility('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      accessible={true}
      accessibilityLabel="Profile screen"
    >
      <View style={styles.content}>
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="My Profile"
        >
          My Profile
        </Text>

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
            accessible={true}
            accessibilityLabel="Profile Information"
          >
            Profile Information
          </Text>

          <View style={styles.inputGroup}>
            <Text
              style={styles.label}
              accessible={true}
              accessibilityLabel="Display name"
            >
              Display Name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              editable={!isSaving}
              accessible={true}
              accessibilityLabel="Display name input"
              accessibilityHint="Enter your display name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={styles.label}
              accessible={true}
              accessibilityLabel="Status message"
            >
              Status Message
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What's on your mind?"
              placeholderTextColor="#9ca3af"
              value={statusMessage}
              onChangeText={setStatusMessage}
              multiline={true}
              numberOfLines={3}
              editable={!isSaving}
              accessible={true}
              accessibilityLabel="Status message input"
              accessibilityHint="Enter your status message"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'Unknown'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={handleSaveProfile}
          disabled={isSaving}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isSaving ? 'Saving' : 'Save profile'}
          accessibilityHint="Press to save your profile changes"
        >
          <Text style={styles.buttonText}>
            {saveSuccess ? '✓ Saved' : isSaving ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
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
});
