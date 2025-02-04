import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import 'tailwindcss/tailwind.css';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity }}
      ></motion.div>
      <p className="text-lg font-semibold text-gray-700 mt-4">Fetching movies...</p>
    </div>
  );
};

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("batman"); // Default search term

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?s=${searchTerm}&apikey=be0b53b1`
        );
        if (response?.data?.Search) {
          setMovies(response?.data?.Search);
        } else {
          setMovies([]);
          setError("No movies found.");
        }
      } catch (err) {
        setError("Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [searchTerm]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🎬 Popular Movies</h1>
      
      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search movies..."
          className="p-2 border border-gray-300 rounded-md w-64 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies?.map((movie, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
              alt={movie.Title}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{movie.Title}</h2>
              <p className="text-gray-600">Year: {movie.Year}</p>
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline mt-2 block"
              >
                View on IMDb
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
