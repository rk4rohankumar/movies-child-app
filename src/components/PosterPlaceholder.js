const PosterPlaceholder = ({ title = "No Poster" }) => (
  <div
    className="w-full h-72 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4"
    aria-hidden="true"
  >
    <span className="text-center font-semibold text-lg line-clamp-4">
      {title}
    </span>
  </div>
);

export default PosterPlaceholder;
