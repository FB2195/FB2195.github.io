import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const Chip: React.FC<Props> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    style={[styles.chip, selected && styles.chipSelected]}
  >
    <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.white,
  },
});

export default Chip;
