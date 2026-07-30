import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import ScreenContainer from '../components/ScreenContainer';
import SectionHeader from '../components/SectionHeader';
import { SPONSOR_TIER_LABELS, SPONSORS } from '../data/mockData';
import { colors } from '../theme/colors';
import { Sponsor } from '../types';

const TIER_ORDER: Sponsor['tier'][] = ['haupt', 'ausruester', 'partner'];

const SponsorenScreen: React.FC = () => (
  <ScreenContainer>
    <Text style={styles.intro}>
      Der FC Türk Hof bedankt sich bei allen Sponsoren und Partnern für die Unterstützung unserer Mannschaften.
    </Text>

    {TIER_ORDER.map((tier) => {
      const sponsors = SPONSORS.filter((s) => s.tier === tier);
      if (sponsors.length === 0) return null;
      return (
        <View key={tier} style={{ marginBottom: 8 }}>
          <SectionHeader title={SPONSOR_TIER_LABELS[tier]} />
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{sponsor.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{sponsor.name}</Text>
                <Text style={styles.category}>{sponsor.category}</Text>
              </View>
            </Card>
          ))}
        </View>
      );
    })}
  </ScreenContainer>
);

const styles = StyleSheet.create({
  intro: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16,
    lineHeight: 19,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  category: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default SponsorenScreen;
