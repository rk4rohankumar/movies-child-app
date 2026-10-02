// Async boundary so webpack can negotiate shared singletons (react, react-dom,
// framer-motion, axios) before any of them is evaluated.
import('./bootstrap');
