import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppUser, FunktionaerBereich, Role, TeamId } from '../types';
import { ensureNotificationPermission } from '../utils/notifications';

const STORAGE_KEY = '@fctuerkhof/user';

export interface LoginInput {
  name: string;
  role: Role;
  teamId?: TeamId;
  isParentOfYouth?: boolean;
  childName?: string;
  parentTeamId?: TeamId;
  bereich?: FunktionaerBereich;
  coachedTeamIds?: TeamId[];
}

interface AuthContextValue {
  user: AppUser | null;
  isReady: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  isSeniorPlayer: boolean;
  isYouthPlayer: boolean;
  isYouthParent: boolean;
  isFunktionaer: boolean;
  isTrainer: boolean;
  isJugendleiter: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setUser(JSON.parse(raw));
        }
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const login = async (input: LoginInput) => {
    const newUser: AppUser = {
      id: `${Date.now()}`,
      name: input.name.trim(),
      role: input.role,
      teamId: input.teamId,
      isParentOfYouth: input.isParentOfYouth,
      childName: input.childName,
      parentTeamId: input.parentTeamId,
      bereich: input.bereich,
      coachedTeamIds: input.coachedTeamIds,
      avatarInitials: initials(input.name),
    };
    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    // Berechtigung für lokale Benachrichtigungen auf diesem Gerät anfragen.
    ensureNotificationPermission();
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(() => {
    const isSeniorPlayer = user?.role === 'spieler' && user.teamId === 'herren1';
    const isYouthPlayer = user?.role === 'spieler' && !!user.teamId && user.teamId !== 'herren1';
    const isYouthParent = user?.role === 'fan' && !!user.isParentOfYouth;
    const isFunktionaer = user?.role === 'funktionaer';
    const isTrainer = isFunktionaer && user?.bereich === 'trainer';
    const isJugendleiter = isFunktionaer && user?.bereich === 'jugendleiter';
    return {
      user,
      isReady,
      login,
      logout,
      isSeniorPlayer,
      isYouthPlayer,
      isYouthParent,
      isFunktionaer,
      isTrainer,
      isJugendleiter,
    };
  }, [user, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  return ctx;
};
