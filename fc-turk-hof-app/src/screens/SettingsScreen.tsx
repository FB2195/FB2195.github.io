import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { MoreStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { ensureNotificationPermission, notifyLocal } from '../utils/notifications';

const NOTIFICATIONS_KEY = '@fctuerkhof/notifications-enabled';

type Props = NativeStackScreenProps<MoreStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_KEY).then((raw) => {
      if (raw !== null) setNotificationsEnabled(raw === 'true');
    });
  }, []);

  if (!user) return null;

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, value ? 'true' : 'false');
    if (value) ensureNotificationPermission();
  };

  const handleTestNotification = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Nicht verfügbar', 'Benachrichtigungen funktionieren nur in der mobilen App, nicht im Web.');
      return;
    }
    setSendingTest(true);
    try {
      const granted = await ensureNotificationPermission();
      if (!granted) {
        Alert.alert('Keine Berechtigung', 'Bitte erlaube Benachrichtigungen für diese App in den Handy-Einstellungen.');
        return;
      }
      await notifyLocal('FC Türk Hof', `Test-Benachrichtigung für ${user.name}.`);
    } finally {
      setSendingTest(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Abmelden', 'Möchtest du dich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Abmelden', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScreenContainer>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Card style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatarInitials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userSub}>{user.email}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Card>
      </TouchableOpacity>

      <SectionHeader title="Benachrichtigungen" />
      <Card style={{ marginBottom: 12 }}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Benachrichtigungen aktiviert</Text>
            <Text style={styles.switchHint}>Für neue Termine und Mitteilungen auf diesem Gerät.</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </Card>
      <PrimaryButton
        label="Test-Benachrichtigung senden"
        onPress={handleTestNotification}
        variant="secondary"
        loading={sendingTest}
        disabled={!notificationsEnabled}
      />
      <Text style={styles.notificationHint}>
        Testet nur lokale Benachrichtigungen auf diesem Gerät. Echte Push-Nachrichten zwischen unterschiedlichen
        Handys erfordern zusätzlich ein Backend.
      </Text>

      <SectionHeader title="Verein" />
      <TouchableOpacity onPress={() => navigation.navigate('Vereinsinfo')}>
        <Card style={styles.menuItem}>
          <Text style={styles.menuLabel}>Vereinsinfo</Text>
          <Text style={styles.chevron}>›</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Sponsoren')}>
        <Card style={styles.menuItem}>
          <Text style={styles.menuLabel}>Sponsoren</Text>
          <Text style={styles.chevron}>›</Text>
        </Card>
      </TouchableOpacity>

      <PrimaryButton label="Abmelden" onPress={handleLogout} variant="outline" style={{ marginTop: 24 }} />

      <Text style={styles.footer}>FC Türk Hof · Vereins-App{'\n'}Version 1.0.0</Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  userSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  switchHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },
  notificationHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});

export default SettingsScreen;
