import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { EVENTS, INITIAL_MESSAGES, SURVEYS } from '../data/mockData';
import { ChatMessage, ClubEvent, FormSubmission, Survey } from '../types';
import { notifyLocal } from '../utils/notifications';

const SUBMISSIONS_KEY = '@fctuerkhof/form-submissions';
const VOTES_KEY = '@fctuerkhof/survey-votes';
const MESSAGES_KEY = '@fctuerkhof/messages';
const EVENTS_KEY = '@fctuerkhof/events';

interface DataContextValue {
  submissions: FormSubmission[];
  submitForm: (submission: FormSubmission) => Promise<void>;
  surveys: Survey[];
  votedSurveyIds: string[];
  voteSurvey: (surveyId: string, optionId: string) => Promise<void>;
  messages: ChatMessage[];
  sendMessage: (channelId: string, author: string, role: ChatMessage['role'], text: string) => Promise<void>;
  events: ClubEvent[];
  addEvent: (event: Omit<ClubEvent, 'id'>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>(SURVEYS);
  const [votedSurveyIds, setVotedSurveyIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [events, setEvents] = useState<ClubEvent[]>(EVENTS);

  useEffect(() => {
    (async () => {
      const [rawSubmissions, rawVotes, rawMessages, rawEvents] = await Promise.all([
        AsyncStorage.getItem(SUBMISSIONS_KEY),
        AsyncStorage.getItem(VOTES_KEY),
        AsyncStorage.getItem(MESSAGES_KEY),
        AsyncStorage.getItem(EVENTS_KEY),
      ]);
      if (rawSubmissions) setSubmissions(JSON.parse(rawSubmissions));
      if (rawVotes) setVotedSurveyIds(JSON.parse(rawVotes));
      if (rawMessages) setMessages(JSON.parse(rawMessages));
      if (rawEvents) setEvents(JSON.parse(rawEvents));
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

  const addEvent: DataContextValue['addEvent'] = async (event) => {
    const newEvent: ClubEvent = { ...event, id: `e${Date.now()}` };
    setEvents((prev) => {
      const next = [...prev, newEvent];
      AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(next));
      return next;
    });
    await notifyLocal('Neuer Termin', newEvent.title);
  };

  const deleteEvent = async (eventId: string) => {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== eventId);
      AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<DataContextValue>(
    () => ({
      submissions,
      submitForm,
      surveys,
      votedSurveyIds,
      voteSurvey,
      messages,
      sendMessage,
      events,
      addEvent,
      deleteEvent,
    }),
    [submissions, surveys, votedSurveyIds, messages, events]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData muss innerhalb von DataProvider verwendet werden');
  return ctx;
};
