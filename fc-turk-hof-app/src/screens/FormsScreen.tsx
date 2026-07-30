import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { FORMS } from '../data/mockData';
import { MoreStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<MoreStackParamList, 'Forms'>;

const FormsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { submissions } = useData();

  const visibleForms = FORMS.filter((f) => !user || f.targetRoles.some((r) => user.roles.includes(r)));

  if (visibleForms.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState title="Keine Formulare verfügbar" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {visibleForms.map((form) => {
        const submitted = submissions.some((s) => s.formId === form.id);
        return (
          <TouchableOpacity key={form.id} onPress={() => navigation.navigate('FormDetail', { formId: form.id })}>
            <Card style={{ marginBottom: 12 }}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>{form.title}</Text>
                {submitted ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Eingereicht</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.description}>{form.description}</Text>
              <Text style={styles.fieldCount}>{form.fields.length} Felder</Text>
            </Card>
          </TouchableOpacity>
        );
      })}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
  },
  fieldCount: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 10,
  },
  badge: {
    backgroundColor: `${colors.success}22`,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
});

export default FormsScreen;
