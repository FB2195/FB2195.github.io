import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ScreenContainer from '../components/ScreenContainer';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { MoreStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { Channel } from '../types';
import { getAccessibleChannels } from '../utils/permissions';

type Props = NativeStackScreenProps<MoreStackParamList, 'Communication'>;

const CATEGORY_LABEL: Record<Channel['category'], string> = {
  mannschaft: 'Mannschaft',
  jugend: 'Jugendmannschaften',
  funktionaere: 'Funktionäre',
};

const CommunicationScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { messages } = useData();

  const visibleChannels = useMemo(() => getAccessibleChannels(user), [user]);

  const grouped = useMemo(() => {
    const map: Record<Channel['category'], Channel[]> = { mannschaft: [], jugend: [], funktionaere: [] };
    visibleChannels.forEach((c) => map[c.category].push(c));
    return map;
  }, [visibleChannels]);

  const lastMessage = (channelId: string) => {
    const list = messages.filter((m) => m.channelId === channelId);
    return list[list.length - 1];
  };

  if (visibleChannels.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Keine Kanäle verfügbar"
          subtitle="Die Team-Kommunikation ist Spielern, Eltern von Jugendspielern und Funktionären vorbehalten."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {(Object.keys(grouped) as Channel['category'][]).map((cat) =>
        grouped[cat].length === 0 ? null : (
          <View key={cat} style={{ marginBottom: 8 }}>
            <SectionHeader title={CATEGORY_LABEL[cat]} />
            {grouped[cat].map((channel) => {
              const last = lastMessage(channel.id);
              return (
                <TouchableOpacity key={channel.id} onPress={() => navigation.navigate('Channel', { channelId: channel.id })}>
                  <Card style={styles.channelCard}>
                    <View style={styles.channelIcon}>
                      <Text style={styles.channelIconText}>{channel.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.channelName}>{channel.name}</Text>
                      <Text style={styles.channelLast} numberOfLines={1}>
                        {last ? `${last.author}: ${last.text}` : channel.description}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelIconText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  channelName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  channelLast: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default CommunicationScreen;
