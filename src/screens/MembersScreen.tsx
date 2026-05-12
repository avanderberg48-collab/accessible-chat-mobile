import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  AccessibilityInfo,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User } from '../types';

export default function MembersScreen({ navigation }: any) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      AccessibilityInfo.announceForAccessibility(
        `Found ${filtered.length} members`
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getUsers();
      const otherUsers = data.filter((u: User) => u.id !== user?.id);
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
      await AccessibilityInfo.announceForAccessibility(
        `Loaded ${otherUsers.length} members`
      );
    } catch (error) {
      console.error('Failed to load users', error);
      await AccessibilityInfo.announceForAccessibility('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (selectedUser: User) => {
    try {
      const conversation = await api.getOrCreateDirect(selectedUser.id);
      navigation.navigate('ConversationDetail', {
        conversationId: conversation.id,
        conversationName: selectedUser.name || 'Chat',
      });
    } catch (error) {
      console.error('Failed to start chat', error);
      await AccessibilityInfo.announceForAccessibility('Failed to start chat');
    }
  };

  const handleCall = async (selectedUser: User) => {
    try {
      await api.initiateCall(selectedUser.id);
      await AccessibilityInfo.announceForAccessibility(
        `Calling ${selectedUser.name}`
      );
    } catch (error) {
      console.error('Failed to initiate call', error);
      await AccessibilityInfo.announceForAccessibility('Failed to initiate call');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View
      style={styles.userItem}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${item.name || 'Unknown'} - ${
        item.isOnline ? 'Online' : 'Offline'
      }`}
      accessibilityHint={item.statusMessage || 'No status'}
    >
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.name || 'Unknown User'}</Text>
          <View
            style={[
              styles.statusIndicator,
              item.isOnline && styles.statusOnline,
            ]}
            accessible={true}
            accessibilityLabel={item.isOnline ? 'Online' : 'Offline'}
          />
        </View>
        {item.statusMessage && (
          <Text style={styles.statusMessage} numberOfLines={1}>
            {item.statusMessage}
          </Text>
        )}
        <Text style={styles.email}>{item.email}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleStartChat(item)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Message ${item.name}`}
          accessibilityHint="Press to start a chat"
        >
          <Text style={styles.actionButtonText}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(item)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Call ${item.name}`}
          accessibilityHint="Press to initiate a voice call"
        >
          <Text style={styles.actionButtonText}>📞</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Members</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessible={true}
          accessibilityLabel="Search members"
          accessibilityHint="Type to search for members by name or email"
        />
      </View>

      {filteredUsers.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No members found' : 'No members available'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
          accessible={true}
          accessibilityLabel="Members list"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  userItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
    marginLeft: 8,
  },
  statusOnline: {
    backgroundColor: '#10b981',
  },
  statusMessage: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
