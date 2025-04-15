import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const MinBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl mx-2 sm:mx-4 lg:mx-6 shadow-xl h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] transition-all duration-500 hover:shadow-2xl group">
      {/* Background image with responsive sources */}
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width: 1024px)" srcSet={assets.main_banner_bg_xl} />
          <source media="(min-width: 768px)" srcSet={assets.main_banner_bg} />
          <img 
            src={assets.main_banner_bg_sm} 
            alt="Fresh fruits and vegetables" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </picture>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/30"></div>

      {/* Content container */}
      <div className="relative h-full flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
            <span className="text-primary">Fresh</span> Groceries, 
            <br className="hidden sm:block" /> 
            <span className="text-primary-300">Smart</span> Savings
          </h1>
          
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 max-w-lg leading-relaxed backdrop-blur-sm">
            Quality produce at unbeatable prices delivered to your home
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium transform hover:-translate-y-1 active:translate-y-0"
            >
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm sm:text-base font-medium"
            >
              Today's Deals
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-600"></div>
      
      <div className="absolute top-6 right-6">
        <div className="bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse shadow-md flex items-center">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          New Arrivals!
        </div>
      </div>
    </div>
  );
};

export default MinBanner;