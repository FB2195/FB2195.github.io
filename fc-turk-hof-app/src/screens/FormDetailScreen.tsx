import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { FORMS } from '../data/mockData';
import { MoreStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { FormFieldDef } from '../types';

type Props = NativeStackScreenProps<MoreStackParamList, 'FormDetail'>;

const FormDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { user } = useAuth();
  const { submissions, submitForm } = useData();
  const form = FORMS.find((f) => f.id === route.params.formId);
  const alreadySubmitted = submissions.some((s) => s.formId === route.params.formId);

  const [values, setValues] = useState<Record<string, string | boolean>>(() => ({
    ...(form?.fields.some((f) => f.id === 'name') && user ? { name: user.name } : {}),
  }));
  const [submitting, setSubmitting] = useState(false);

  if (!form) {
    return (
      <ScreenContainer>
        <Text>Formular nicht gefunden.</Text>
      </ScreenContainer>
    );
  }

  const setValue = (id: string, value: string | boolean) => setValues((prev) => ({ ...prev, [id]: value }));

  const missingRequired = form.fields.filter((f) => f.required && !values[f.id]);
  const canSubmit = missingRequired.length === 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submitForm({ formId: form.id, submittedAt: new Date().toISOString(), values });
      Alert.alert('Danke!', 'Dein Formular wurde erfolgreich übermittelt.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>{form.title}</Text>
      <Text style={styles.description}>{form.description}</Text>

      {alreadySubmitted ? (
        <Card style={styles.noticeCard}>
          <Text style={styles.noticeText}>Du hast dieses Formular bereits eingereicht. Eine erneute Abgabe überschreibt sie nicht, wird aber zusätzlich gespeichert.</Text>
        </Card>
      ) : null}

      {form.fields.map((field) => (
        <FieldInput key={field.id} field={field} value={values[field.id]} onChange={(v) => setValue(field.id, v)} />
      ))}

      <PrimaryButton label="Absenden" onPress={handleSubmit} disabled={!canSubmit} loading={submitting} style={{ marginTop: 12 }} />
    </ScreenContainer>
  );
};

const FieldInput: React.FC<{
  field: FormFieldDef;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
}> = ({ field, value, onChange }) => {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>
        {field.label}
        {field.required ? <Text style={styles.required}> *</Text> : null}
      </Text>

      {field.type === 'text' || field.type === 'date' ? (
        <TextInput
          value={(value as string) ?? ''}
          onChangeText={(t) => onChange(t)}
          placeholder={field.type === 'date' ? 'TT.MM.JJJJ' : undefined}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      ) : null}

      {field.type === 'textarea' ? (
        <TextInput
          value={(value as string) ?? ''}
          onChangeText={(t) => onChange(t)}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textarea]}
          textAlignVertical="top"
        />
      ) : null}

      {field.type === 'select' ? (
        <View style={styles.chipRow}>
          {field.options?.map((option) => (
            <Chip key={option} label={option} selected={value === option} onPress={() => onChange(option)} />
          ))}
        </View>
      ) : null}

      {field.type === 'checkbox' ? (
        <TouchableOpacity style={styles.checkboxRow} onPress={() => onChange(!value)}>
          <View style={[styles.checkbox, value && styles.checkboxChecked]}>
            {value ? <Text style={styles.checkboxMark}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>Bestätigen</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 16,
  },
  noticeCard: {
    backgroundColor: `${colors.warning}15`,
    borderColor: colors.warning,
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 12,
    color: colors.text,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.primary,
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
  textarea: {
    minHeight: 90,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.text,
  },
});

export default FormDetailScreen;
