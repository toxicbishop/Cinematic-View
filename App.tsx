import React, { useState, useEffect } from "react";
import Carousel from "./components/Carousel";
import ThemeToggle from "./components/ThemeToggle";
import { SLIDES } from "./constants";

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center selection:bg-primary selection:text-white transition-colors duration-500 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-[100px] md:blur-[140px] dark:bg-primary/10 mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 md:w-[500px] h-80 md:h-[500px] bg-orange/20 rounded-full blur-[100px] md:blur-[140px] dark:bg-sunset/10 mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-1/3 right-1/3 w-48 md:w-64 h-48 md:h-64 bg-gold/20 rounded-full blur-[80px] md:blur-[100px] dark:bg-gold/5 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 dark:opacity-5 pointer-events-none bg-[radial-gradient(#FF007F_1px,transparent_1px)] [background-size:20px_20px] md:[background-size:40px_40px]"></div>
      </div>

      <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />

      <main className="relative z-10 w-full max-w-[1600px] flex flex-col items-center px-4 md:px-8 py-6 md:py-10 h-full justify-center">
        {/* Header Section */}
        <header className="mb-8 md:mb-16 text-center relative group">
          <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-7xl tracking-[0.2em] md:tracking-[0.3em] text-gray-900 dark:text-white uppercase relative z-10 drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(255,0,127,0.6)] transition-all duration-700">
            Cinematic
            <span className="bg-gradient-to-r from-primary via-sunset to-gold bg-clip-text text-transparent transition-all duration-500">
              View
            </span>
          </h1>
          <p className="mt-2 md:mt-4 font-sans text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.4em] text-gray-500 dark:text-gray-400 uppercase font-light transition-opacity duration-700 group-hover:opacity-80">
            Explore the neon horizon
          </p>
          <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 w-12 md:w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        </header>

        {/* Carousel Section */}
        <div className="w-full flex-1 flex items-center">
          <Carousel
            slides={SLIDES}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
          />
        </div>

        {/* Footer / Info Section */}
        <footer className="mt-8 md:mt-16 text-center text-gray-400 dark:text-gray-600 font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] opacity-60">
          &copy; {new Date().getFullYear()} CinematicView
        </footer>
      </main>
    </div>
  );
};

export default App;
