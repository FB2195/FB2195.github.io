import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import RoleBadge from '../components/RoleBadge';
import ScreenContainer from '../components/ScreenContainer';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { NEWS, bereichLabel, teamName } from '../data/mockData';
import { colors } from '../theme/colors';
import { formatDateLong, formatTimeRange } from '../utils/date';

const TODAY = '2026-07-29';

const QUICK_LINKS: { label: string; icon: string; tab: string; screen?: string }[] = [
  { label: 'Kalender', icon: '📅', tab: 'CalendarTab' },
  { label: 'News', icon: '📰', tab: 'NewsTab' },
  { label: 'Ergebnisse', icon: '⚽', tab: 'ResultsTab' },
  { label: 'Spieler', icon: '🧑‍🤝‍🧑', tab: 'MoreTab', screen: 'Players' },
  { label: 'Formulare', icon: '📝', tab: 'MoreTab', screen: 'Forms' },
  { label: 'Umfragen', icon: '🗳️', tab: 'MoreTab', screen: 'Surveys' },
  { label: 'Kommunikation', icon: '💬', tab: 'MoreTab', screen: 'Communication' },
];

const HomeScreen: React.FC = () => {
  const { user, isYouthParent, isFunktionaer } = useAuth();
  const { events } = useData();
  const navigation = useNavigation<any>();

  const relevantTeamId = user?.teamId ?? user?.parentTeamId;
  const upcomingEvents = events
    .filter((e) => e.date >= TODAY)
    .filter((e) => isFunktionaer || !relevantTeamId || e.teamId === relevantTeamId)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3);

  const latestNews = [...NEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);

  const goTab = (tab: string, screen?: string) => {
    navigation.navigate(tab, screen ? { screen } : undefined);
  };

  const subGreetingParts: string[] = [];
  if (user?.roles.includes('spieler')) subGreetingParts.push(teamName(user.teamId));
  if (user?.roles.includes('fan')) {
    subGreetingParts.push(isYouthParent ? `Elternteil · ${teamName(user?.parentTeamId)}` : 'Fan & Mitglied');
  }
  if (user?.roles.includes('funktionaer')) subGreetingParts.push(bereichLabel(user.bereich));

  return (
    <ScreenContainer>
      <View style={styles.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Willkommen, {user?.name?.split(' ')[0]}!</Text>
          <Text style={styles.subGreeting}>{subGreetingParts.join(' · ')}</Text>
        </View>
        {user ? <RoleBadge roles={user.roles} /> : null}
      </View>

      <SectionHeader title="Nächste Termine" actionLabel="Alle anzeigen" onAction={() => goTab('CalendarTab')} />
      {upcomingEvents.length === 0 ? (
        <Card style={{ marginBottom: 20 }}>
          <Text style={styles.emptyText}>Keine anstehenden Termine.</Text>
        </Card>
      ) : (
        upcomingEvents.map((event) => (
          <Card key={event.id} style={styles.eventCard}>
            <View style={styles.eventDateBox}>
              <Text style={styles.eventDay}>{event.date.slice(8, 10)}</Text>
              <Text style={styles.eventMonth}>{event.date.slice(5, 7)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventMeta}>{formatTimeRange(event.time, event.endTime)}</Text>
              <Text style={styles.eventMeta}>{event.location}</Text>
            </View>
          </Card>
        ))
      )}

      <SectionHeader title="Aktuelles" actionLabel="Alle News" onAction={() => goTab('NewsTab')} />
      {latestNews.map((item) => (
        <Card key={item.id} style={{ marginBottom: 12 }}>
          <Text style={styles.newsTag}>{item.tag}</Text>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsSummary}>{item.summary}</Text>
          <Text style={styles.newsDate}>{formatDateLong(item.date)}</Text>
        </Card>
      ))}

      <SectionHeader title="Schnellzugriff" />
      <View style={styles.grid}>
        {QUICK_LINKS.map((link) => (
          <TouchableOpacity key={link.label} style={styles.gridItem} onPress={() => goTab(link.tab, link.screen)}>
            <Text style={styles.gridIcon}>{link.icon}</Text>
            <Text style={styles.gridLabel}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  eventDateBox: {
    width: 48,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 8,
  },
  eventDay: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  eventMonth: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  eventMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  newsTag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  newsSummary: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  newsDate: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    alignItems: 'center',
  },
  gridIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});

export default HomeScreen;
