import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import RoleBadge from '../components/RoleBadge';
import { useAuth } from '../context/AuthContext';
import { MoreStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import ScreenContainer from '../components/ScreenContainer';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreMenu'>;

const MoreScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();

  const items: { label: string; icon: string; screen: keyof MoreStackParamList; visible: boolean }[] = [
    { label: 'Spielerprofile', icon: '🧑‍🤝‍🧑', screen: 'Players', visible: true },
    { label: 'Formulare', icon: '📝', screen: 'Forms', visible: true },
    { label: 'Umfragen', icon: '🗳️', screen: 'Surveys', visible: true },
    { label: 'Team-Kommunikation', icon: '💬', screen: 'Communication', visible: true },
    { label: 'Vereinsinfo', icon: 'ℹ️', screen: 'Vereinsinfo', visible: true },
    { label: 'Sponsoren', icon: '🤝', screen: 'Sponsoren', visible: true },
    { label: 'Einstellungen', icon: '⚙️', screen: 'Settings', visible: true },
  ];

  return (
    <ScreenContainer>
      <Card style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.avatarInitials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRole}>FC Türk Hof · Mitgliederbereich</Text>
          {user ? <RoleBadge roles={user.roles} /> : null}
        </View>
      </Card>

      {items
        .filter((i) => i.visible)
        .map((item) => (
          <TouchableOpacity key={item.label} onPress={() => navigation.navigate(item.screen as any)}>
            <Card style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </TouchableOpacity>
        ))}
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  userRole: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
  },
});

export default MoreScreen;
