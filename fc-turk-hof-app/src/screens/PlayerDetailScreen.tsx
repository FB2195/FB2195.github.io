import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import ScreenContainer from '../components/ScreenContainer';
import { PLAYERS, teamName } from '../data/mockData';
import { MoreStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<MoreStackParamList, 'PlayerDetail'>;

const PlayerDetailScreen: React.FC<Props> = ({ route }) => {
  const player = PLAYERS.find((p) => p.id === route.params.playerId);

  if (!player) {
    return (
      <ScreenContainer>
        <Text>Spieler nicht gefunden.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{player.initials}</Text>
        </View>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.position}>{player.position} · #{player.number}</Text>
        <Text style={styles.team}>{teamName(player.teamId)} · Jahrgang {player.birthYear}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox label="Spiele" value={player.stats.games} />
        <StatBox label="Tore" value={player.stats.goals} />
        <StatBox label="Vorlagen" value={player.stats.assists} />
      </View>
    </ScreenContainer>
  );
};

const StatBox: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <Card style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Card>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  position: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  team: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
});

export default PlayerDetailScreen;
