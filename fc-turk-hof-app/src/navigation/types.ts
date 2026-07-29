export type HomeStackParamList = {
  Home: undefined;
};

export type CalendarStackParamList = {
  Calendar: undefined;
  EventDetail: { eventId: string };
  EventForm: undefined;
};

export type NewsStackParamList = {
  NewsList: undefined;
  NewsDetail: { newsId: string };
};

export type ResultsStackParamList = {
  Results: undefined;
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  Players: undefined;
  PlayerDetail: { playerId: string };
  Forms: undefined;
  FormDetail: { formId: string };
  Surveys: undefined;
  Communication: undefined;
  Channel: { channelId: string };
  Profile: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  NewsTab: undefined;
  ResultsTab: undefined;
  MoreTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};
