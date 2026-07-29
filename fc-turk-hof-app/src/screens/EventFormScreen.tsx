import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useData } from '../context/DataContext';
import { TEAMS } from '../data/mockData';
import { CalendarStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { EventType, TeamId } from '../types';

const TYPE_OPTIONS: { id: EventType; label: string }[] = [
  { id: 'training', label: 'Training' },
  { id: 'spiel', label: 'Spiel' },
  { id: 'sonstiges', label: 'Sonstiges' },
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

type Props = NativeStackScreenProps<CalendarStackParamList, 'EventForm'>;

const EventFormScreen: React.FC<Props> = ({ navigation }) => {
  const { addEvent } = useData();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<EventType>('training');
  const [teamId, setTeamId] = useState<TeamId | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dateValid = DATE_PATTERN.test(date.trim());
  const timeValid = TIME_PATTERN.test(time.trim());
  const endTimeValid = endTime.trim().length === 0 || TIME_PATTERN.test(endTime.trim());

  const canSubmit =
    title.trim().length > 1 && dateValid && timeValid && endTimeValid && location.trim().length > 1 && !!teamId;

  const handleSubmit = async () => {
    if (!canSubmit || !teamId) return;
    setSubmitting(true);
    try {
      await addEvent({
        title: title.trim(),
        date: date.trim(),
        time: time.trim(),
        endTime: endTime.trim() || undefined,
        location: location.trim(),
        type,
        teamId,
        description: description.trim() || undefined,
      });
      navigation.goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.label}>Titel</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="z.B. Training Herrenmannschaft"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />

      <Text style={styles.label}>Datum (JJJJ-MM-TT)</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="2026-08-15"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, date.length > 0 && !dateValid && styles.inputError]}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Beginn (HH:MM)</Text>
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="18:30"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, time.length > 0 && !timeValid && styles.inputError]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Ende (optional)</Text>
          <TextInput
            value={endTime}
            onChangeText={setEndTime}
            placeholder="20:00"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, endTime.length > 0 && !endTimeValid && styles.inputError]}
          />
        </View>
      </View>

      <Text style={styles.label}>Ort</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="z.B. Sportgelände FC Türk Hof, Platz 1"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />

      <Text style={styles.label}>Art</Text>
      <View style={styles.chipRow}>
        {TYPE_OPTIONS.map((t) => (
          <Chip key={t.id} label={t.label} selected={type === t.id} onPress={() => setType(t.id)} />
        ))}
      </View>

      <Text style={styles.label}>Team</Text>
      <View style={styles.chipRow}>
        {TEAMS.map((t) => (
          <Chip key={t.id} label={t.name} selected={teamId === t.id} onPress={() => setTeamId(t.id)} />
        ))}
      </View>

      <Text style={styles.label}>Beschreibung (optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textarea]}
        textAlignVertical="top"
      />

      <PrimaryButton label="Termin anlegen" onPress={handleSubmit} disabled={!canSubmit} loading={submitting} style={{ marginTop: 20 }} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textarea: {
    minHeight: 90,
  },
  row: {
    flexDirection: 'row',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default EventFormScreen;
