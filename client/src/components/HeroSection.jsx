import React, { useState, useEffect } from 'react'
import { ArrowRight, CalculatorIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import timeFormat from '../lib/timeFormat'

const HeroSection = () => {

    const navigate = useNavigate();
    const { shows, image_base_url } = useAppContext();
    const [currentIndex, setCurrentIndex] = useState(0);

    const featuredMovies = shows ? shows.slice(0, 5) : [];

    useEffect(() => {
        if (featuredMovies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [featuredMovies.length]);

    if (!featuredMovies.length) {
        return <div className="h-screen bg-gray-900 flex items-center justify-center">Loading...</div>;
    }

    const currentMovie = featuredMovies[currentIndex];
    const bgImage = `${image_base_url}${currentMovie.backdrop_path}`;

    return (
        <div 
            className='relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-[90vh] md:h-screen transition-all duration-700 pt-24 md:pt-0'
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Added a subtle overlay for better text readability */}
            <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent'></div>

            <div className='relative z-10 w-full max-w-2xl md:mt-24'>
                <h1 className='text-4xl md:text-5xl lg:text-[70px] lg:leading-[1.1] font-semibold mb-4 text-white drop-shadow-lg line-clamp-2'>
                    {currentMovie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-300 mb-6 text-sm md:text-base font-medium">
                    <span className="text-Primary">
                        {currentMovie.genres?.map(g => g.name).slice(0, 3).join(' | ') || 'Genres'}
                    </span>
                    <span className="hidden md:inline">•</span>
                    <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-md">
                        <CalculatorIcon className='w-4 h-4 text-Primary' /> 
                        {new Date(currentMovie.release_date).getFullYear()}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-md">
                        <ClockIcon className='w-4 h-4 text-Primary' /> 
                        {timeFormat(currentMovie.runtime)}
                    </div>
                </div>

                <p className='text-gray-300/90 mb-8 md:text-lg line-clamp-3 md:line-clamp-4 leading-relaxed'>
                    {currentMovie.overview}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button 
                        onClick={() => navigate(`/movies/${currentMovie._id}`)} 
                        className='w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-Primary hover:bg-Primary-dull text-white transition-all rounded-full font-semibold cursor-pointer shadow-lg shadow-Primary/30 hover:scale-105'
                    >
                        View Details 
                        <ArrowRight className='w-5 h-5'/>
                    </button>
                    
                    {/* Carousel Indicators */}
                    <div className="flex gap-2 mt-4 sm:mt-0">
                        {featuredMovies.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    index === currentIndex ? 'w-8 bg-Primary' : 'w-3 bg-gray-500 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection