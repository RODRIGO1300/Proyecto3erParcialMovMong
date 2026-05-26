import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const CustomItem = ({
  title = 'Elemento',
  subtitle,
  leftContent,
  rightContent,
  onPress,
  disabled = false,
}) => {
  return (
    <Pressable
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {leftContent && <View style={styles.left}>{leftContent}</View>}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightContent ? (
        <View style={styles.right}>{rightContent}</View>
      ) : (
        onPress && <Text style={styles.chevron}>{'>'}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pressed: {
    backgroundColor: '#f9fafb',
  },
  disabled: {
    opacity: 0.55,
  },
  left: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#eef2ff',
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 3,
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chevron: {
    color: '#9ca3af',
    fontSize: 22,
    fontWeight: '700',
  },
});

export default CustomItem;
