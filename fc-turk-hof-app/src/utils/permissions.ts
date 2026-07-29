import { CHANNELS } from '../data/mockData';
import { AppUser, Channel, TeamId } from '../types';

/**
 * Zentrale Zugriffslogik für die Team-Kommunikation:
 * - Spieler sehen nur den Kanal ihres eigenen Teams.
 * - Trainer sehen die Kanäle der von ihnen ausgewählten Teams (+ Funktionäre-Kanal).
 * - Der Jugendleiter sieht alle Jugend-Kanäle (+ Funktionäre-Kanal).
 * - Übrige Funktionäre (Vorstand, Kassier, Presse, Schriftführer, Sonstige)
 *   sehen nur den Funktionäre-Kanal, keine Mannschafts-/Jugendkanäle.
 * - Eltern von Jugendspielern sehen nur den Kanal des Teams ihres Kindes.
 * - Fans ohne Elternstatus haben keinen Kanalzugriff.
 */
export function getAccessibleChannels(user: AppUser | null): Channel[] {
  if (!user) return [];

  if (user.role === 'funktionaer') {
    if (user.bereich === 'trainer') {
      const coached = user.coachedTeamIds ?? [];
      return CHANNELS.filter((c) => c.category === 'funktionaere' || (!!c.teamId && coached.includes(c.teamId)));
    }
    if (user.bereich === 'jugendleiter') {
      return CHANNELS.filter((c) => c.category === 'funktionaere' || c.category === 'jugend');
    }
    return CHANNELS.filter((c) => c.category === 'funktionaere');
  }

  if (user.role === 'spieler') {
    return CHANNELS.filter((c) => c.teamId === user.teamId);
  }

  if (user.role === 'fan' && user.isParentOfYouth && user.parentTeamId) {
    return CHANNELS.filter((c) => c.teamId === user.parentTeamId);
  }

  return [];
}

export function canAccessChannel(user: AppUser | null, channelId: string): boolean {
  return getAccessibleChannels(user).some((c) => c.id === channelId);
}

/**
 * Ergebnisse/Tabelle: Eltern von Jugendspielern sehen ausschließlich das Team
 * ihres Kindes (kein Umschalten). Alle anderen Rollen sehen alle Teams.
 */
export function getResultsScope(user: AppUser | null): TeamId[] | 'all' {
  if (user?.role === 'fan' && user.isParentOfYouth && user.parentTeamId) {
    return [user.parentTeamId];
  }
  return 'all';
}
