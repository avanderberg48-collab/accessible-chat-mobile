import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  AccessibilityInfo,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Conversation } from '../types';

export default function ChatScreen({ navigation }: any) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await api.getConversations();
      setConversations(data);
      await AccessibilityInfo.announceForAccessibility(
        `Loaded ${data.length} conversations`
      );
    } catch (error) {
      console.error('Failed to load conversations', error);
      await AccessibilityInfo.announceForAccessibility('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const handleConversationPress = (conversation: Conversation) => {
    navigation.navigate('ConversationDetail', {
      conversationId: conversation.id,
      conversationName: conversation.name || 'Chat',
    });
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.name || 'Chat'} conversation`}
      accessibilityHint={`${item.lastMessage?.content || 'No messages'} - ${
        item.unreadCount > 0 ? `${item.unreadCount} unread` : 'All read'
      }`}
    >
      <View style={styles.conversationContent}>
        <Text style={styles.conversationName} numberOfLines={1}>
          {item.name || 'Direct Message'}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage?.content || 'No messages yet'}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View
          style={styles.unreadBadge}
          accessible={true}
          accessibilityLabel={`${item.unreadCount} unread messages`}
        >
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MembersTab')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="New chat"
          accessibilityHint="Press to start a new conversation"
        >
          <Text style={styles.newChatButton}>+</Text>
        </TouchableOpacity>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>
            Start a new chat by selecting a member
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          accessible={true}
          accessibilityLabel="Conversations list"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  newChatButton: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    alignItems: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  unreadBadge: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});
