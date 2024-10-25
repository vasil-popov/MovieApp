import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import { useGlobalSearchParams } from 'expo-router';

interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  description: string; 
  cover: string;
}

export default function MovieDetails() {
  const { id } = useGlobalSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.2:8000/api/movies/${id}`); //http://x.x.x.x:8000/api/movies/${id}
        const data: Movie = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!movie) {
    return <Text>Movie not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.details}>{movie.year} | {movie.genre}</Text>
      <Image source={{ uri: movie.cover }} style={styles.movieImage} />
      <Text style={styles.description}>{movie.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8,
    marginTop: 30,
  },
  details: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    marginBottom: 16,
  },
  movieImage: {
    width: '100%',
    height: '60%',
    alignSelf: 'center', 
    marginBottom: 16,
    borderRadius: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});


