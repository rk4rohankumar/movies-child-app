const ErrorState = ({ message }) => (
  <div
    className="text-center py-12 px-4 rounded-md bg-red-50 border border-red-200"
    role="alert"
  >
    <p className="text-red-700 font-medium">{message}</p>
  </div>
);

export default ErrorState;
