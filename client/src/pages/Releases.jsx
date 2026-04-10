import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';
import Loading from '../components/Loading';

const Releases = () => {

    const { axios } = useAppContext();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUniversalReleases = async () => {
        try {
            const { data } = await axios.get('/api/show/universal-releases');
            if (data.success) {
                // Ensure format matches what MovieCard expects
                // TMDB API gives genre_ids instead of genres array for listings
                // We'll mock it if it's missing, since MovieCard relies on it
                const formattedMovies = data.movies.map(m => ({
                    ...m,
                    id: m.id,
                    _id: m.id,
                    genres: m.genre_ids ? m.genre_ids.map(id => ({ name: 'Genre' })) : [{name: 'Action'}] 
                }));
                setReleases(formattedMovies);
            }
        } catch (error) {
            console.error("Error fetching releases from TMDB via backend", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUniversalReleases();
    }, []);

    if (loading) return <Loading />

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-30 md:pt-40'>
            
            <div className='relative'>
                <BlurCircle top='-80px' left='-80px' />
                <h1 className='text-3xl md:text-5xl font-semibold mb-2'>Universal <span className='text-Primary'>Releases</span></h1>
                <p className='text-gray-400 max-w-2xl'>
                    Discover the latest upcoming blockbuster movies directly from TMDB worldwide. Dive into details, watch trailers, and save your favorites!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-14">
                {releases.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

        </div>
    )
}

export default Releases;