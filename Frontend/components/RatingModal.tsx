import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitRating: (rating: number) => Promise<void>;
  movieId: number;
  movieTitle: string;
  initialRating?: number;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  onSubmitRating,
  movieId,
  movieTitle,
  initialRating = 0
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating, visible]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmitRating(rating);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    }
  };

  const handleCancel = () => {
    setRating(initialRating);
    onClose();
  };

  // Convert 5-star rating to 10-point scale
  const ratingValue = rating * 2;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
              
              <Text style={styles.title}>Rate This Movie</Text>
              <Text style={styles.movieTitle}>{movieTitle}</Text>
              
              <View style={styles.ratingContainer}>
                <StarRating
                  maxStars={5}
                  defaultRating={rating}
                  onRatingChange={handleRatingChange}
                  size={36}
                  style={styles.starRating}
                />
                
                <Text style={styles.ratingText}>
                  {ratingValue > 0 ? ratingValue : '-'}/10
                </Text>
                
                <Text style={styles.ratingLabel}>
                  {getRatingLabel(ratingValue)}
                </Text>
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.submitButton, rating === 0 && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={rating === 0 || loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const getRatingLabel = (rating: number): string => {
  if (rating === 0) return 'Tap to rate';
  if (rating <= 2) return 'Terrible';
  if (rating <= 4) return 'Bad';
  if (rating <= 6) return 'Okay';
  if (rating <= 8) return 'Good';
  return 'Excellent';
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    paddingTop: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 24,
    textAlign: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  starRating: {
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 4,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: '#DDD',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#E50914',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(229, 9, 20, 0.3)',
  },
});

export default RatingModal; 