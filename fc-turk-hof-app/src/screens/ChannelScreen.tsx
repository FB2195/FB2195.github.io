import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CHANNELS } from '../data/mockData';
import { MoreStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { ChatMessage } from '../types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Channel'>;

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const ChannelScreen: React.FC<Props> = ({ route, navigation }) => {
  const channel = CHANNELS.find((c) => c.id === route.params.channelId);
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const [text, setText] = useState('');

  useLayoutEffect(() => {
    if (channel) navigation.setOptions({ title: channel.name });
  }, [channel, navigation]);

  if (!channel || !user) {
    return (
      <View style={styles.container}>
        <Text>Kanal nicht gefunden.</Text>
      </View>
    );
  }

  const channelMessages = messages
    .filter((m) => m.channelId === channel.id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(channel.id, user.name, user.role, text);
    setText('');
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMine = item.author === user.name;
    return (
      <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
        <View style={[styles.bubble, isMine && styles.bubbleMine]}>
          {!isMine && <Text style={styles.author}>{item.author}</Text>}
          <Text style={[styles.text, isMine && styles.textMine]}>{item.text}</Text>
          <Text style={[styles.time, isMine && styles.timeMine]}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={channelMessages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Nachricht schreiben…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={!text.trim()}>
          <Text style={styles.sendText}>Senden</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bubbleRowMine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderTopLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 4,
  },
  author: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: colors.text,
  },
  textMine: {
    color: colors.white,
  },
  time: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMine: {
    color: '#ffffffb0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  sendText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default ChannelScreen;
