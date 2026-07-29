export type Role = 'spieler' | 'fan' | 'funktionaer';

export type TeamId =
  | 'herren1'
  | 'ah'
  | 'u19'
  | 'u17'
  | 'u15'
  | 'u13'
  | 'bambini';

export type TeamCategory = 'senior' | 'jugend';

export interface TeamInfo {
  id: TeamId;
  name: string;
  category: TeamCategory;
}

export interface AppUser {
  id: string;
  name: string;
  role: Role;
  /** Spieler: eigenes Team */
  teamId?: TeamId;
  /** Fan: ist Erziehungsberechtigte/r eines Jugendspielers */
  isParentOfYouth?: boolean;
  /** Fan (Elternteil): Jugendteam des Kindes */
  parentTeamId?: TeamId;
  /** Funktionär: Zuständigkeitsbereich */
  bereich?: string;
  avatarInitials: string;
}

export type EventType = 'training' | 'spiel' | 'sonstiges';

export interface ClubEvent {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  endTime?: string;
  location: string;
  type: EventType;
  teamId: TeamId;
  description?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  tag: string;
}

export interface MatchResult {
  id: string;
  date: string;
  competition: string;
  teamId: TeamId;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  isHome: boolean;
}

export interface TableRow {
  position: number;
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  isOwnTeam?: boolean;
}

export interface PlayerStats {
  games: number;
  goals: number;
  assists: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: TeamId;
  birthYear: number;
  initials: string;
  stats: PlayerStats;
}

export type FormFieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'date';

export interface FormFieldDef {
  id: string;
  label: string;
  type: FormFieldType;
  options?: string[];
  required?: boolean;
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  targetRoles: Role[];
  fields: FormFieldDef[];
}

export interface FormSubmission {
  formId: string;
  submittedAt: string;
  values: Record<string, string | boolean>;
}

export type SurveyAudience = 'eltern_jugend' | 'spieler_mannschaft';

export interface SurveyOption {
  id: string;
  label: string;
  votes: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  audience: SurveyAudience;
  deadline: string;
  options: SurveyOption[];
}

export type ChannelCategory = 'mannschaft' | 'jugend' | 'funktionaere';

export interface Channel {
  id: string;
  name: string;
  category: ChannelCategory;
  teamId?: TeamId;
  description: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  author: string;
  role: Role;
  text: string;
  timestamp: string;
}
