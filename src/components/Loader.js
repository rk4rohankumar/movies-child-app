import { motion } from "framer-motion";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const Loader = ({ label = "Fetching movies..." }) => {
  const reduced = usePrefersReducedMotion();
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="w-16 h-16 border-4 border-t-blue-500 border-[color:var(--mfe-border,#e2e8f0)] rounded-full"
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, rotate: 360 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 1, repeat: Infinity, ease: "linear" }
        }
      />
      <p className="text-lg font-semibold text-[color:var(--mfe-muted,#475569)] mt-4">{label}</p>
    </div>
  );
};

export default Loader;
