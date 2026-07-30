import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppUser, FunktionaerBereich, Role, TeamId } from '../types';
import { ensureNotificationPermission } from '../utils/notifications';

const STORAGE_KEY = '@fctuerkhof/user';

export interface LoginInput {
  name: string;
  roles: Role[];
  email: string;
  phone: string;
  birthDate: string;
  street: string;
  postalCode: string;
  city: string;
  teamId?: TeamId;
  isParentOfYouth?: boolean;
  childName?: string;
  parentTeamId?: TeamId;
  bereich?: FunktionaerBereich;
  coachedTeamIds?: TeamId[];
}

export type ProfileUpdateInput = Partial<
  Pick<AppUser, 'name' | 'email' | 'phone' | 'birthDate' | 'street' | 'postalCode' | 'city'>
>;

interface AuthContextValue {
  user: AppUser | null;
  isReady: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: ProfileUpdateInput) => Promise<void>;
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
      roles: input.roles,
      email: input.email.trim(),
      phone: input.phone.trim(),
      birthDate: input.birthDate.trim(),
      street: input.street.trim(),
      postalCode: input.postalCode.trim(),
      city: input.city.trim(),
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

  const updateProfile = async (input: ProfileUpdateInput) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next: AppUser = {
        ...prev,
        ...input,
        avatarInitials: input.name ? initials(input.name) : prev.avatarInitials,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<AuthContextValue>(() => {
    const roles = user?.roles ?? [];
    const isSeniorPlayer = roles.includes('spieler') && user?.teamId === 'herren1';
    const isYouthPlayer = roles.includes('spieler') && !!user?.teamId && user.teamId !== 'herren1';
    const isYouthParent = roles.includes('fan') && !!user?.isParentOfYouth;
    const isFunktionaer = roles.includes('funktionaer');
    const isTrainer = isFunktionaer && user?.bereich === 'trainer';
    const isJugendleiter = isFunktionaer && user?.bereich === 'jugendleiter';
    return {
      user,
      isReady,
      login,
      logout,
      updateProfile,
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
