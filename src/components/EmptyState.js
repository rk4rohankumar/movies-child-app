const EmptyState = ({ message = "No movies found." }) => (
  <div className="text-center py-12 px-4 text-gray-600">
    <p className="text-lg">{message}</p>
    <p className="text-sm mt-2">Try a different search term.</p>
  </div>
);

export default EmptyState;
