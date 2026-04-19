import { useState } from "react";
import { motion } from "framer-motion";
import PosterPlaceholder from "./PosterPlaceholder";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const MovieCard = ({ movie }) => {
  const reduced = usePrefersReducedMotion();
  const hasPoster = movie.Poster && movie.Poster !== "N/A";
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = hasPoster && !imgFailed;

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      initial={reduced ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.4 }}
    >
      {showImg ? (
        <img
          src={movie.Poster}
          alt={`Poster for ${movie.Title}`}
          className="w-full h-72 object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <PosterPlaceholder title={movie.Title} />
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="text-xl font-semibold leading-tight">{movie.Title}</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">{movie.Year}</span>
          {movie.Type && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wide rounded bg-indigo-100 text-indigo-800">
              {movie.Type}
            </span>
          )}
        </div>
        <a
          href={`https://www.imdb.com/title/${movie.imdbID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm hover:underline mt-auto focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={`View ${movie.Title} on IMDb (opens in new tab)`}
        >
          View on IMDb
        </a>
      </div>
    </motion.article>
  );
};

export default MovieCard;
