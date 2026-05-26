import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import { CLUB_THEME } from '../theme/clubTheme';

const CardItem = ({
  title = 'Producto',
  subtitle,
  price,
  quantity = 1,
  image,
  onPress,
  onRemove,
  onIncrement,
  onDecrement,
}) => {
  const imageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.imagePlaceholder}>IMG</Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {!!subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {onRemove && (
            <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
              <Text style={styles.removeText}>X</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{price ?? '$0.00'}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={onDecrement}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={onIncrement}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: CLUB_THEME.neutral.card,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: '#d6dfef',
  },
  pressed: {
    opacity: 0.8,
  },
  imageContainer: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: CLUB_THEME.brandPrimary.softBlue,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  info: {
    flex: 1,
  },
  title: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 13,
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#ffe8ea',
  },
  removeText: {
    color: CLUB_THEME.brandSecondary.red,
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  price: {
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 16,
    fontWeight: '800',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c6d4ef',
    borderRadius: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 18,
    fontWeight: '800',
  },
  quantity: {
    minWidth: 28,
    textAlign: 'center',
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CardItem;
