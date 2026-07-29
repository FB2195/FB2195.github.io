import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { BEREICH_LABELS, SENIOR_TEAMS, TEAMS, YOUTH_TEAMS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { FunktionaerBereich, Role, TeamId } from '../types';

const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: 'spieler', label: 'Spieler', hint: 'Aktiver Spieler einer Mannschaft' },
  { id: 'fan', label: 'Fan', hint: 'Unterstützer, Mitglied oder Elternteil' },
  { id: 'funktionaer', label: 'Funktionär', hint: 'Trainer, Vorstand oder Betreuer' },
];

const BEREICHE = (Object.keys(BEREICH_LABELS) as FunktionaerBereich[]).map((id) => ({
  id,
  label: BEREICH_LABELS[id],
}));

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('spieler');
  const [teamId, setTeamId] = useState<TeamId | undefined>(undefined);
  const [isParentOfYouth, setIsParentOfYouth] = useState(false);
  const [childName, setChildName] = useState('');
  const [parentTeamId, setParentTeamId] = useState<TeamId | undefined>(undefined);
  const [bereich, setBereich] = useState<FunktionaerBereich | undefined>(undefined);
  const [coachedTeamIds, setCoachedTeamIds] = useState<TeamId[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const trimmedName = name.trim();
  const trimmedChildName = childName.trim();

  const canSubmit =
    trimmedName.length > 1 &&
    (role !== 'spieler' || !!teamId) &&
    (role !== 'fan' || !isParentOfYouth || (trimmedChildName.length > 1 && !!parentTeamId)) &&
    (role !== 'funktionaer' || (!!bereich && (bereich !== 'trainer' || coachedTeamIds.length > 0)));

  const toggleCoachedTeam = (id: TeamId) => {
    setCoachedTeamIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await login({
        name: trimmedName,
        role,
        teamId: role === 'spieler' ? teamId : undefined,
        isParentOfYouth: role === 'fan' ? isParentOfYouth : undefined,
        childName: role === 'fan' && isParentOfYouth ? trimmedChildName : undefined,
        parentTeamId: role === 'fan' && isParentOfYouth ? parentTeamId : undefined,
        bereich: role === 'funktionaer' ? bereich : undefined,
        coachedTeamIds: role === 'funktionaer' && bereich === 'trainer' ? coachedTeamIds : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenContainer>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>FTH</Text>
          </View>
          <Text style={styles.clubName}>FC Türk Hof</Text>
          <Text style={styles.tagline}>Vereins-App · Anmeldung</Text>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Vor- und Nachname"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Rolle</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[styles.roleCard, role === r.id && styles.roleCardActive]}
              onPress={() => setRole(r.id)}
            >
              <Text style={[styles.roleLabel, role === r.id && styles.roleLabelActive]}>{r.label}</Text>
              <Text style={[styles.roleHint, role === r.id && styles.roleHintActive]}>{r.hint}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {role === 'spieler' && (
          <View>
            <Text style={styles.label}>Deine Mannschaft</Text>
            <Text style={styles.groupLabel}>Aktive / Senioren</Text>
            <View style={styles.chipRow}>
              {SENIOR_TEAMS.map((t) => (
                <Chip key={t.id} label={t.name} selected={teamId === t.id} onPress={() => setTeamId(t.id)} />
              ))}
            </View>
            <Text style={styles.groupLabel}>Jugend</Text>
            <View style={styles.chipRow}>
              {YOUTH_TEAMS.map((t) => (
                <Chip key={t.id} label={t.name} selected={teamId === t.id} onPress={() => setTeamId(t.id)} />
              ))}
            </View>
          </View>
        )}

        {role === 'fan' && (
          <View>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setIsParentOfYouth((v) => !v)}>
              <View style={[styles.checkbox, isParentOfYouth && styles.checkboxChecked]}>
                {isParentOfYouth ? <Text style={styles.checkboxMark}>✓</Text> : null}
              </View>
              <Text style={styles.checkboxLabel}>Ich bin Elternteil eines Jugendspielers</Text>
            </TouchableOpacity>
            {isParentOfYouth && (
              <View>
                <Text style={styles.label}>Name des Kindes</Text>
                <TextInput
                  value={childName}
                  onChangeText={setChildName}
                  placeholder="Vor- und Nachname des Kindes"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  autoCapitalize="words"
                />
                <Text style={styles.label}>Jugendteam meines Kindes</Text>
                <View style={styles.chipRow}>
                  {YOUTH_TEAMS.map((t) => (
                    <Chip
                      key={t.id}
                      label={t.name}
                      selected={parentTeamId === t.id}
                      onPress={() => setParentTeamId(t.id)}
                    />
                  ))}
                </View>
                <Text style={styles.hint}>
                  Damit siehst du ausschließlich Termine, Ergebnisse, Tabelle und Kanal des Teams deines Kindes.
                </Text>
              </View>
            )}
          </View>
        )}

        {role === 'funktionaer' && (
          <View>
            <Text style={styles.label}>Zuständigkeitsbereich</Text>
            <View style={styles.chipRow}>
              {BEREICHE.map((b) => (
                <Chip key={b.id} label={b.label} selected={bereich === b.id} onPress={() => setBereich(b.id)} />
              ))}
            </View>
            {bereich === 'trainer' && (
              <View>
                <Text style={styles.label}>Welche Mannschaft(en) trainierst du?</Text>
                <View style={styles.chipRow}>
                  {TEAMS.map((t) => (
                    <Chip
                      key={t.id}
                      label={t.name}
                      selected={coachedTeamIds.includes(t.id)}
                      onPress={() => toggleCoachedTeam(t.id)}
                    />
                  ))}
                </View>
                <Text style={styles.hint}>Mehrfachauswahl möglich. Du erhältst Schreibzugriff auf diese Team-Kanäle.</Text>
              </View>
            )}
          </View>
        )}

        <PrimaryButton
          label="Anmelden"
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={submitting}
          style={{ marginTop: 24 }}
        />
        <Text style={styles.disclaimer}>
          Demo-Anmeldung ohne Passwort · Die App merkt sich deine Auswahl auf diesem Gerät.
        </Text>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 12,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  clubName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  tagline: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 18,
    marginBottom: 8,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}33`,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  roleLabelActive: {
    color: colors.primary,
  },
  roleHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  roleHintActive: {
    color: colors.text,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
    flexShrink: 1,
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 14,
  },
});

export default LoginScreen;
