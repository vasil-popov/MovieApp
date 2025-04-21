import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  cover: string;
  voteAverage: number;
  favorite: boolean;
}

interface UserInfoState {
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfoState>({});

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

  const fetchFavorites = async () => {
    if (!userInfo.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.46:8000/api/favorites?fbUserId=${encodeURIComponent(userInfo.id)}`
      );
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      } else {
        console.error('Failed to fetch favorites:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userInfo.id) {
      fetchFavorites();
    }
  }, [userInfo.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => router.push(`/movie-details/${item.id}`)}
    >
      <Image 
        source={{ uri: item.cover }} 
        style={styles.movieImage}
        defaultSource={require('../../assets/images/splash.png')}
      />
      
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieDetails} numberOfLines={1}>{item.year} | {item.genre}</Text>
        
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.voteAverage?.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={22} color="#999" />
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={60} color="#666" />
      <Text style={styles.emptyText}>Нямате любими филми</Text>
      {!userInfo.id && (
        <Text style={styles.loginText}>Моля влезте в профила си, за да запазите любимите си филми</Text>
      )}
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/movie-list')}
      >
        <Text style={styles.browseButtonText}>Разгледай филми</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Любими</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => `favorite-${item.id}`}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={ListEmptyComponent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  movieCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    alignItems: 'center',
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  movieDetails: {
    color: '#BBB',
    marginBottom: 8,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
  },
  arrowContainer: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#CCC',
    marginTop: 16,
    textAlign: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#E50914',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 