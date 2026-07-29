import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import RoleBadge from '../components/RoleBadge';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { teamName } from '../data/mockData';
import { colors } from '../theme/colors';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert('Abmelden', 'Möchtest du dich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Abmelden', style: 'destructive', onPress: () => logout() },
    ]);
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
        {user.role === 'spieler' && <Row label="Team" value={teamName(user.teamId)} />}
        {user.role === 'fan' && (
          <Row
            label="Zugehörigkeit"
            value={user.isParentOfYouth ? `Elternteil · ${teamName(user.parentTeamId)}` : 'Fan / Mitglied'}
          />
        )}
        {user.role === 'funktionaer' && <Row label="Bereich" value={user.bereich ?? '–'} last />}
      </Card>

      <PrimaryButton label="Abmelden" onPress={handleLogout} variant="outline" style={{ marginTop: 24 }} />
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
});

export default ProfileScreen;
