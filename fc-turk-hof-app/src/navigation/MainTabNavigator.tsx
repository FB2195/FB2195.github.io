import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import CalendarScreen from '../screens/CalendarScreen';
import ChannelScreen from '../screens/ChannelScreen';
import CommunicationScreen from '../screens/CommunicationScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventFormScreen from '../screens/EventFormScreen';
import FormDetailScreen from '../screens/FormDetailScreen';
import FormsScreen from '../screens/FormsScreen';
import HomeScreen from '../screens/HomeScreen';
import MoreScreen from '../screens/MoreScreen';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import NewsScreen from '../screens/NewsScreen';
import PlayerDetailScreen from '../screens/PlayerDetailScreen';
import PlayersScreen from '../screens/PlayersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResultsScreen from '../screens/ResultsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SponsorenScreen from '../screens/SponsorenScreen';
import SurveysScreen from '../screens/SurveysScreen';
import VereinsinfoScreen from '../screens/VereinsinfoScreen';
import { colors } from '../theme/colors';
import {
  CalendarStackParamList,
  HomeStackParamList,
  MainTabParamList,
  MoreStackParamList,
  NewsStackParamList,
  ResultsStackParamList,
} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();
const NewsStack = createNativeStackNavigator<NewsStackParamList>();
const ResultsStack = createNativeStackNavigator<ResultsStackParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTitleStyle: { color: colors.text, fontWeight: '700' as const },
  headerTintColor: colors.white,
};

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={headerOptions}>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'FC Türk Hof' }} />
  </HomeStack.Navigator>
);

const CalendarStackNavigator = () => (
  <CalendarStack.Navigator screenOptions={headerOptions}>
    <CalendarStack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Terminkalender' }} />
    <CalendarStack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Termin' }} />
    <CalendarStack.Screen name="EventForm" component={EventFormScreen} options={{ title: 'Neuer Termin' }} />
  </CalendarStack.Navigator>
);

const NewsStackNavigator = () => (
  <NewsStack.Navigator screenOptions={headerOptions}>
    <NewsStack.Screen name="NewsList" component={NewsScreen} options={{ title: 'News & Ankündigungen' }} />
    <NewsStack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ title: 'Beitrag' }} />
  </NewsStack.Navigator>
);

const ResultsStackNavigator = () => (
  <ResultsStack.Navigator screenOptions={headerOptions}>
    <ResultsStack.Screen name="Results" component={ResultsScreen} options={{ title: 'Ergebnisse & Tabelle' }} />
  </ResultsStack.Navigator>
);

const MoreStackNavigator = () => (
  <MoreStack.Navigator screenOptions={headerOptions}>
    <MoreStack.Screen name="MoreMenu" component={MoreScreen} options={{ title: 'Mehr' }} />
    <MoreStack.Screen name="Players" component={PlayersScreen} options={{ title: 'Spielerprofile' }} />
    <MoreStack.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ title: 'Spielerprofil' }} />
    <MoreStack.Screen name="Forms" component={FormsScreen} options={{ title: 'Formulare' }} />
    <MoreStack.Screen name="FormDetail" component={FormDetailScreen} options={{ title: 'Formular' }} />
    <MoreStack.Screen name="Surveys" component={SurveysScreen} options={{ title: 'Umfragen' }} />
    <MoreStack.Screen name="Communication" component={CommunicationScreen} options={{ title: 'Team-Kommunikation' }} />
    <MoreStack.Screen name="Channel" component={ChannelScreen} options={{ title: 'Kanal' }} />
    <MoreStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    <MoreStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Einstellungen' }} />
    <MoreStack.Screen name="Vereinsinfo" component={VereinsinfoScreen} options={{ title: 'Vereinsinfo' }} />
    <MoreStack.Screen name="Sponsoren" component={SponsorenScreen} options={{ title: 'Sponsoren' }} />
  </MoreStack.Navigator>
);

const ICONS: Record<keyof MainTabParamList, string> = {
  HomeTab: '🏠',
  CalendarTab: '📅',
  NewsTab: '📰',
  ResultsTab: '⚽',
  MoreTab: '☰',
};

const TabIcon: React.FC<{ icon: string; focused: boolean }> = ({ icon, focused }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
);

const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.white,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      tabBarIcon: ({ focused }) => <TabIcon icon={ICONS[route.name as keyof MainTabParamList]} focused={focused} />,
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Start' }} />
    <Tab.Screen name="CalendarTab" component={CalendarStackNavigator} options={{ title: 'Kalender' }} />
    <Tab.Screen name="NewsTab" component={NewsStackNavigator} options={{ title: 'News' }} />
    <Tab.Screen name="ResultsTab" component={ResultsStackNavigator} options={{ title: 'Ergebnisse' }} />
    <Tab.Screen name="MoreTab" component={MoreStackNavigator} options={{ title: 'Mehr' }} />
  </Tab.Navigator>
);

export default MainTabNavigator;
