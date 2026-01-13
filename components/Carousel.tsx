
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Slide } from '../types';

interface CarouselProps {
  slides: Slide[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ slides, currentIndex, onIndexChange }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringActiveSlide, setIsHoveringActiveSlide] = useState(false);
  
  // Touch state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    onIndexChange((currentIndex + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, slides.length, currentIndex, onIndexChange]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    onIndexChange((currentIndex - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, slides.length, currentIndex, onIndexChange]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    onIndexChange(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Also apply parallax on touch
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.targetTouches[0].clientX - rect.left) / rect.width - 0.5;
    const y = (e.targetTouches[0].clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Reset positions
    setTouchStart(null);
    setTouchEnd(null);
    setMousePos({ x: 0, y: 0 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHoveringActiveSlide(false);
  };

  const getDynamicStyle = (index: number) => {
    const total = slides.length;
    const isCenter = index === currentIndex;
    const isPrev = index === (currentIndex - 1 + total) % total;
    const isNext = index === (currentIndex + 1) % total;

    if (!isCenter && !isPrev && !isNext) return { opacity: 0 };

    // Base parallax settings
    const intensity = isCenter ? 1 : 0.4;
    const rotateYOffset = isPrev ? 25 : isNext ? -25 : 0;
    const translateXOffset = isPrev ? -40 : isNext ? 40 : 0;
    const scale = isCenter ? 1 : 0.85;

    // Calculate dynamic offsets
    const tiltX = mousePos.y * -15 * intensity;
    const tiltY = (mousePos.x * 15 * intensity) + rotateYOffset;
    const moveX = mousePos.x * 20 * intensity;
    const moveY = mousePos.y * 20 * intensity;

    return {
      transform: `translateX(calc(${translateXOffset}% + ${moveX}px)) translateY(${moveY}px) scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transition: isAnimating ? 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.1s ease-out, opacity 0.7s ease-in-out',
    };
  };

  const getSlideClassName = (index: number) => {
    const total = slides.length;
    const isCenter = index === currentIndex;
    const isPrev = index === (currentIndex - 1 + total) % total;
    const isNext = index === (currentIndex + 1) % total;

    let base = "carousel-item absolute w-[90%] md:w-[60%] lg:w-[50%] h-[80%] md:h-[90%] cursor-pointer will-change-transform ";
    
    if (isCenter) return base + "z-30 opacity-100 shadow-2xl";
    if (isPrev) return base + "z-10 opacity-40 grayscale-[50%] hidden md:block origin-right";
    if (isNext) return base + "z-10 opacity-40 grayscale-[50%] hidden md:block origin-left";

    const diff = (index - currentIndex + total) % total;
    return diff > total / 2 
      ? base + "z-0 opacity-0 hidden-slide-left pointer-events-none" 
      : base + "z-0 opacity-0 hidden-slide-right pointer-events-none";
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[350px] md:h-[500px] lg:h-[600px] flex items-center justify-center perspective-container group touch-pan-y"
      >
        <button 
          onClick={prevSlide} 
          className="absolute left-2 md:left-8 lg:left-12 z-40 p-3 md:p-4 rounded-full bg-white/10 dark:bg-surface-dark/50 backdrop-blur-md border border-white/20 dark:border-white/10 text-gray-800 dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg hover:shadow-neon transform hover:-translate-x-1 hidden md:flex"
        >
          <span className="material-icons text-xl md:text-3xl">chevron_left</span>
        </button>

        <button 
          onClick={nextSlide} 
          className="absolute right-2 md:right-8 lg:right-12 z-40 p-3 md:p-4 rounded-full bg-white/10 dark:bg-surface-dark/50 backdrop-blur-md border border-white/20 dark:border-white/10 text-gray-800 dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg hover:shadow-neon transform hover:translate-x-1 hidden md:flex"
        >
          <span className="material-icons text-xl md:text-3xl">chevron_right</span>
        </button>

        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div 
                key={slide.id} 
                className={getSlideClassName(index)} 
                onClick={() => goToSlide(index)}
                onMouseEnter={() => isActive && setIsHoveringActiveSlide(true)}
                onMouseLeave={() => isActive && setIsHoveringActiveSlide(false)}
                style={getDynamicStyle(index)}
              >
                <div className="relative w-full h-full pointer-events-auto">
                  {isActive && (
                    <div className="absolute -inset-[3px] rounded-3xl bg-gradient-to-r from-primary via-sunset to-gold opacity-75 blur-sm z-0"></div>
                  )}
                  <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/10 bg-gray-900 z-10">
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title} 
                      className={`w-full h-full object-cover transition-all duration-[15s] ease-linear`}
                      style={{
                        transform: isActive 
                          ? `scale(${isHoveringActiveSlide ? 1.18 : 1.1}) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` 
                          : 'scale(1)',
                        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.7s ease-in-out'
                      }}
                    />
                    {!isActive && <div className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-colors duration-500"></div>}
                    <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <h3 className="text-white font-display font-bold text-xl md:text-3xl tracking-wide mb-1 md:mb-2">{slide.title}</h3>
                      <p className="text-gray-300 font-sans text-xs md:text-base tracking-wide font-light">{slide.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 md:mt-12 flex flex-col items-center space-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          {slides.map((_, index) => {
            const active = index === currentIndex;
            return (
              <div key={index} className="group relative cursor-pointer" onClick={() => goToSlide(index)}>
                <div className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${active ? 'w-10 md:w-16 bg-gradient-to-r from-primary to-gold shadow-neon' : 'w-4 md:w-8 bg-gray-300 dark:bg-gray-700 hover:bg-primary/40'}`}></div>
              </div>
            );
          })}
        </div>
        <div className="text-[10px] md:text-xs font-mono text-gray-400 dark:text-gray-500 tracking-[0.3em] mt-1 md:mt-2">
          0{currentIndex + 1} <span className="mx-1 md:mx-2 opacity-30">/</span> 0{slides.length}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
