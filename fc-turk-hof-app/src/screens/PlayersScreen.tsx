import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import ScreenContainer from '../components/ScreenContainer';
import { PLAYERS, TEAMS } from '../data/mockData';
import { MoreStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { TeamId } from '../types';

const teamsWithPlayers = TEAMS.filter((t) => PLAYERS.some((p) => p.teamId === t.id));

type Props = NativeStackScreenProps<MoreStackParamList, 'Players'>;

const PlayersScreen: React.FC<Props> = ({ navigation }) => {
  const [teamFilter, setTeamFilter] = useState<TeamId>(teamsWithPlayers[0]?.id ?? 'herren1');

  const players = useMemo(
    () => PLAYERS.filter((p) => p.teamId === teamFilter).sort((a, b) => a.number - b.number),
    [teamFilter]
  );

  return (
    <ScreenContainer>
      <View style={styles.chipRow}>
        {teamsWithPlayers.map((t) => (
          <Chip key={t.id} label={t.name} selected={teamFilter === t.id} onPress={() => setTeamFilter(t.id)} />
        ))}
      </View>

      {players.length === 0 ? (
        <EmptyState title="Keine Spieler in diesem Team hinterlegt" />
      ) : (
        players.map((player) => (
          <TouchableOpacity key={player.id} onPress={() => navigation.navigate('PlayerDetail', { playerId: player.id })}>
            <Card style={styles.card}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{player.number}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{player.name}</Text>
                <Text style={styles.position}>{player.position}</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{player.initials}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  position: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default PlayersScreen;
