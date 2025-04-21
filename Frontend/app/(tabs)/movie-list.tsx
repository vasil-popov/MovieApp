import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Dimensions,
  useWindowDimensions
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  cover: string;
  backdrop: string;
  voteAverage: number;
}

interface CategoryProps {
  title: string;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function MovieList() {
  const router = useRouter();
  const navigation = useNavigation();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://192.168.1.46:8000/api/movies/popular');
        const data = await response.json();
        
        setFeaturedMovies(data.slice(0, 5));
        
        setPopularMovies(data.slice(5, 15));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderMovieCategory = useCallback(({ title, onPress, icon }: CategoryProps) => (
    <TouchableOpacity style={styles.categoryButton} onPress={onPress}>
      <View style={styles.categoryTitleContainer}>
        <Ionicons name={icon} size={20} color="#E50914" style={styles.categoryIcon} />
        <Text style={styles.categoryText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#999" />
    </TouchableOpacity>
  ), []);

  const renderFeaturedMovie = useCallback(({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.featuredItem}
      onPress={() => router.push(`/movie-details/${item.id}`)}
    >
      <Image 
        source={{ uri: item.backdrop || item.cover }} 
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <View style={styles.featuredGradient}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredYear}>{item.year}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.voteAverage?.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [router]);

  const renderPopularMovie = useCallback(({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.popularItem}
      onPress={() => router.push(`/movie-details/${item.id}`)}
    >
      <Image source={{ uri: item.cover }} style={styles.popularImage} />
      <Text style={styles.popularTitle} numberOfLines={2}>{item.title}</Text>
      {item.voteAverage && (
        <View style={styles.ratingContainerSmall}>
          <FontAwesome name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingSmall}>{item.voteAverage.toFixed(1)}</Text>
        </View>
      )}
    </TouchableOpacity>
  ), [router]);

  const navigateToCategory = (category: string) => {
    try {
      (router as any).push(`/(categories)/${category}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Препоръчани</Text>
        <FlatList
          data={featuredMovies}
          renderItem={renderFeaturedMovie}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `featured-${item.id}`}
          contentContainerStyle={styles.featuredList}
        />
      </View>
      
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Категории</Text>
        <View style={styles.categoriesGrid}>
          <View style={styles.categoryRow}>
            {renderMovieCategory({ 
              title: 'Сега в кината', 
              onPress: () => navigateToCategory('now-playing'),
              icon: 'play-circle-outline'
            })}
            {renderMovieCategory({ 
              title: 'Популярни', 
              onPress: () => navigateToCategory('popular'),
              icon: 'flame-outline'
            })}
          </View>
          <View style={styles.categoryRow}>
            {renderMovieCategory({ 
              title: 'Най-оценявани', 
              onPress: () => navigateToCategory('top-rated'),
              icon: 'star-outline'
            })}
            {renderMovieCategory({ 
              title: 'Предстоящи', 
              onPress: () => navigateToCategory('upcoming'),
              icon: 'calendar-outline'
            })}
          </View>
        </View>
      </View>
      
      <View style={styles.popularSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Популярни</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigateToCategory('popular')}>
            <Text style={styles.seeAllText}>Виж всички</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={popularMovies}
          renderItem={renderPopularMovie}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `popular-${item.id}`}
          contentContainerStyle={styles.popularList}
        />
      </View>
    </ScrollView>
  );
}

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
  featuredSection: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  featuredList: {
    paddingLeft: 16,
  },
  featuredItem: {
    width: 280,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 12,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  featuredTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredYear: {
    color: '#DDD',
    fontSize: 14,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
  },
  categoriesSection: {
    paddingBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'column',
    paddingHorizontal: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '48%',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    minHeight: 50,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 8,
  },
  popularSection: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 16,
  },
  seeAllButton: {
    padding: 6,
  },
  seeAllText: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '500',
  },
  popularList: {
    paddingLeft: 16,
  },
  popularItem: {
    width: 120,
    marginRight: 12,
  },
  popularImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  popularTitle: {
    color: 'white',
    fontSize: 14,
    width: 120,
  },
  ratingContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingSmall: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
  },
});




