import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignout: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, statusMessage: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.payload,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.payload,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'SET_USER':
          return {
            ...prevState,
            user: action.payload,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      user: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const user = await api.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: user });
        }
        dispatch({ type: 'RESTORE_TOKEN', payload: token });
      } catch (e) {
        console.error('Failed to restore token', e);
        dispatch({ type: 'RESTORE_TOKEN', payload: null });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    isSignout: state.isSignout,
    login: async (email: string, password: string) => {
      try {
        const response = await api.login(email, password);
        await AsyncStorage.setItem('userToken', response.token);
        dispatch({ type: 'SIGN_IN', payload: response.token });
        dispatch({ type: 'SET_USER', payload: response.user });
      } catch (error) {
        throw error;
      }
    },
    register: async (name: string, email: string, password: string) => {
      try {
        const response = await api.register(name, email, password);
        await AsyncStorage.setItem('userToken', response.token);
        dispatch({ type: 'SIGN_IN', payload: response.token });
        dispatch({ type: 'SET_USER', payload: response.user });
      } catch (error) {
        throw error;
      }
    },
    logout: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
      } catch (error) {
        throw error;
      }
    },
    updateProfile: async (name: string, statusMessage: string) => {
      try {
        const updatedUser = await api.updateProfile(name, statusMessage);
        dispatch({ type: 'SET_USER', payload: updatedUser });
      } catch (error) {
        throw error;
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
