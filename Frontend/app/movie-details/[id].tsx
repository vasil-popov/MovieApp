import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  ImageBackground,
  Platform,
  StatusBar,
  Linking,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from '../../components/StarRating';
import RatingModal from '../../components/RatingModal';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

interface Review {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  avatarPath: string;
  rating: number;
}

interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  genres: string[];
  description: string; 
  cover: string;
  backdrop: string;
  voteAverage: number;
  tmdbId: number;
  favorite: boolean;
  budget: number;
  revenue: number;
  runtime: number;
  releaseDate: string;
  trailerKey: string;
  cast: CastMember[];
  reviews: Review[];
  movieType?: string;
}

interface ExpandedReview {
  [key: string]: boolean;
}

interface UserInfoState {
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
}

export default function MovieDetails() {
  const { id } = useGlobalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedReviews, setExpandedReviews] = useState<ExpandedReview>({});
  const [isNowPlaying, setIsNowPlaying] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoState>({});
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          const parsedUserInfo = JSON.parse(userInfoString);
          setUserInfo(parsedUserInfo);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.46:8000/api/movies/${id}`);
        const data: Movie = await response.json();
        setMovie(data);
        
        setIsNowPlaying(data.movieType?.includes('now_playing') || false);
        
        if (userInfo.id) {
          const favoriteResponse = await fetch(
            `http://192.168.1.46:8000/api/favorites/${id}/check?fbUserId=${encodeURIComponent(userInfo.id)}`
          );
          const isFavorite = await favoriteResponse.json();
          setIsFavorite(isFavorite);
          
          try {
            const ratingResponse = await fetch(
              `http://192.168.1.46:8000/api/ratings/${id}?fbUserId=${encodeURIComponent(userInfo.id)}`
            );
            
            if (ratingResponse.status === 200) {
              const userRating = await ratingResponse.json();
              setUserRating(userRating);
            } else {
              setUserRating(null);
            }
          } catch (error) {
            console.error('Error fetching user rating:', error);
            setUserRating(null);
          }
        }
        
        try {
          const avgRatingResponse = await fetch(`http://192.168.1.46:8000/api/ratings/${id}/average`);
          if (avgRatingResponse.status === 200) {
            const avgRating = await avgRatingResponse.json();
            setAverageRating(avgRating);
          }
          
          const countResponse = await fetch(`http://192.168.1.46:8000/api/ratings/${id}/count`);
          if (countResponse.status === 200) {
            const count = await countResponse.json();
            setRatingCount(count);
          }
        } catch (error) {
          console.error('Error fetching rating data:', error);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, userInfo.id]);

  const toggleFavorite = async () => {
    if (!movie) return;
    
    if (!userInfo.id) {
      Alert.alert(
        "Login Required",
        "Please log in to add favorites",
        [{ text: "OK" }]
      );
      return;
    }
    
    try {
      const response = await fetch(
        `http://192.168.1.46:8000/api/favorites/${id}/toggle?fbUserId=${encodeURIComponent(userInfo.id)}`,
        { method: 'POST' }
      );
      
      if (response.ok) {
        const result = await response.json();
        setIsFavorite(result);
      } else {
        throw new Error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert(
        "Error",
        "Failed to update favorite status",
        [{ text: "OK" }]
      );
    }
  };

  const openTrailer = async () => {
    if (!movie?.id) return;
    
    try {
      const response = await fetch(`http://192.168.1.46:8000/api/movies/${movie.id}/videos`);
      const videosData = await response.json();
      
      if (videosData && videosData.results && videosData.results.length > 0) {
        const officialTrailer = videosData.results.find(
          (video: any) => 
            video.type === "Trailer" && 
            video.site === "YouTube" && 
            video.official === true
        );
        
        const anyTrailer = videosData.results.find(
          (video: any) => 
            video.type === "Trailer" && 
            video.site === "YouTube"
        );
        
        const anyVideo = videosData.results.find(
          (video: any) => video.site === "YouTube"
        );
        
        const videoToPlay = officialTrailer || anyTrailer || anyVideo;
        
        if (videoToPlay) {
          Linking.openURL(`https://www.youtube.com/watch?v=${videoToPlay.key}`);
        } else {
          Alert.alert("Sorry", "No trailer available for this movie");
        }
      } else {
        Alert.alert("Sorry", "No videos available for this movie");
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
      Alert.alert("Error", "Failed to load trailer");
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderCastItem = ({ item }: { item: CastMember }) => (
    <View style={styles.castItem}>
      <Image 
        source={{ 
          uri: item.profilePath || 'https://via.placeholder.com/185x278?text=No+Image'
        }} 
        style={styles.castImage} 
      />
      <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.castCharacter} numberOfLines={1}>{item.character}</Text>
    </View>
  );

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const findNearbyTheaters = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please grant location permissions to find nearby theaters.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const searchQuery = encodeURIComponent('кина');
      
      let mapUrl;
      
      if (Platform.OS === 'ios') {
        mapUrl = `maps://search?q=${searchQuery}&near=${latitude},${longitude}`;
      } else {
        mapUrl = `geo:${latitude},${longitude}?q=${searchQuery}`;
      }
      
      const canOpenUrl = await Linking.canOpenURL(mapUrl);
      
      if (canOpenUrl) {
        await Linking.openURL(mapUrl);
      } else {
        await Linking.openURL(
          `https://www.google.com/maps/search/${searchQuery}/@${latitude},${longitude},15z`
        );
      }
    } catch (error) {
      console.error('Error finding nearby theaters:', error);
      Alert.alert(
        'Error',
        'Failed to find nearby theaters. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRateMovie = () => {
    if (!userInfo.id) {
      Alert.alert(
        "Login Required",
        "Please log in to rate movies",
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsRatingModalVisible(true);
  };
  
  const submitRating = async (rating: number) => {
    if (!userInfo.id || !movie) return;
    
    try {
      const ratingValue = Math.round(rating * 2);
      console.log(`Оценка: ${ratingValue}/10 за филма ${id}`);
      
      const response = await fetch(
        `http://192.168.1.46:8000/api/ratings/${id}?fbUserId=${encodeURIComponent(userInfo.id)}&rating=${ratingValue}`,
        { method: 'POST' }
      );
      
      if (response.ok) {
        console.log('Оценката е изпратена успешно');
        setUserRating(rating);
        
        const avgRatingResponse = await fetch(`http://192.168.1.46:8000/api/ratings/${id}/average`);
        if (avgRatingResponse.status === 200) {
          const avgRating = await avgRatingResponse.json();
          setAverageRating(avgRating);
        }
        
        const countResponse = await fetch(`http://192.168.1.46:8000/api/ratings/${id}/count`);
        if (countResponse.status === 200) {
          const count = await countResponse.json();
          setRatingCount(count);
        }
        
        Alert.alert(
          "Оценката е изпратена",
          `Оценихте филма ${ratingValue}/10`,
          [{ text: "OK" }]
        );
      } else {
        const errorText = await response.text();
        console.error('Оценката не е изпратена:', errorText);
        throw new Error(`Неуспешно изпращане на оценка: ${errorText}`);
      }
    } catch (error: any) {
      console.error('Грешка при изпращането на оценка:', error);
      Alert.alert(
        "Грешка",
        `Неуспешно изпращане на оценка. ${error.message || 'Моля, опитайте отново.'}`,
        [{ text: "OK" }]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Филмът не е пронајден</Text>   
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <ImageBackground 
          source={{ uri: movie.backdrop || movie.cover }} 
          style={styles.backdrop}
          resizeMode="cover"
        >
          <View style={styles.gradientOverlay}>
            <TouchableOpacity 
              style={styles.backArrow}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.posterContainer}>
              <Image source={{ uri: movie.cover }} style={styles.poster} />
              <View style={styles.movieInfo}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.year}>{movie.year}</Text>
                <Text style={styles.genre}>{movie.genre}</Text>
                
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={20} color="#FFD700" />
                  <Text style={styles.rating}>{movie.voteAverage?.toFixed(1)}</Text>
                </View>

                {movie.runtime > 0 && (
                  <View style={styles.runtimeContainer}>
                    <MaterialIcons name="access-time" size={16} color="#DDD" />
                    <Text style={styles.runtime}>{formatRuntime(movie.runtime)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={toggleFavorite}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={26} 
            color={isFavorite ? "#E50914" : "#FFF"} 
          />
          <Text style={styles.actionText}>Любим</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleRateMovie}
        >
          <Ionicons 
            name={userRating ? "star" : "star-outline"} 
            size={26} 
            color={userRating ? "#FFD700" : "#FFF"} 
          />
          <Text style={styles.actionText}>Оцени</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={26} color="#FFF" />
          <Text style={styles.actionText}>Сподели</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={openTrailer}
          disabled={!movie?.trailerKey}
        >
          <Ionicons 
            name="play-circle-outline" 
            size={26} 
            color={movie?.trailerKey ? "#FFF" : "#666"} 
          />
          <Text 
            style={[
              styles.actionText, 
              !movie?.trailerKey && {color: '#666'}
            ]}
          >
            Trailer
          </Text>
        </TouchableOpacity>

        {isNowPlaying && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={findNearbyTheaters}
          >
            <Ionicons name="location-outline" size={26} color="#FFF" />
            <Text style={styles.actionText}>Кина</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]} 
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Преглед</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cast' && styles.activeTab]}
          onPress={() => setActiveTab('cast')}
        >
          <Text style={[styles.tabText, activeTab === 'cast' && styles.activeTabText]}>
            Актьори {movie.cast?.length > 0 ? `(${movie.cast.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
            Отзиви {movie.reviews?.length > 0 ? `(${movie.reviews.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'overview' && (
        <>
          <View style={styles.overviewContainer}>
            <Text style={styles.sectionTitle}>Синопсис</Text>
            <Text style={styles.description}>{movie.description}</Text>
          </View>
          
          {(averageRating !== null || userRating !== null) && (
            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>Оценки</Text>
              
              <View style={styles.ratingRow}>
                {averageRating !== null && (
                  <View style={styles.communityRating}>
                    <Text style={styles.ratingLabel}>Оценка</Text>
                    <View style={styles.ratingValueContainer}>
                      <FontAwesome name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingValue}>
                        {averageRating.toFixed(1)}/10
                      </Text>
                      <Text style={styles.ratingCount}>
                        ({ratingCount} {ratingCount === 1 ? 'vote' : 'votes'})
                      </Text>
                    </View>
                  </View>
                )}
                
                {userRating !== null && (
                  <View style={styles.userRatingContainer}>
                    <Text style={styles.ratingLabel}>Вашата оценка</Text>
                    <View style={styles.ratingValueContainer}>
                      <FontAwesome name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingValue}>
                        {(userRating).toFixed(1)}/10
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
          
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Детали</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Дата на премиера</Text>
              <Text style={styles.detailValue}>{formatDate(movie.releaseDate)}</Text>
            </View>
            
            {movie.genres && movie.genres.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Жанрове</Text>
                <Text style={styles.detailValue}>{movie.genres.join(', ')}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Времетраене</Text>
              <Text style={styles.detailValue}>{formatRuntime(movie.runtime)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Бюджет</Text>
              <Text style={styles.detailValue}>{formatCurrency(movie.budget)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Приходи</Text>
              <Text style={styles.detailValue}>{formatCurrency(movie.revenue)}</Text>
            </View>
          </View>
        </>
      )}
      
      {activeTab === 'cast' && (
        <View style={styles.castContainer}>
          {movie.cast && movie.cast.length > 0 ? (
            <FlatList
              data={movie.cast}
              renderItem={renderCastItem}
              keyExtractor={(item) => `cast-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castList}
            />
          ) : (
            <Text style={styles.noDataText}>Няма информации за актьор</Text>
          )}
        </View>
      )}
      
      {activeTab === 'reviews' && (
        <View style={styles.reviewsContainer}>
          {movie.reviews && movie.reviews.length > 0 ? (
            movie.reviews.map(review => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                  {review.rating > 0 && (
                    <View style={styles.reviewRating}>
                      <FontAwesome name="star" size={14} color="#FFD700" />
                      <Text style={styles.reviewRatingText}>
                        {review.rating}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
                <Text 
                  style={styles.reviewContent} 
                  numberOfLines={expandedReviews[review.id] ? undefined : 5}
                >
                  {review.content}
                </Text>
                {review.content && review.content.length > 250 && (
                  <TouchableOpacity 
                    style={styles.readMoreButton}
                    onPress={() => toggleReviewExpansion(review.id)}
                  >
                    <Text style={styles.readMoreText}>
                      {expandedReviews[review.id] ? 'Покажи по-малко' : 'Покажи повече'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Няма отзиви</Text>
          )}
        </View>
      )}
      
      <RatingModal
        visible={isRatingModalVisible}
        onClose={() => setIsRatingModalVisible(false)}
        onSubmitRating={submitRating}
        movieId={Number(id)}
        movieTitle={movie?.title || ''}
        initialRating={userRating || 0}
      />
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  headerContainer: {
    height: 450,
    width: '100%',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backArrow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 15,
    zIndex: 10,
  },
  posterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  year: {
    color: '#DDD',
    fontSize: 16,
    marginBottom: 2,
  },
  genre: {
    color: '#BBB',
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  runtimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runtime: {
    color: '#DDD',
    fontSize: 14,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#DDD',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E50914',
  },
  tabText: {
    color: '#BBB',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  overviewContainer: {
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#DDD',
    fontSize: 15,
    lineHeight: 22,
  },
  detailsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  detailLabel: {
    color: '#BBB',
    fontSize: 15,
  },
  detailValue: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  castContainer: {
    padding: 16,
  },
  castList: {
    paddingBottom: 16,
  },
  castItem: {
    width: 120,
    marginRight: 16,
  },
  castImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  castName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  castCharacter: {
    color: '#BBB',
    fontSize: 12,
  },
  reviewsContainer: {
    padding: 16,
  },
  reviewItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAuthor: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reviewRatingText: {
    color: '#FFD700',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  reviewContent: {
    color: '#DDD',
    fontSize: 14,
    lineHeight: 20,
  },
  readMoreButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  readMoreText: {
    color: '#E50914',
    fontSize: 14,
  },
  noDataText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
  },
  ratingSection: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  communityRating: {
    marginRight: 20,
    marginBottom: 10,
  },
  userRatingContainer: {
    marginBottom: 10,
  },
  ratingLabel: {
    color: '#BBB',
    fontSize: 14,
    marginBottom: 4,
  },
  ratingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ratingCount: {
    color: '#999',
    fontSize: 12,
    marginLeft: 4,
  },
});


