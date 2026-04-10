import React, { useRef, useState } from 'react'
import { SearchIcon, X, Loader, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const FloatingSearchButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { axios, image_base_url } = useAppContext();

    // Debounce timer
    React.useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                performSearch();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const performSearch = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/show/search/${searchQuery}`);
            if (data.success) {
                setResults(data.results);
            }
        } catch (error) {
            console.error("Error searching", error);
        } finally {
            setLoading(false);
        }
    }

    const handleMovieSelect = (movieId) => {
        navigate(`/movies/${movieId}`);
        handleClose();
    }

    const handleClose = () => {
        setSearchQuery('');
        setResults([]);
        setIsOpen(false);
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => {
                    setIsOpen(true);
                    setTimeout(() => inputRef.current?.focus(), 100);
                }}
                className='fixed bottom-24 right-6 z-40 bg-Primary hover:bg-Primary-dull p-4 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 duration-200 md:hidden'
            >
                <SearchIcon className='w-6 h-6 text-white' />
            </button>
        );
    }

    return (
        <div className='fixed inset-0 bg-black/95 z-50 md:hidden overflow-y-auto pt-20'>
            <div className='px-4 pb-20'>
                <div className='flex items-center gap-3 mb-6 sticky top-20 bg-black/95 pt-4'>
                    <button
                        onClick={handleClose}
                        className='p-2 hover:bg-gray-800 rounded-full'
                    >
                        <ArrowLeft className='w-6 h-6 text-white' />
                    </button>
                    <div className='flex-1 flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700'>
                        <SearchIcon className='w-5 h-5 text-gray-400' />
                        <input
                            ref={inputRef}
                            type='text'
                            placeholder='Search movies...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='bg-transparent text-white outline-none placeholder-gray-500 text-sm flex-1'
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setResults([]);
                                }}
                                className='hover:bg-gray-700 p-1 rounded'
                            >
                                <X className='w-4 h-4 text-gray-400' />
                            </button>
                        )}
                    </div>
                </div>

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
                    <div className='space-y-3'>
                        {results.map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => handleMovieSelect(movie._id)}
                                className='flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition rounded-lg bg-gray-800/50'
                            >
                                <img
                                    src={`${image_base_url}${movie.poster_path || movie.backdrop_path}`}
                                    alt={movie.title}
                                    className='w-16 h-24 object-cover rounded'
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
                ) : searchQuery ? (
                    <div className='p-6 text-center text-gray-400'>
                        <p className='text-sm'>No movies found for "{searchQuery}"</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default FloatingSearchButton;
