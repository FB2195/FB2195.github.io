import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { RESULTS, TABLES, TEAMS, teamName } from '../data/mockData';
import { colors } from '../theme/colors';
import { TeamId } from '../types';
import { formatDateShort } from '../utils/date';
import { getResultsScope } from '../utils/permissions';

type Tab = 'ergebnisse' | 'tabelle';

const ResultsScreen: React.FC = () => {
  const { user } = useAuth();
  const scope = getResultsScope(user); // 'all' oder [eigenes Team] für Eltern
  const isLocked = scope !== 'all';
  const lockedTeamId = isLocked ? (scope as TeamId[])[0] : undefined;

  const availableTeams = isLocked ? TEAMS.filter((t) => t.id === lockedTeamId) : TEAMS;

  const [tab, setTab] = useState<Tab>('ergebnisse');
  const [teamFilter, setTeamFilter] = useState<TeamId | 'alle'>(isLocked ? lockedTeamId! : 'alle');
  const [tableTeamId, setTableTeamId] = useState<TeamId>(lockedTeamId ?? 'herren1');

  const filteredResults = useMemo(
    () =>
      [...RESULTS]
        .filter((r) => (isLocked ? r.teamId === lockedTeamId : teamFilter === 'alle' || r.teamId === teamFilter))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [teamFilter, isLocked, lockedTeamId]
  );

  const activeTableTeamId = isLocked ? lockedTeamId! : tableTeamId;
  const activeTable = TABLES[activeTableTeamId] ?? [];

  return (
    <ScreenContainer>
      {isLocked && (
        <Text style={styles.lockedHint}>Du siehst ausschließlich Ergebnisse und Tabelle von {teamName(lockedTeamId)}.</Text>
      )}

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
          {!isLocked && (
            <View style={styles.chipRow}>
              <Chip label="Alle Teams" selected={teamFilter === 'alle'} onPress={() => setTeamFilter('alle')} />
              {availableTeams.map((t) => (
                <Chip key={t.id} label={t.name} selected={teamFilter === t.id} onPress={() => setTeamFilter(t.id)} />
              ))}
            </View>
          )}

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
        <View>
          {!isLocked && (
            <View style={styles.chipRow}>
              {availableTeams.map((t) => (
                <Chip key={t.id} label={t.name} selected={tableTeamId === t.id} onPress={() => setTableTeamId(t.id)} />
              ))}
            </View>
          )}
          <Card style={{ padding: 0 }}>
            <Text style={styles.tableTitle}>Tabelle · {teamName(activeTableTeamId)}</Text>
            {activeTable.length === 0 ? (
              <View style={{ padding: 14 }}>
                <EmptyState title="Für dieses Team liegt noch keine Tabelle vor" />
              </View>
            ) : (
              <View>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.th, styles.colPos]}>#</Text>
                  <Text style={[styles.th, styles.colClub]}>Verein</Text>
                  <Text style={[styles.th, styles.colNum]}>Sp</Text>
                  <Text style={[styles.th, styles.colNum]}>Tore</Text>
                  <Text style={[styles.th, styles.colNum]}>Pkt</Text>
                </View>
                {activeTable.map((row) => (
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
              </View>
            )}
          </Card>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  lockedHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
    fontStyle: 'italic',
  },
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
    backgroundColor: `${colors.primary}18`,
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
