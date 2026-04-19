import { useEffect, useState } from "react";
import axios from "axios";
import 'tailwindcss/tailwind.css';
import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import MovieCard from "./components/MovieCard";
import useDebouncedValue from "./hooks/useDebouncedValue";

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const PAGE_SIZE = 10; // OMDB returns 10 per page

const MoviesPage = () => {
  const [searchTerm, setSearchTerm] = useState("batman");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const term = debouncedSearch.trim();
    if (!term) {
      setMovies([]);
      setTotalResults(0);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://www.omdbapi.com/", {
          params: { s: term, page, apikey: OMDB_API_KEY },
        });
        if (cancelled) return;
        if (response?.data?.Response === "True" && response.data.Search) {
          setMovies(response.data.Search);
          setTotalResults(parseInt(response.data.totalResults, 10) || 0);
        } else {
          setMovies([]);
          setTotalResults(0);
          setError(response?.data?.Error || "No movies found.");
        }
      } catch (err) {
        if (cancelled) return;
        setMovies([]);
        setTotalResults(0);
        setError("Failed to fetch movies.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, page]);

  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const showingCount = movies.length;

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Popular Movies</h1>

      <form
        role="search"
        aria-label="Search movies"
        className="mb-6 flex justify-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="movie-search" className="sr-only">
          Search movies
        </label>
        <input
          id="movie-search"
          type="search"
          placeholder="Search movies..."
          className="p-2 border border-gray-300 rounded-md w-64 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
      </form>

      <p
        className="text-sm text-gray-600 text-center mb-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {loading
          ? "Loading..."
          : totalResults > 0
          ? `Showing ${showingCount} of ${totalResults} results`
          : debouncedSearch.trim()
          ? "No results"
          : "Type to search"}
      </p>

      {loading ? (
        <Loader />
      ) : (
        <>
          {movies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          )}

          {error && movies.length === 0 && <ErrorState message={error} />}
          {!error && movies.length === 0 && debouncedSearch.trim() && (
            <EmptyState />
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Results pagination"
              className="flex items-center justify-center gap-4 mt-8"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="text-sm font-medium" aria-live="polite">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
};

export default MoviesPage;
