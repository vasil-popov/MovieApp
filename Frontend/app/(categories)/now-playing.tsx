import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  TextInput,
  StatusBar,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  cover: string;
  voteAverage: number;
  tmdbId: number;
  key?: string;
}

interface SearchHeaderProps {
  onSearch: (query: string) => void;
}

const safeString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

const SearchHeader = memo(({ onSearch }: SearchHeaderProps) => {
  const [localSearch, setLocalSearch] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(() => {
    onSearch(localSearch);
  }, [localSearch, onSearch]);

  const handleClear = useCallback(() => {
    setLocalSearch('');
    onSearch('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [onSearch]);

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder="Търси филми..."
        value={localSearch}
        onChangeText={setLocalSearch}
        placeholderTextColor="#999"
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        blurOnSubmit={false}
        autoCorrect={false}
      />
      {localSearch !== '' && (
        <TouchableOpacity 
          onPress={handleClear} 
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
});

export default function NowPlayingMoviesScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uniqueIds] = useState(new Set<string>());

  const fetchMovies = async (pageNumber: number, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    
    try {
      const response = await fetch(`http://192.168.1.46:8000/api/movies/now-playing?page=${pageNumber}`);
      const data = await response.json();
      
      const processedMovies = data.map((movie: any) => ({
        id: movie.id || 0,
        title: safeString(movie.title || "Без заглавие"),
        year: safeString(movie.year || "N/A"),
        genre: safeString(movie.genre || "Жанр N/A"),
        cover: safeString(movie.cover || ""),
        voteAverage: movie.voteAverage || 0,
        tmdbId: movie.tmdbId || 0,
        key: `movie-${movie.id || Math.random()}-${movie.tmdbId || Math.random()}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      }));
      
      const moviesWithUniqueKeys = processedMovies.filter((movie: Movie) => {
        const movieIdentifier = `${movie.id}-${movie.tmdbId}`;
        if (uniqueIds.has(movieIdentifier)) {
          return false;
        }
        uniqueIds.add(movieIdentifier);
        return true;
      });
      
      if (isLoadMore) {
        setMovies(prevMovies => [...prevMovies, ...moviesWithUniqueKeys]);
        setFilteredMovies(prevMovies => [...prevMovies, ...moviesWithUniqueKeys]);
      } else {
        setMovies(moviesWithUniqueKeys);
        setFilteredMovies(moviesWithUniqueKeys);
      }
    } catch (error) {
      console.error('Грешка при зареждане на филми:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => {
        const movieTitle = safeString(movie.title).toLowerCase();
        const movieGenre = safeString(movie.genre).toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return movieTitle.includes(query) || movieGenre.includes(query);
      });
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setLoading(true);

    try {
      const response = await fetch(`http://192.168.1.46:8000/api/movies/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      const processedMovies = data.map((movie: any) => ({
        id: movie.id || 0,
        title: safeString(movie.title || "Без заглавие"),
        year: safeString(movie.year || "N/A"),
        genre: safeString(movie.genre || "Жанр N/A"),
        cover: safeString(movie.cover || ""),
        voteAverage: movie.voteAverage || 0,
        tmdbId: movie.tmdbId || 0,
        key: `movie-${movie.id || Math.random()}-${movie.tmdbId || Math.random()}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      }));

      setFilteredMovies(processedMovies);
    } catch (error) {
      console.error('Грешка при търсене:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage, true);
  };

  const renderItem = ({ item }: { item: Movie }) => {
    if (!item || typeof item !== 'object' || !item.id) {
      return null;
    }
    
    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => router.push(`/movie-details/${item.id}`)}
      >
        <Image 
          source={{ uri: safeString(item.cover) }} 
          style={styles.movieImage}
          defaultSource={require('../../assets/images/splash.png')}
        />
        
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{safeString(item.title)}</Text>
          <Text style={styles.movieDetails}>
            {safeString(item.year)} | {safeString(item.genre)}
          </Text>
          
          {item.voteAverage ? (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{safeString(item.voteAverage.toFixed(1))}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = useCallback(() => (
    <SearchHeader onSearch={handleSearch} />
  ), [handleSearch]);

  const ListFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#E50914" />
        <Text style={styles.footerText}>Зареждане на повече филми...</Text>
      </View>
    );
  };

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="film-outline" size={50} color="#999" />
      <Text style={styles.emptyText}>Не бяха открити филми</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.key || `movie-${item.id || Math.random()}-${Date.now()}-${Math.random()}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={8}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        ListEmptyComponent={ListEmpty}
        keyboardShouldPersistTaps="handled"
      />
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'white',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  movieCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    alignItems: 'center',
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: '#333',
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  movieDetails: {
    color: '#bbb',
    marginBottom: 6,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    color: '#999',
    marginLeft: 8,
  },
}); 