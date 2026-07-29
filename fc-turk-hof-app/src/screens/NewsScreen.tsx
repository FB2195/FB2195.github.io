import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import ScreenContainer from '../components/ScreenContainer';
import { NEWS } from '../data/mockData';
import { NewsStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { formatDateLong } from '../utils/date';

type Props = NativeStackScreenProps<NewsStackParamList, 'NewsList'>;

const NewsScreen: React.FC<Props> = ({ navigation }) => {
  const sorted = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ScreenContainer>
      {sorted.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })}>
          <Card style={{ marginBottom: 12 }}>
            <Text style={styles.tag}>{item.tag}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
            <Text style={styles.date}>{formatDateLong(item.date)}</Text>
          </Card>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  tag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summary: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 10,
  },
});

export default NewsScreen;
