import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface StarRatingProps {
  maxStars?: number;
  defaultRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  showNumber?: boolean;
  style?: any;
}

const StarRating: React.FC<StarRatingProps> = ({
  maxStars = 5,
  defaultRating = 0,
  size = 24,
  onRatingChange,
  readonly = false,
  showNumber = true,
  style
}) => {
  const [rating, setRating] = useState(defaultRating);
  const [animation] = useState(new Animated.Value(1));

  useEffect(() => {
    setRating(defaultRating);
  }, [defaultRating]);

  const handleRating = (newRating: number) => {
    if (readonly) return;
    
    setRating(newRating);
    
    // Animate the stars when rating changes
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  // Convert 5-star scale to 10-star scale for display if maxStars is 5
  const displayRating = maxStars === 5 ? rating * 2 : rating;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {[...Array(maxStars)].map((_, index) => {
          const starNumber = index + 1;
          const filled = starNumber <= rating;
          const halfFilled = !filled && starNumber - 0.5 <= rating;
          
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={readonly ? 1 : 0.7}
              onPress={() => handleRating(starNumber)}
              style={styles.starButton}
            >
              <Animated.View style={[
                rating === starNumber && { transform: [{ scale: animation }] }
              ]}>
                <FontAwesome
                  name={filled ? 'star' : (halfFilled ? 'star-half-o' : 'star-o')}
                  size={size}
                  color="#FFD700"
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {showNumber && (
        <Text style={styles.ratingText}>
          {displayRating > 0 ? displayRating.toFixed(1) : '-'}/10
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    padding: 2,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default StarRating; 