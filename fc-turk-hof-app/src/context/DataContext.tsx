import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_MESSAGES, SURVEYS } from '../data/mockData';
import { ChatMessage, FormSubmission, Survey } from '../types';

const SUBMISSIONS_KEY = '@fctuerkhof/form-submissions';
const VOTES_KEY = '@fctuerkhof/survey-votes';
const MESSAGES_KEY = '@fctuerkhof/messages';

interface DataContextValue {
  submissions: FormSubmission[];
  submitForm: (submission: FormSubmission) => Promise<void>;
  surveys: Survey[];
  votedSurveyIds: string[];
  voteSurvey: (surveyId: string, optionId: string) => Promise<void>;
  messages: ChatMessage[];
  sendMessage: (channelId: string, author: string, role: ChatMessage['role'], text: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>(SURVEYS);
  const [votedSurveyIds, setVotedSurveyIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  useEffect(() => {
    (async () => {
      const [rawSubmissions, rawVotes, rawMessages] = await Promise.all([
        AsyncStorage.getItem(SUBMISSIONS_KEY),
        AsyncStorage.getItem(VOTES_KEY),
        AsyncStorage.getItem(MESSAGES_KEY),
      ]);
      if (rawSubmissions) setSubmissions(JSON.parse(rawSubmissions));
      if (rawVotes) setVotedSurveyIds(JSON.parse(rawVotes));
      if (rawMessages) setMessages(JSON.parse(rawMessages));
    })();
  }, []);

  const submitForm = async (submission: FormSubmission) => {
    setSubmissions((prev) => {
      const next = [...prev, submission];
      AsyncStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const voteSurvey = async (surveyId: string, optionId: string) => {
    if (votedSurveyIds.includes(surveyId)) return;
    setSurveys((prev) =>
      prev.map((survey) =>
        survey.id !== surveyId
          ? survey
          : {
              ...survey,
              options: survey.options.map((option) =>
                option.id === optionId ? { ...option, votes: option.votes + 1 } : option
              ),
            }
      )
    );
    const nextVoted = [...votedSurveyIds, surveyId];
    setVotedSurveyIds(nextVoted);
    await AsyncStorage.setItem(VOTES_KEY, JSON.stringify(nextVoted));
  };

  const sendMessage: DataContextValue['sendMessage'] = async (channelId, author, role, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const message: ChatMessage = {
      id: `${Date.now()}`,
      channelId,
      author,
      role,
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => {
      const next = [...prev, message];
      AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<DataContextValue>(
    () => ({ submissions, submitForm, surveys, votedSurveyIds, voteSurvey, messages, sendMessage }),
    [submissions, surveys, votedSurveyIds, messages]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData muss innerhalb von DataProvider verwendet werden');
  return ctx;
};
