export const colors = {
  primary: '#8C1C3F', // Weinrot / Vereinsfarbe
  primaryDark: '#6B1230',
  secondary: '#1F0710', // sehr dunkles Weinrot für Kontrastflächen
  gold: '#D4AF37',
  background: '#2A0A14', // Seitenhintergrund, fast schwarzes Weinrot
  surface: '#421022', // Karten/Flächen, etwas heller als der Hintergrund
  border: '#6B2A3E',
  text: '#FFFFFF',
  textMuted: '#E3B8C6',
  success: '#4CAF6D',
  warning: '#E8B84B',
  danger: '#FF6B6B',
  white: '#FFFFFF',
};

export const roleColors: Record<string, string> = {
  spieler: '#4ADE80',
  fan: '#7DB8FF',
  funktionaer: colors.gold,
};

export default colors;
