import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  AccessibilityInfo,
  Switch,
  Slider,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderVerbosity, setScreenReaderVerbosity] = useState<'minimal' | 'normal' | 'verbose'>('normal');
  const [announceTyping, setAnnounceTyping] = useState(true);
  const [audioNotifications, setAudioNotifications] = useState(true);
  const [notificationVolume, setNotificationVolume] = useState(50);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await api.updateAccessibilitySettings({
        fontSize,
        highContrast,
        screenReaderVerbosity,
        announceTyping,
        audioNotifications,
        notificationVolume,
      });
      await AccessibilityInfo.announceForAccessibility('Settings saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save settings');
      await AccessibilityInfo.announceForAccessibility('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
            await AccessibilityInfo.announceForAccessibility('Logged out successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      accessible={true}
      accessibilityLabel="Settings screen"
    >
      <View style={styles.content}>
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Settings"
        >
          Settings
        </Text>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
            accessible={true}
            accessibilityLabel="Appearance"
          >
            Appearance
          </Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Font Size</Text>
              <Text style={styles.settingDescription}>
                Choose your preferred text size
              </Text>
            </View>
          </View>

          <View style={styles.fontSizeButtons}>
            {(['small', 'normal', 'large', 'extra-large'] as const).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  fontSize === size && styles.fontSizeButtonActive,
                ]}
                onPress={() => {
                  setFontSize(size);
                  AccessibilityInfo.announceForAccessibility(`Font size set to ${size}`);
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Font size ${size}`}
                accessibilityState={{ selected: fontSize === size }}
              >
                <Text
                  style={[
                    styles.fontSizeButtonText,
                    fontSize === size && styles.fontSizeButtonTextActive,
                  ]}
                >
                  {size.charAt(0).toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>High Contrast</Text>
              <Text style={styles.settingDescription}>
                Increase contrast for better visibility
              </Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={(value) => {
                setHighContrast(value);
                AccessibilityInfo.announceForAccessibility(
                  `High contrast ${value ? 'enabled' : 'disabled'}`
                );
              }}
              accessible={true}
              accessibilityLabel="High contrast mode"
              accessibilityRole="switch"
            />
          </View>
        </View>

        {/* Screen Reader Section */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
            accessible={true}
            accessibilityLabel="Screen Reader"
          >
            Screen Reader
          </Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Verbosity</Text>
              <Text style={styles.settingDescription}>
                Control announcement detail level
              </Text>
            </View>
          </View>

          {(['minimal', 'normal', 'verbose'] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={styles.radioItem}
              onPress={() => {
                setScreenReaderVerbosity(level);
                AccessibilityInfo.announceForAccessibility(
                  `Verbosity set to ${level}`
                );
              }}
              accessible={true}
              accessibilityRole="radio"
              accessibilityLabel={`Verbosity ${level}`}
              accessibilityState={{ selected: screenReaderVerbosity === level }}
            >
              <View
                style={[
                  styles.radio,
                  screenReaderVerbosity === level && styles.radioSelected,
                ]}
              />
              <View style={styles.radioContent}>
                <Text style={styles.radioLabel}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
                <Text style={styles.radioDescription}>
                  {level === 'minimal' && 'Only essential information'}
                  {level === 'normal' && 'Standard announcements'}
                  {level === 'verbose' && 'Detailed announcements'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Announce Typing</Text>
              <Text style={styles.settingDescription}>
                Hear when others are typing
              </Text>
            </View>
            <Switch
              value={announceTyping}
              onValueChange={(value) => {
                setAnnounceTyping(value);
                AccessibilityInfo.announceForAccessibility(
                  `Typing announcements ${value ? 'enabled' : 'disabled'}`
                );
              }}
              accessible={true}
              accessibilityLabel="Announce typing"
              accessibilityRole="switch"
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
            accessible={true}
            accessibilityLabel="Notifications"
          >
            Notifications
          </Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Audio Notifications</Text>
              <Text style={styles.settingDescription}>
                Play sound cues for messages and calls
              </Text>
            </View>
            <Switch
              value={audioNotifications}
              onValueChange={(value) => {
                setAudioNotifications(value);
                AccessibilityInfo.announceForAccessibility(
                  `Audio notifications ${value ? 'enabled' : 'disabled'}`
                );
              }}
              accessible={true}
              accessibilityLabel="Audio notifications"
              accessibilityRole="switch"
            />
          </View>

          {audioNotifications && (
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>
                  Volume: {notificationVolume}%
                </Text>
                <Text style={styles.settingDescription}>
                  Adjust notification volume
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={notificationVolume}
                onValueChange={(value) => setNotificationVolume(Math.round(value))}
                accessible={true}
                accessibilityLabel="Notification volume"
                accessibilityRole="adjustable"
              />
            </View>
          )}
        </View>

        {/* Save and Logout */}
        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={handleSaveSettings}
          disabled={isSaving}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isSaving ? 'Saving' : 'Save settings'}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
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
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  fontSizeButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  fontSizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  fontSizeButtonTextActive: {
    color: '#2563eb',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  radioDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  slider: {
    width: 100,
    height: 40,
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
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
