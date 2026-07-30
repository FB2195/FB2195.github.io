import { CHANNELS } from '../data/mockData';
import { AppUser, Channel, Role, TeamId } from '../types';

/**
 * Zentrale Zugriffslogik für die Team-Kommunikation. Ein Nutzer kann mehrere
 * Rollen gleichzeitig haben (z.B. Spieler + Trainer) - der Zugriff ergibt
 * sich aus der Vereinigung aller Rollen:
 * - Spieler sehen den Kanal ihres eigenen Teams.
 * - Trainer sehen die Kanäle der von ihnen ausgewählten Teams (+ Funktionäre-Kanal).
 * - Der Jugendleiter sieht alle Jugend-Kanäle (+ Funktionäre-Kanal).
 * - Übrige Funktionäre (Vorstand, Kassier, Presse, Schriftführer, Sonstige)
 *   sehen nur den Funktionäre-Kanal, keine Mannschafts-/Jugendkanäle.
 * - Eltern von Jugendspielern sehen den Kanal des Teams ihres Kindes.
 */
export function getAccessibleChannels(user: AppUser | null): Channel[] {
  if (!user) return [];
  const roles = user.roles ?? [];
  const result = new Map<string, Channel>();
  const add = (list: Channel[]) => list.forEach((c) => result.set(c.id, c));

  if (roles.includes('funktionaer')) {
    if (user.bereich === 'trainer') {
      const coached = user.coachedTeamIds ?? [];
      add(CHANNELS.filter((c) => c.category === 'funktionaere' || (!!c.teamId && coached.includes(c.teamId))));
    } else if (user.bereich === 'jugendleiter') {
      add(CHANNELS.filter((c) => c.category === 'funktionaere' || c.category === 'jugend'));
    } else {
      add(CHANNELS.filter((c) => c.category === 'funktionaere'));
    }
  }

  if (roles.includes('spieler') && user.teamId) {
    add(CHANNELS.filter((c) => c.teamId === user.teamId));
  }

  if (roles.includes('fan') && user.isParentOfYouth && user.parentTeamId) {
    add(CHANNELS.filter((c) => c.teamId === user.parentTeamId));
  }

  return Array.from(result.values());
}

export function canAccessChannel(user: AppUser | null, channelId: string): boolean {
  return getAccessibleChannels(user).some((c) => c.id === channelId);
}

/**
 * Ergebnisse/Tabelle: Wer AUSSCHLIESSLICH Elternteil eines Jugendspielers ist
 * (keine weitere Rolle), sieht nur das Team des eigenen Kindes. Sobald eine
 * weitere Rolle (Spieler, Funktionär) hinzukommt, gilt der volle Zugriff.
 */
export function getResultsScope(user: AppUser | null): TeamId[] | 'all' {
  const roles = user?.roles ?? [];
  const onlyParent = roles.length === 1 && roles[0] === 'fan' && user?.isParentOfYouth;
  if (onlyParent && user?.parentTeamId) {
    return [user.parentTeamId];
  }
  return 'all';
}

/** Für Anzeigezwecke (z.B. Chat-Absender-Rolle): wichtigste Rolle zuerst. */
const ROLE_PRIORITY: Role[] = ['funktionaer', 'spieler', 'fan'];

export function getPrimaryRole(roles: Role[]): Role {
  return ROLE_PRIORITY.find((r) => roles.includes(r)) ?? 'fan';
}
