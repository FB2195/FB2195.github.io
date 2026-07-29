import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { teamName } from '../data/mockData';
import { CalendarStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { formatDateLong, formatTimeRange } from '../utils/date';

const EVENT_TYPE_LABEL: Record<string, string> = {
  training: 'Training',
  spiel: 'Spiel',
  sonstiges: 'Sonstiges',
};

type Props = NativeStackScreenProps<CalendarStackParamList, 'EventDetail'>;

const EventDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { isFunktionaer } = useAuth();
  const { events, deleteEvent } = useData();
  const event = events.find((e) => e.id === route.params.eventId);

  if (!event) {
    return (
      <ScreenContainer>
        <Text>Termin nicht gefunden.</Text>
      </ScreenContainer>
    );
  }

  const handleDelete = () => {
    Alert.alert('Termin löschen', `"${event.title}" wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: async () => {
          await deleteEvent(event.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <Text style={styles.type}>{EVENT_TYPE_LABEL[event.type]}</Text>
      <Text style={styles.title}>{event.title}</Text>

      <Card style={{ marginTop: 16 }}>
        <Row label="Datum" value={formatDateLong(event.date)} />
        <Row label="Uhrzeit" value={formatTimeRange(event.time, event.endTime)} />
        <Row label="Ort" value={event.location} />
        <Row label="Team" value={teamName(event.teamId)} last />
      </Card>

      {event.description ? (
        <Card style={{ marginTop: 16 }}>
          <Text style={styles.descriptionHeading}>Details</Text>
          <Text style={styles.description}>{event.description}</Text>
        </Card>
      ) : null}

      {isFunktionaer && (
        <PrimaryButton label="Termin löschen" onPress={handleDelete} variant="outline" style={{ marginTop: 20 }} />
      )}
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
  type: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 6,
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
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  descriptionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
});

export default EventDetailScreen;
