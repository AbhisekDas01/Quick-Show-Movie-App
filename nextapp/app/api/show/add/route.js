import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import axios from 'axios';
import { connectDb } from '@/lib/db';
import Movie from '@/lib/models/Movie.model';
import Show from '@/lib/models/Show.model';
import { inngest } from '@/lib/inngest';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await clerkClient().users.getUser(userId);
        if (user.privateMetadata?.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Not Authorized' }, { status: 403 });
        }

        await connectDb();

        const { movieId, showsInput, showPrice } = await request.json();

        let movie = await Movie.findById(movieId);

        if (!movie) {
            const [movieDetailsResponse, movieCreditResponse, movieTrailerResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditData = movieCreditResponse.data;
            const movieTrailerUrl = movieTrailerResponse?.data?.results
                ?.filter(({ site, type, official }) => site === 'YouTube' && type === 'Trailer' && official)
                ?.map(({ key, published_at }) => ({
                    url: `https://www.youtube.com/watch?v=${key}`,
                    published_at
                }))
                ?.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0]?.url || null;

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || '',
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
                trailer_link: movieTrailerUrl
            };

            movie = await Movie.create(movieDetails);
        }

        const showsToCreate = [];

        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach(time => {
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                });
            });
        });

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        await inngest.send({
            name: 'app/show.added',
            data: {
                movieId,
                movieTitle: movie.title,
                posterUrl: process.env.TMDB_IMAGE_BASE_URL + movie.poster_path,
                year: new Date(movie.release_date).getFullYear(),
                genre: movie.genres.slice(0, 3).map(({ name }) => name).join(', '),
                description: movie.overview,
                bookingUrl: `${process.env.CLIENT_BASE_URL}/movies/${movieId}`
            }
        });

        return NextResponse.json({ success: true, message: 'Show Added successfully.' });
    } catch (error) {
        console.error('Error in addShow:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
