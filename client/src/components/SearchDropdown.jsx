import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon, X, Loader, ArrowLeft } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const SearchDropdown = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { axios, image_base_url } = useAppContext();

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Debounce timer
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                setIsOpen(true); // Open dropdown immediately when user types
                performSearch();
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const performSearch = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/show/search/${searchQuery}`);
            if (data.success) {
                setResults(data.results);
                setIsOpen(data.results.length > 0 || loading);
            }
        } catch (error) {
            console.error("Error searching", error);
        } finally {
            setLoading(false);
        }
    }

    const handleMovieSelect = (movieId) => {
        navigate(`/movies/${movieId}`);
        setSearchQuery('');
        setResults([]);
        setIsOpen(false);
        scrollTo(0, 0);
    }

    const handleClose = () => {
        setSearchQuery('');
        setResults([]);
        setIsOpen(false);
    }

    // Close dropdown when clicking outside (desktop only)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target) && !isMobile) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile]);

    const ResultsContent = () => (
        <>
            {loading ? (
                <div className='p-6 text-center'>
                    <div className='flex justify-center items-center gap-2'>
                        <div className='w-2 h-2 bg-Primary rounded-full animate-bounce' style={{animationDelay: '0s'}}></div>
                        <div className='w-2 h-2 bg-Primary rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                        <div className='w-2 h-2 bg-Primary rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className='text-gray-400 text-sm mt-3'>Searching movies...</p>
                </div>
            ) : results.length > 0 ? (
                <div className={isMobile ? 'space-y-3 p-4' : 'max-h-96 overflow-y-auto'}>
                    {results.map((movie) => (
                        <div
                            key={movie.id}
                            onClick={() => handleMovieSelect(movie._id)}
                            className={`flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition rounded-lg ${!isMobile && 'border-b border-gray-800 last:border-b-0'} ${isMobile && 'bg-gray-800/50'}`}
                        >
                            <img
                                src={`${image_base_url}${movie.poster_path || movie.backdrop_path}`}
                                alt={movie.title}
                                className={`object-cover rounded ${isMobile ? 'w-16 h-24' : 'w-10 h-14'}`}
                            />
                            <div className='flex-1 min-w-0'>
                                <p className='text-white font-medium line-clamp-2'>{movie.title}</p>
                                <p className='text-gray-400 text-xs'>
                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                </p>
                            </div>
                            <div className='text-right'>
                                <p className='text-Primary text-xs font-semibold bg-Primary/20 px-2 py-1 rounded'>
                                    {movie.vote_average?.toFixed(1) || 'N/A'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='p-6 text-center text-gray-400'>
                    <p className='text-sm'>No movies found for "{searchQuery}"</p>
                </div>
            )}
        </>
    );

    if (isMobile) {
        return (
            <div ref={searchRef} className='w-full'>
                <div className='flex items-center gap-2 bg-gray-800/50 px-3 py-2.5 rounded-lg border border-gray-700'>
                    <SearchIcon className='w-5 h-5 text-gray-400' />
                    <input 
                        type='text'
                        placeholder='Search movies...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-transparent text-white outline-none placeholder-gray-500 text-sm flex-1'
                    />
                    {loading ? (
                        <Loader className='w-4 h-4 text-Primary animate-spin' />
                    ) : searchQuery ? (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setResults([]);
                                setIsOpen(false);
                            }}
                            className='hover:bg-gray-700 p-1 rounded'
                        >
                            <X className='w-4 h-4 text-gray-400' />
                        </button>
                    ) : null}
                </div>

                {isOpen && (
                    <div className='fixed inset-0 bg-black/95 z-50 top-0 left-0 right-0 bottom-0 overflow-y-auto pt-16'>
                        <div className='px-4 pb-20'>
                            <div className='flex items-center gap-3 mb-6 sticky top-16 bg-black/95 pt-4'>
                                <button
                                    onClick={handleClose}
                                    className='p-2 hover:bg-gray-800 rounded-full'
                                >
                                    <ArrowLeft className='w-6 h-6 text-white' />
                                </button>
                                <h2 className='text-xl font-semibold text-white'>Search Results</h2>
                            </div>
                            <ResultsContent />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Desktop dropdown view
    return (
        <div ref={searchRef} className='relative w-56 lg:w-72'>
            <div className='flex items-center gap-2 bg-gray-800/50 px-4 py-2.5 rounded-full border border-gray-700 hover:border-Primary transition'>
                <SearchIcon className='w-5 h-5 text-gray-400' />
                <input 
                    type='text'
                    placeholder='Search movies...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length > 0 && setIsOpen(true)}
                    className='bg-transparent text-white outline-none placeholder-gray-500 text-sm flex-1'
                />
                {loading ? (
                    <Loader className='w-4 h-4 text-Primary animate-spin' />
                ) : searchQuery ? (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        className='hover:bg-gray-700 p-1 rounded'
                    >
                        <X className='w-4 h-4 text-gray-400' />
                    </button>
                ) : null}
            </div>

            {(isOpen || searchQuery.trim().length > 0) && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden'>
                    <ResultsContent />
                </div>
            )}
        </div>
    )
}

export default SearchDropdown
