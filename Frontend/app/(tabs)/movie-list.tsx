import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';


interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  cover: string;
}

export default function MovieList() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://192.168.1.2:8000/api/movies'); //Backend address http://x.x.x.x:8000/api/movies
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => {
        if (item && item.id) {
          router.push(`/movie-details/${item.id}`);
        } else {
          console.error('Item or ID is undefined', item);
        }
      }}
    >
      <Image source={{ uri: item.cover }} style={styles.movieImage} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieDetails}>{item.year} | {item.genre}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={renderItem} 
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  movieCard: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
    
  },
  movieInfo: {
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieDetails: {
    color: '#666',
    marginTop: 4,
  },
});




