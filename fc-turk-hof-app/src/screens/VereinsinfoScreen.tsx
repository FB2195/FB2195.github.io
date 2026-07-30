import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import ScreenContainer from '../components/ScreenContainer';
import SectionHeader from '../components/SectionHeader';
import { colors } from '../theme/colors';

const VORSTAND = [
  '1. Vorstand',
  '2. Vorstand',
  'Kassier',
  'Schriftführer',
  'Jugendleiter',
  'Presse / Öffentlichkeitsarbeit',
];

const VereinsinfoScreen: React.FC = () => (
  <ScreenContainer>
    <View style={styles.header}>
      <Image source={require('../../assets/club-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.clubName}>FC Türk Hof e.V.</Text>
      <Text style={styles.founded}>Gegründet 1977</Text>
    </View>

    <SectionHeader title="Kontakt" />
    <Card style={{ marginBottom: 20 }}>
      <Row label="Anschrift" value={'Sportgelände FC Türk Hof' + '\nSportplatzweg 5, 95028 Hof'} />
      <Row label="E-Mail" value="info@fc-tuerk-hof.de" />
      <Row label="Telefon" value="09281 123456" last />
    </Card>

    <SectionHeader title="Verein" />
    <Card style={{ marginBottom: 20 }}>
      <Row label="Vereinsfarben" value="Weinrot / Weiß" />
      <Row label="Mannschaften" value="Herren, U11, U9, Bambini" />
      <Row label="Mitglied seit" value="1977 im Kreisverband" last />
    </Card>

    <SectionHeader title="Vorstand" subtitle="Aktuelle Ämter im Verein" />
    <Card style={{ marginBottom: 20 }}>
      {VORSTAND.map((amt, index) => (
        <Row key={amt} label={amt} value="" last={index === VORSTAND.length - 1} hideValue />
      ))}
    </Card>

    <Text style={styles.footnote}>
      Änderungen an Satzung, Mitgliedsbeiträgen und weiteren Vereinsangelegenheiten entnimmst du bitte der
      Vereinssatzung bzw. wende dich an den Vorstand.
    </Text>
  </ScreenContainer>
);

const Row: React.FC<{ label: string; value: string; last?: boolean; hideValue?: boolean }> = ({
  label,
  value,
  last,
  hideValue,
}) => (
  <View style={[styles.row, !last && styles.rowBorder]}>
    <Text style={styles.rowLabel}>{label}</Text>
    {!hideValue && <Text style={styles.rowValue}>{value}</Text>}
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: 10,
  },
  clubName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  founded: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
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
    flexShrink: 1,
  },
  rowValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  footnote: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default VereinsinfoScreen;
