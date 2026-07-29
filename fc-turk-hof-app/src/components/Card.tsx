import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors } from '../theme/colors';

const Card: React.FC<ViewProps> = ({ style, children, ...rest }) => (
  <View style={[styles.card, style]} {...rest}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});

export default Card;
