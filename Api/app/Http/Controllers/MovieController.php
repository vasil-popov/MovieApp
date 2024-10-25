<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class MovieController extends Controller
{
    private $movies = [
        [
            'id' => 1,
            'title' => 'Inception',
            'year' => '2010',
            'genre' => 'Sci-Fi',
            'cover' => 'https://i.scdn.co/image/ab67616d0000b273a883e26f90ab617c91b90e56',
            'description' => 'A skilled thief who steals corporate secrets through dream-sharing technology',
        ],
        [
            'id' => 2,
            'title' => 'The Dark Knight',
            'year' => '2008',
            'genre' => 'Action',
            'cover' => 'https://m.media-amazon.com/images/S/pv-target-images/e9a43e647b2ca70e75a3c0af046c4dfdcd712380889779cbdc2c57d94ab63902.jpg',
            'description' => 'Batman faces off against the Joker in Gotham City',
        ],
        [
            'id' => 3,
            'title' => 'Interstellar',
            'year' => '2014',
            'genre' => 'Sci-Fi',
            'cover' => 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg',
            'description' => 'A team of explorers travels through a wormhole in search of a new home for humanity.',
        ],
        [
            'id' => 4,
            'title' => 'The Shawshank Redemption',
            'year' => '1994',
            'genre' => 'Drama',
            'cover' => 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg',
            'description' => 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        ],
        [
            'id' => 5,
            'title' => 'The Godfather',
            'year' => '1972',
            'genre' => 'Crime',
            'cover' => 'https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_.jpg',
            'description' => 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        ],
        [
            'id' => 6,
            'title' => 'Pulp Fiction',
            'year' => '1994',
            'genre' => 'Crime',
            'cover' => 'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_.jpg',
            'description' => 'The lives of two mob hitmen, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        ],
        [
            'id' => 7,
            'title' => 'Forrest Gump',
            'year' => '1994',
            'genre' => 'Drama',
            'cover' => 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_.jpg',
            'description' => 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.',
        ],
        [
            'id' => 8,
            'title' => 'Fight Club',
            'year' => '1999',
            'genre' => 'Drama',
            'cover' => 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg',
            'description' => 'An insomniac office worker forms an underground fight club with a soap salesman.',
        ],
        [
            'id' => 9,
            'title' => 'The Matrix',
            'year' => '1999',
            'genre' => 'Sci-Fi',
            'cover' => 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_.jpg',
            'description' => 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
        ],
        [
            'id' => 10,
            'title' => 'The Silence of the Lambs',
            'year' => '1991',
            'genre' => 'Thriller',
            'cover' => 'https://m.media-amazon.com/images/M/MV5BNDdhOGJhYzctYzYwZC00YmI2LWI0MjctYjg4ODdlMDExYjBlXkEyXkFqcGc@._V1_.jpg',
            'description' => 'A young FBI cadet must receive the help of an incarcerated and manipulative killer to catch another serial killer.',
        ],
        [
            'id' => 11,
            'title' => 'Gladiator',
            'year' => '2000',
            'genre' => 'Action',
            'cover' => 'https://upload.wikimedia.org/wikipedia/en/f/fb/Gladiator_%282000_film_poster%29.png',
            'description' => 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
        ],
    ];
    

    public function index(): JsonResponse
    {
        return response()->json($this->movies);
    }

    public function show($id): JsonResponse
    {
        $movie = collect($this->movies)->firstWhere('id', $id);

        if ($movie) {
            return response()->json($movie);
        }

        return response()->json(['error' => 'Movie not found'], 404);
    }
}



