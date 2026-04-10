import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle';
import { PlayCircleIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TrailerSection = () => {

    const { axios, image_base_url } = useAppContext();
    const [currentTrailer, setCurrentTrailer] = useState(null);
    const [trailerMovies, setTrailerMovies] = useState([]);

    const fetchUniversalReleaseTrailers = async () => {
        try {
            const { data } = await axios.get('/api/show/universal-releases');
            if(data.success && data.movies) {
                // Filter only movies with a real trailer link and a backdrop
                const validTrailers = data.movies
                   .filter(m => m.trailer_link && m.backdrop_path)
                   .map(m => ({ ...m, _id: m.id })) // map id to _id so it works consistently
                   .slice(0, 4);
                
                setTrailerMovies(validTrailers);
            }
        } catch(error) {
            console.error("Error fetching trailers", error);
        }
    }

    useEffect(() => {
        fetchUniversalReleaseTrailers();
    }, []);

    useEffect(() => {
        if (trailerMovies.length > 0 && !currentTrailer) {
            setCurrentTrailer(trailerMovies[0]);
        }
    }, [trailerMovies, currentTrailer]);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>

        <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>Upcoming Release Trailers</p>

        <div className='relative mt-6'>
            <BlurCircle top='-100px' right='-100px' />
            {currentTrailer ? (
                <div className='mx-auto max-w-full rounded-2xl overflow-hidden shadow-xl shadow-Primary/10' style={{ maxWidth: '960px' }}>
                    <ReactPlayer 
                        url={currentTrailer.trailer_link} 
                        controls={true} 
                        width="100%" 
                        height="540px" 
                        playing={true}
                        muted={true}
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center w-full max-w-[960px] mx-auto h-[540px] bg-gray-900 rounded-2xl border border-gray-800">
                    <p className="text-gray-500">No trailers available at the moment.</p>
                </div>
            )}
        </div>

        <div className="group grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-[960px] mx-auto">

            {trailerMovies.map((movie) => (
                <div 
                    key={movie._id} 
                    onClick={() => setCurrentTrailer(movie)}   
                    className={`relative hover:-translate-y-1 duration-300 transition h-32 md:h-40 cursor-pointer rounded-lg overflow-hidden border-2 ${currentTrailer?._id === movie._id ? 'border-Primary opacity-100 scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                >
                    <img 
                        src={`${image_base_url}${movie.backdrop_path}`} 
                        alt={movie.title} 
                        className='w-full h-full object-cover brightness-75 hover:brightness-100 transition' 
                    />

                    <PlayCircleIcon strokeWidth={1.6} className='absolute top-1/2 left-1/2 w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md transform -translate-x-1/2 -translate-y-1/2' />
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 md:p-3 text-xs md:text-sm truncate font-medium text-white">
                        {movie.title}
                    </div>
                </div>
            ))}

        </div>

    </div>
  )
}

export default TrailerSection