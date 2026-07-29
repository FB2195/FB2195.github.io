import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { NEWS } from '../data/mockData';
import { NewsStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { formatDateLong } from '../utils/date';

type Props = NativeStackScreenProps<NewsStackParamList, 'NewsDetail'>;

const NewsDetailScreen: React.FC<Props> = ({ route }) => {
  const item = NEWS.find((n) => n.id === route.params.newsId);

  if (!item) {
    return (
      <ScreenContainer>
        <Text>Beitrag nicht gefunden.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.tag}>{item.tag}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{formatDateLong(item.date)}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  tag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 6,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 16,
  },
  content: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});

export default NewsDetailScreen;
