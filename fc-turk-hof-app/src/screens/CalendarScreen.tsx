import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { teamName } from '../data/mockData';
import { CalendarStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { buildMonthGrid, formatDateLong, formatTimeRange, monthLabel, WEEKDAYS_HEADER } from '../utils/date';

const TODAY = '2026-07-29';

const EVENT_TYPE_LABEL: Record<string, string> = {
  training: 'Training',
  spiel: 'Spiel',
  sonstiges: 'Sonstiges',
};

const EVENT_TYPE_COLOR: Record<string, string> = {
  training: colors.success,
  spiel: colors.primary,
  sonstiges: colors.gold,
};

type Props = NativeStackScreenProps<CalendarStackParamList, 'Calendar'>;

const CalendarScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isFunktionaer } = useAuth();
  const { events } = useData();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6); // Juli = Index 6
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [onlyMine, setOnlyMine] = useState(true);

  const relevantTeamId = user?.teamId ?? user?.parentTeamId;

  const visibleEvents = useMemo(
    () => events.filter((e) => !onlyMine || isFunktionaer || !relevantTeamId || e.teamId === relevantTeamId),
    [events, onlyMine, isFunktionaer, relevantTeamId]
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    visibleEvents.forEach((e) => {
      map[e.date] = (map[e.date] ?? 0) + 1;
    });
    return map;
  }, [visibleEvents]);

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const eventsForSelectedDay = visibleEvents
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const changeMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer>
      {!isFunktionaer && relevantTeamId ? (
        <View style={styles.filterRow}>
          <Chip label="Meine Mannschaft" selected={onlyMine} onPress={() => setOnlyMine(true)} />
          <Chip label="Alle Termine" selected={!onlyMine} onPress={() => setOnlyMine(false)} />
        </View>
      ) : null}

      <Card style={{ marginBottom: 16 }}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.monthNav}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{monthLabel(year, month)}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.monthNav}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekdayRow}>
          {WEEKDAYS_HEADER.map((d) => (
            <Text key={d} style={styles.weekdayText}>
              {d}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {grid.map((cell) => {
            const isSelected = cell.iso === selectedDate;
            const isToday = cell.iso === TODAY;
            const hasEvents = !!eventsByDate[cell.iso];
            return (
              <TouchableOpacity
                key={cell.iso}
                style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                onPress={() => setSelectedDate(cell.iso)}
              >
                <Text
                  style={[
                    styles.dayText,
                    !cell.inMonth && styles.dayTextMuted,
                    isSelected && styles.dayTextSelected,
                    isToday && !isSelected && styles.dayTextToday,
                  ]}
                >
                  {Number(cell.iso.slice(8, 10))}
                </Text>
                {hasEvents ? <View style={[styles.dot, isSelected && styles.dotSelected]} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Text style={styles.dayHeading}>{formatDateLong(selectedDate)}</Text>

      {eventsForSelectedDay.length === 0 ? (
        <EmptyState title="Keine Termine an diesem Tag" />
      ) : (
        eventsForSelectedDay.map((event) => (
          <TouchableOpacity key={event.id} onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}>
            <Card style={styles.eventCard}>
              <View style={[styles.typeBar, { backgroundColor: EVENT_TYPE_COLOR[event.type] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>{formatTimeRange(event.time, event.endTime)} · {event.location}</Text>
                <Text style={styles.eventMeta}>
                  {EVENT_TYPE_LABEL[event.type]} · {teamName(event.teamId)}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}
      </ScreenContainer>

      {isFunktionaer && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('EventForm')}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthNav: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: '700',
    paddingHorizontal: 10,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 2,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 13,
    color: colors.text,
  },
  dayTextMuted: {
    color: colors.border,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '800',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  dotSelected: {
    backgroundColor: colors.white,
  },
  dayHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  eventCard: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 12,
    alignItems: 'stretch',
  },
  typeBar: {
    width: 4,
    borderRadius: 2,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  eventMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 32,
  },
});

export default CalendarScreen;
