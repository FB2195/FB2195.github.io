import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { roleColors } from '../theme/colors';
import { Role } from '../types';

export const ROLE_LABELS: Record<Role, string> = {
  spieler: 'Spieler',
  fan: 'Fan',
  funktionaer: 'Funktionär',
};

const SingleBadge: React.FC<{ role: Role }> = ({ role }) => {
  const color = roleColors[role];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{ROLE_LABELS[role]}</Text>
    </View>
  );
};

/** Zeigt eine oder mehrere Rollen-Badges nebeneinander an (umbrechend). */
const RoleBadge: React.FC<{ roles: Role[] }> = ({ roles }) => (
  <View style={styles.row}>
    {roles.map((role) => (
      <SingleBadge key={role} role={role} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default RoleBadge;
