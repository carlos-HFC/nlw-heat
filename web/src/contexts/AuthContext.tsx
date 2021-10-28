import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { api } from '../services/api';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
};

type AuthContextData = {
  user: User | null;
  signInURL: string;
  signOut(): void;
};

type AuthProviderProps = {
  children: ReactNode;
};

type Auth = {
  token: string;
  user: User;
};

export const useAuth = () => useContext(AuthContext);

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=${import.meta.env.VITE_APP_GITHUB_CLIENT_ID}`;

  const [user, setUser] = useState<User | null>(null);

  async function signIn(code: string) {
    const response = await api.post<Auth>('/authenticate', { code });

    const { token, user } = response.data;

    localStorage.setItem('@DOWHILE:TOKEN', token);

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@DOWHILE:TOKEN');
  }

  useEffect(() => {
    api.get<User>('/profile').then(response => setUser(response.data));
  }, []);

  useEffect(() => {
    const url = window.location.search;
    const params = new URLSearchParams(url);

    const code = params.get('code');

    if (code) {
      window.history.pushState({}, '', import.meta.env.BASE_URL);

      signIn(code);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInURL, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}