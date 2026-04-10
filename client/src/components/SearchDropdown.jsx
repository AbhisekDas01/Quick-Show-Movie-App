import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon, X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const SearchDropdown = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { axios, image_base_url } = useAppContext();

    // Debounce timer
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
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
                setIsOpen(data.results.length > 0);
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className='relative w-full md:w-56 lg:w-72'>
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
                {searchQuery && (
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
                )}
            </div>

            {isOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden'>
                    {loading ? (
                        <div className='p-4 text-center text-gray-400'>
                            <p className='text-sm'>Searching...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className='max-h-96 overflow-y-auto'>
                            {results.map((movie) => (
                                <div
                                    key={movie.id}
                                    onClick={() => handleMovieSelect(movie._id)}
                                    className='flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition border-b border-gray-800 last:border-b-0'
                                >
                                    <img
                                        src={`${image_base_url}${movie.poster_path || movie.backdrop_path}`}
                                        alt={movie.title}
                                        className='w-10 h-14 object-cover rounded'
                                    />
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-white text-sm font-medium truncate'>{movie.title}</p>
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
                        <div className='p-4 text-center text-gray-400'>
                            <p className='text-sm'>No movies found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchDropdown
