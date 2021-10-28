import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { api } from '../services/api';

const CLIENT_ID = '97ff4a9ca798330aae41';
const SCOPE = 'read:user';
const USER_STORAGE = '@DOWHILE:USER';
const TOKEN_STORAGE = '@DOWHILE:TOKEN';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
};


type AuthResponse = {
  token: string;
  user: User;
};

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  };
  type?: string;
};

export const useAuth = () => useContext(AuthContext);

type AuthContextData = {
  user: User | null;
  isSigning: boolean;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;

  const [isSigning, setIsSigning] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

      if (userStorage && tokenStorage) {
        api.defaults.headers.common.Authorization = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage));
      }

      setIsSigning(false);
    }

    loadUserStorageData();
  }, []);

  async function signIn() {
    setIsSigning(true);

    try {
      const response = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if (response?.type === 'success' && response.params.error !== 'access_denied') {
        const { data } = await api.post<AuthResponse>('/authenticate', { code: response.params.code });

        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(data.user));
        await AsyncStorage.setItem(TOKEN_STORAGE, data.token);

        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigning(false);
    }
  }

  async function signOut() {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE);
    await AsyncStorage.removeItem(TOKEN_STORAGE);
  }

  return (
    <AuthContext.Provider value={{ isSigning, signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}