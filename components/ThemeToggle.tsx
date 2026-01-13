
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => {
  return (
    <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50">
      <button
        onClick={toggle}
        aria-label="Toggle Dark Mode"
        className="relative p-3 rounded-2xl bg-white/10 dark:bg-surface-dark/40 backdrop-blur-xl border border-white/20 dark:border-white/10 text-gray-800 dark:text-white hover:text-primary transition-all duration-300 shadow-lg hover:shadow-neon group overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-5 h-5 md:w-6 md:h-6 animate-in spin-in duration-500" />
          ) : (
            <Moon className="w-5 h-5 md:w-6 md:h-6 animate-in spin-in duration-500" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>
    </div>
  );
};

export default ThemeToggle;
