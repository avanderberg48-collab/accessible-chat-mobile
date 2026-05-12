import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://blindchat-tgcrjvff.manus.space/api/trpc';

class APIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add token to requests
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async login(email: string, password: string) {
    try {
      const response = await this.api.post('/auth.login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      const response = await this.api.post('/auth.register', {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.api.query('/auth.me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Chat endpoints
  async getConversations() {
    try {
      const response = await this.api.query('/chat.listConversations');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getConversationMessages(conversationId: number, limit: number = 50) {
    try {
      const response = await this.api.query('/chat.getMessages', {
        conversationId,
        limit,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(conversationId: number, content: string, replyToId?: number) {
    try {
      const response = await this.api.mutation('/chat.sendMessage', {
        conversationId,
        content,
        replyToId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(messageId: number) {
    try {
      const response = await this.api.mutation('/chat.deleteMessage', {
        messageId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(conversationId: number, fileUri: string, fileName: string) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'application/octet-stream',
        name: fileName,
      } as any);
      formData.append('conversationId', conversationId.toString());

      const response = await this.api.post('/chat.uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadVoiceNote(
    conversationId: number,
    voiceNoteUri: string,
    duration: number
  ) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: voiceNoteUri,
        type: 'audio/m4a',
        name: `voice-note-${Date.now()}.m4a`,
      } as any);
      formData.append('conversationId', conversationId.toString());
      formData.append('duration', duration.toString());

      const response = await this.api.post('/chat.uploadVoiceNote', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // User endpoints
  async getUsers() {
    try {
      const response = await this.api.query('/user.listUsers');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async searchUsers(query: string) {
    try {
      const response = await this.api.query('/user.searchUsers', {
        query,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(name: string, statusMessage: string, avatarUrl?: string) {
    try {
      const response = await this.api.mutation('/user.updateProfile', {
        name,
        statusMessage,
        avatarUrl,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAccessibilitySettings(settings: any) {
    try {
      const response = await this.api.mutation(
        '/user.updateAccessibilitySettings',
        settings
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Voice call endpoints
  async initiateCall(recipientId: number) {
    try {
      const response = await this.api.mutation('/voiceCall.initiateCall', {
        recipientId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async answerCall(callId: number) {
    try {
      const response = await this.api.mutation('/voiceCall.answerCall', {
        callId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async endCall(callId: number) {
    try {
      const response = await this.api.mutation('/voiceCall.endCall', {
        callId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new APIService();
