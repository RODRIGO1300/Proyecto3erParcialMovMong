import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CLUB_THEME } from '../theme/clubTheme';

const EmptyState = ({
  title = 'Sin resultados',
  message = 'No hay informacion para mostrar por ahora.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || <Text style={styles.iconText}>!</Text>}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {!!actionLabel && !!onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderRadius: 36,
    backgroundColor: CLUB_THEME.brandPrimary.softBlue,
  },
  iconText: {
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 30,
    fontWeight: '800',
  },
  title: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    maxWidth: 300,
    marginTop: 8,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: CLUB_THEME.brandSecondary.electricBlue,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default EmptyState;
