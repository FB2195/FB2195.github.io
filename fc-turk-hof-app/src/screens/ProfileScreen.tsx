import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import RoleBadge from '../components/RoleBadge';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { bereichLabel, teamName } from '../data/mockData';
import { colors } from '../theme/colors';
import { isValidBirthDate, isValidEmail, isValidPhone, isValidPostalCode } from '../utils/validators';

const ProfileScreen: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? '');
  const [street, setStreet] = useState(user?.street ?? '');
  const [postalCode, setPostalCode] = useState(user?.postalCode ?? '');
  const [city, setCity] = useState(user?.city ?? '');

  if (!user) return null;

  const startEditing = () => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setBirthDate(user.birthDate);
    setStreet(user.street);
    setPostalCode(user.postalCode);
    setCity(user.city);
    setIsEditing(true);
  };

  const canSave =
    name.trim().length > 1 &&
    isValidEmail(email) &&
    isValidPhone(phone) &&
    isValidBirthDate(birthDate) &&
    street.trim().length > 1 &&
    isValidPostalCode(postalCode) &&
    city.trim().length > 1;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        birthDate: birthDate.trim(),
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.avatarInitials}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <RoleBadge roles={user.roles} />
      </View>

      {!isEditing ? (
        <View>
          <Card>
            <Row label="E-Mail" value={user.email} />
            <Row label="Telefon" value={user.phone} />
            <Row label="Geburtsdatum" value={user.birthDate} />
            <Row label="Adresse" value={`${user.street}, ${user.postalCode} ${user.city}`} last />
          </Card>

          <Card style={{ marginTop: 12 }}>
            {user.roles.includes('spieler') && <Row label="Team" value={teamName(user.teamId)} />}
            {user.roles.includes('fan') && user.isParentOfYouth && (
              <>
                <Row label="Kind" value={user.childName ?? '–'} />
                <Row label="Team des Kindes" value={teamName(user.parentTeamId)} />
              </>
            )}
            {user.roles.includes('fan') && !user.isParentOfYouth && <Row label="Zugehörigkeit" value="Fan / Mitglied" />}
            {user.roles.includes('funktionaer') && (
              <>
                <Row label="Bereich" value={bereichLabel(user.bereich)} />
                {user.bereich === 'trainer' && (
                  <Row label="Trainiert" value={(user.coachedTeamIds ?? []).map((id) => teamName(id)).join(', ') || '–'} />
                )}
              </>
            )}
          </Card>

          <PrimaryButton label="Profil bearbeiten" onPress={startEditing} style={{ marginTop: 20 }} />
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} autoCapitalize="words" />

          <Text style={styles.label}>E-Mail-Adresse</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.input, email.length > 0 && !isValidEmail(email) && styles.inputError]}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Telefonnummer</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={[styles.input, phone.length > 0 && !isValidPhone(phone) && styles.inputError]}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Geburtsdatum</Text>
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="TT.MM.JJJJ"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, birthDate.length > 0 && !isValidBirthDate(birthDate) && styles.inputError]}
          />

          <Text style={styles.label}>Straße & Hausnummer</Text>
          <TextInput value={street} onChangeText={setStreet} style={styles.input} />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>PLZ</Text>
              <TextInput
                value={postalCode}
                onChangeText={setPostalCode}
                style={[styles.input, postalCode.length > 0 && !isValidPostalCode(postalCode) && styles.inputError]}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.label}>Ort</Text>
              <TextInput value={city} onChangeText={setCity} style={styles.input} />
            </View>
          </View>

          <View style={styles.editActions}>
            <PrimaryButton
              label="Abbrechen"
              onPress={() => setIsEditing(false)}
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
            />
            <PrimaryButton
              label="Speichern"
              onPress={handleSave}
              disabled={!canSave}
              loading={saving}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};

const Row: React.FC<{ label: string; value: string; last?: boolean }> = ({ label, value, last }) => (
  <View style={[styles.row2, !last && styles.rowBorder]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  row2: {
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
  row: {
    flexDirection: 'row',
  },
  editActions: {
    flexDirection: 'row',
    marginTop: 24,
  },
});

export default ProfileScreen;
