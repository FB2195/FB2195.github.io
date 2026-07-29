import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import RoleBadge from '../components/RoleBadge';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { bereichLabel, teamName } from '../data/mockData';
import { colors } from '../theme/colors';
import { ensureNotificationPermission, notifyLocal } from '../utils/notifications';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [sendingTest, setSendingTest] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert('Abmelden', 'Möchtest du dich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Abmelden', style: 'destructive', onPress: () => logout() },
    ]);
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
        Alert.alert(
          'Keine Berechtigung',
          'Bitte erlaube Benachrichtigungen für diese App in den Handy-Einstellungen.'
        );
        return;
      }
      await notifyLocal('FC Türk Hof', `Test-Benachrichtigung für ${user.name}.`);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.avatarInitials}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <RoleBadge role={user.role} />
      </View>

      <Card>
        {user.role === 'spieler' && <Row label="Team" value={teamName(user.teamId)} last />}
        {user.role === 'fan' && user.isParentOfYouth && (
          <>
            <Row label="Kind" value={user.childName ?? '–'} />
            <Row label="Team des Kindes" value={teamName(user.parentTeamId)} last />
          </>
        )}
        {user.role === 'fan' && !user.isParentOfYouth && <Row label="Zugehörigkeit" value="Fan / Mitglied" last />}
        {user.role === 'funktionaer' && (
          <>
            <Row label="Bereich" value={bereichLabel(user.bereich)} last={user.bereich !== 'trainer'} />
            {user.bereich === 'trainer' && (
              <Row
                label="Trainiert"
                value={(user.coachedTeamIds ?? []).map((id) => teamName(id)).join(', ') || '–'}
                last
              />
            )}
          </>
        )}
      </Card>

      <PrimaryButton
        label="Test-Benachrichtigung senden"
        onPress={handleTestNotification}
        variant="secondary"
        loading={sendingTest}
        style={{ marginTop: 24 }}
      />
      <Text style={styles.notificationHint}>
        Testet nur lokale Benachrichtigungen auf diesem Gerät. Echte Push-Nachrichten zwischen unterschiedlichen
        Handys erfordern zusätzlich ein Backend.
      </Text>

      <PrimaryButton label="Abmelden" onPress={handleLogout} variant="outline" style={{ marginTop: 12 }} />
    </ScreenContainer>
  );
};

const Row: React.FC<{ label: string; value: string; last?: boolean }> = ({ label, value, last }) => (
  <View style={[styles.row, !last && styles.rowBorder]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  notificationHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
