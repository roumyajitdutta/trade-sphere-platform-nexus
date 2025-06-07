
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  textPosition: 'left' | 'center' | 'right';
  theme: 'light' | 'dark';
  badge?: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Summer Collection 2024',
    subtitle: 'Discover the latest trends in fashion with up to 50% off on selected items',
    ctaText: 'Shop Collection',
    ctaLink: '/products?category=clothing',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    textPosition: 'left',
    theme: 'dark',
    badge: 'New Collection'
  },
  {
    id: '2',
    title: 'Tech Sale Event',
    subtitle: 'Get the latest electronics and gadgets at unbeatable prices',
    ctaText: 'Explore Deals',
    ctaLink: '/products?category=electronics',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    textPosition: 'center',
    theme: 'light',
    badge: 'Limited Time'
  },
  {
    id: '3',
    title: 'Home & Kitchen Essentials',
    subtitle: 'Transform your living space with our curated home collection',
    ctaText: 'Shop Now',
    ctaLink: '/products?category=home-kitchen',
    backgroundImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80',
    textPosition: 'right',
    theme: 'dark'
  },
  {
    id: '4',
    title: 'Free Shipping Weekend',
    subtitle: 'No minimum order required. Free shipping on all orders this weekend only',
    ctaText: 'Start Shopping',
    ctaLink: '/products',
    backgroundImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    textPosition: 'center',
    theme: 'light',
    badge: 'Free Shipping'
  },
  {
    id: '5',
    title: 'Flash Sale - 70% Off',
    subtitle: 'Hurry! Limited time flash sale on selected categories. Don\'t miss out!',
    ctaText: 'Shop Flash Sale',
    ctaLink: '/products?sale=true',
    backgroundImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    textPosition: 'left',
    theme: 'dark',
    badge: 'Flash Sale'
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <div 
      className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.backgroundImage}
          alt={currentSlideData.title}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-700",
            currentSlideData.theme === 'dark' 
              ? "bg-black/40" 
              : "bg-white/20"
          )}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={cn(
            "h-full flex items-center",
            currentSlideData.textPosition === 'left' && "justify-start",
            currentSlideData.textPosition === 'center' && "justify-center text-center",
            currentSlideData.textPosition === 'right' && "justify-end text-right"
          )}
        >
          <div className="max-w-2xl space-y-6 animate-fade-in">
            {/* Badge */}
            {currentSlideData.badge && (
              <div className="inline-flex">
                <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  {currentSlideData.badge}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
                currentSlideData.theme === 'dark' ? "text-white" : "text-gray-900"
              )}
            >
              {currentSlideData.title}
            </h1>

            {/* Subtitle */}
            <p 
              className={cn(
                "text-lg md:text-xl leading-relaxed max-w-xl",
                currentSlideData.theme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}
            >
              {currentSlideData.subtitle}
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 group/btn"
                asChild
              >
                <a href={currentSlideData.ctaLink}>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {currentSlideData.ctaText}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoPlaying ? (
            <div className="w-2 h-4 space-x-1 flex">
              <div className="w-0.5 h-full bg-white"></div>
              <div className="w-0.5 h-full bg-white"></div>
            </div>
          ) : (
            <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ 
            width: isAutoPlaying && !isPaused ? `${((currentSlide + 1) / heroSlides.length) * 100}%` : '0%' 
          }}
        />
      </div>
    </div>
  );
};

export default HeroBanner;
