import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import { CLUB_THEME } from '../theme/clubTheme';

const ProductCard = ({
  name = 'Producto',
  description,
  price,
  image,
  category,
  onPress,
  onAddToCart,
  buttonLabel = 'Agregar',
}) => {
  const imageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
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
        {!!category && (
          <Text style={styles.category} numberOfLines={1}>
            {category}
          </Text>
        )}

        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        {!!description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>{price ?? '$0.00'}</Text>

          {!!onAddToCart && (
            <TouchableOpacity style={styles.button} onPress={onAddToCart}>
              <Text style={styles.buttonText}>{buttonLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: CLUB_THEME.neutral.card,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: '#d0d9eb',
  },
  pressed: {
    opacity: 0.9,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef3fb',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    padding: 12,
  },
  category: {
    marginBottom: 4,
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  name: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  description: {
    marginTop: 6,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  price: {
    flex: 1,
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 16,
    fontWeight: '900',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: CLUB_THEME.brandSecondary.electricBlue,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default ProductCard;
