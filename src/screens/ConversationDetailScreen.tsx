import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  AccessibilityInfo,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Message } from '../types';

export default function ConversationDetailScreen({
  route,
  navigation,
}: any) {
  const { user } = useAuth();
  const { conversationId, conversationName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      title: conversationName,
    });
    loadMessages();
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await api.getConversationMessages(conversationId);
      setMessages(data);
      await AccessibilityInfo.announceForAccessibility(
        `Loaded ${data.length} messages`
      );
    } catch (error) {
      console.error('Failed to load messages', error);
      await AccessibilityInfo.announceForAccessibility('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const tempMessage = messageText;
    setMessageText('');
    setIsSending(true);

    try {
      const newMessage = await api.sendMessage(conversationId, tempMessage);
      setMessages([...messages, newMessage]);
      flatListRef.current?.scrollToEnd({ animated: true });
      await AccessibilityInfo.announceForAccessibility('Message sent');
    } catch (error) {
      console.error('Failed to send message', error);
      setMessageText(tempMessage);
      await AccessibilityInfo.announceForAccessibility('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await api.deleteMessage(messageId);
      setMessages(messages.filter((m) => m.id !== messageId));
      await AccessibilityInfo.announceForAccessibility('Message deleted');
    } catch (error) {
      console.error('Failed to delete message', error);
      await AccessibilityInfo.announceForAccessibility('Failed to delete message');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === user?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage && styles.ownMessageContainer,
        ]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Message from ${item.sender.name || 'Unknown'}`}
        accessibilityHint={`${item.content} - ${new Date(
          item.createdAt
        ).toLocaleTimeString()}`}
      >
        {!isOwnMessage && (
          <Text style={styles.senderName}>{item.sender.name}</Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isOwnMessage && styles.ownMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage && styles.ownMessageText,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isOwnMessage && styles.ownMessageTime,
            ]}
          >
            {new Date(item.createdAt).toLocaleTimeString()}
          </Text>
        </View>
        {isOwnMessage && (
          <TouchableOpacity
            onPress={() => handleDeleteMessage(item.id)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Delete message"
            accessibilityHint="Press to delete this message"
          >
            <Text style={styles.deleteButton}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        accessible={true}
        accessibilityLabel="Messages list"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          value={messageText}
          onChangeText={setMessageText}
          multiline={true}
          editable={!isSending}
          accessible={true}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message here"
        />
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={isSending || !messageText.trim()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isSending ? 'Sending' : 'Send message'}
          accessibilityHint="Press to send your message"
        >
          <Text style={styles.sendButtonText}>
            {isSending ? '...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  ownMessageBubble: {
    backgroundColor: '#2563eb',
  },
  messageText: {
    fontSize: 14,
    color: '#1f2937',
  },
  ownMessageText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  ownMessageTime: {
    color: '#dbeafe',
  },
  deleteButton: {
    fontSize: 20,
    color: '#ef4444',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
