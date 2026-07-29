import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import ScreenContainer from '../components/ScreenContainer';
import { RESULTS, TABLE_HERREN1, TEAMS } from '../data/mockData';
import { colors } from '../theme/colors';
import { formatDateShort } from '../utils/date';
import { TeamId } from '../types';

type Tab = 'ergebnisse' | 'tabelle';

const teamsWithResults = TEAMS.filter((t) => RESULTS.some((r) => r.teamId === t.id));

const ResultsScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('ergebnisse');
  const [teamFilter, setTeamFilter] = useState<TeamId | 'alle'>('alle');

  const filteredResults = useMemo(
    () =>
      [...RESULTS]
        .filter((r) => teamFilter === 'alle' || r.teamId === teamFilter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [teamFilter]
  );

  return (
    <ScreenContainer>
      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[styles.segment, tab === 'ergebnisse' && styles.segmentActive]}
          onPress={() => setTab('ergebnisse')}
        >
          <Text style={[styles.segmentLabel, tab === 'ergebnisse' && styles.segmentLabelActive]}>Ergebnisse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, tab === 'tabelle' && styles.segmentActive]}
          onPress={() => setTab('tabelle')}
        >
          <Text style={[styles.segmentLabel, tab === 'tabelle' && styles.segmentLabelActive]}>Tabelle</Text>
        </TouchableOpacity>
      </View>

      {tab === 'ergebnisse' ? (
        <View>
          <View style={styles.chipRow}>
            <Chip label="Alle Teams" selected={teamFilter === 'alle'} onPress={() => setTeamFilter('alle')} />
            {teamsWithResults.map((t) => (
              <Chip key={t.id} label={t.name} selected={teamFilter === t.id} onPress={() => setTeamFilter(t.id)} />
            ))}
          </View>

          {filteredResults.length === 0 ? (
            <EmptyState title="Keine Ergebnisse vorhanden" />
          ) : (
            filteredResults.map((r) => {
              const won =
                (r.isHome && r.homeScore > r.awayScore) || (!r.isHome && r.awayScore > r.homeScore);
              const lost =
                (r.isHome && r.homeScore < r.awayScore) || (!r.isHome && r.awayScore < r.homeScore);
              return (
                <Card key={r.id} style={styles.resultCard}>
                  <View style={[styles.resultBar, won ? styles.win : lost ? styles.loss : styles.draw]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.competition}>{r.competition} · {formatDateShort(r.date)}</Text>
                    <View style={styles.matchRow}>
                      <Text style={styles.matchTeam} numberOfLines={1}>{r.homeTeam}</Text>
                      <Text style={styles.matchScore}>{r.homeScore} : {r.awayScore}</Text>
                      <Text style={[styles.matchTeam, styles.matchTeamRight]} numberOfLines={1}>{r.awayTeam}</Text>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      ) : (
        <Card style={{ padding: 0 }}>
          <Text style={styles.tableTitle}>Kreisliga · 1. Mannschaft</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colPos]}>#</Text>
            <Text style={[styles.th, styles.colClub]}>Verein</Text>
            <Text style={[styles.th, styles.colNum]}>Sp</Text>
            <Text style={[styles.th, styles.colNum]}>Tore</Text>
            <Text style={[styles.th, styles.colNum]}>Pkt</Text>
          </View>
          {TABLE_HERREN1.map((row) => (
            <View key={row.club} style={[styles.tableRow, row.isOwnTeam && styles.tableRowOwn]}>
              <Text style={[styles.td, styles.colPos]}>{row.position}</Text>
              <Text style={[styles.td, styles.colClub, row.isOwnTeam && styles.tdOwn]} numberOfLines={1}>
                {row.club}
              </Text>
              <Text style={[styles.td, styles.colNum]}>{row.played}</Text>
              <Text style={[styles.td, styles.colNum]}>{row.goalsFor}:{row.goalsAgainst}</Text>
              <Text style={[styles.td, styles.colNum, styles.tdPoints]}>{row.points}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  segmentLabelActive: {
    color: colors.white,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  resultCard: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 12,
  },
  resultBar: {
    width: 4,
    borderRadius: 2,
  },
  win: { backgroundColor: colors.success },
  loss: { backgroundColor: colors.danger },
  draw: { backgroundColor: colors.textMuted },
  competition: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 6,
    fontWeight: '600',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchTeam: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  matchTeamRight: {
    textAlign: 'right',
  },
  matchScore: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginHorizontal: 10,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    padding: 14,
    paddingBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tableRowOwn: {
    backgroundColor: `${colors.primary}10`,
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  td: {
    fontSize: 12,
    color: colors.text,
  },
  tdOwn: {
    fontWeight: '800',
    color: colors.primary,
  },
  tdPoints: {
    fontWeight: '800',
  },
  colPos: { width: 22 },
  colClub: { flex: 1, paddingRight: 6 },
  colNum: { width: 42, textAlign: 'right' },
});

export default ResultsScreen;
