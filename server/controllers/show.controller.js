import axios from "axios"
import { CLIENT_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL } from "../config/env.js"
import Movie from "../models/Movie.model.js";
import Show from "../models/Show.model.js";
import { inngest } from "../inngest/index.js";



//api to get now playing movies 
export const getNowPlayingMovies = async (req, res) => {
    try {

        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {
                Authorization: `Bearer ${TMDB_API_KEY}`
            }
        });



        // const url = 'https://api.themoviedb.org/3/movie/now_playing';

        // const options = {
        //     method: 'GET',
        //     headers: {
        //         accept: 'application/json',
        //         Authorization: `Bearer ${TMDB_API_KEY}`
        //     }
        // }

        // fetch(url , options)
        // .then(res => res.json())
        // .then(data => res.json({
        //     success: true,
        //     movies: data
        // }))
        // .catch(err => console.error(err));

        const movies = data.results;

        res.json({
            success: true,
            movies
        })


    } catch (error) {

        console.log("Error in getnowplaying", error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}

//API to add a new show to the database

export const addShow = async (req, res) => {

    try {

        const { movieId, showsInput, showPrice } = req.body;

        let movie = await Movie.findById(movieId);

        if (!movie) {
            //fetch movie details and creditsform TMDB API;

            const [movieDetailsResponse, movieCreditResponse , movieTrailer] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: {
                        Authorization: `Bearer ${TMDB_API_KEY}`
                    }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: {
                        Authorization: `Bearer ${TMDB_API_KEY}`
                    }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos` , {
                    headers: {
                        Authorization: `Bearer ${TMDB_API_KEY}`
                    }
                })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditData = movieCreditResponse.data;
            const movieTrailerData = movieTrailer?.data?.results
            ?.filter(({site , type , official}) => site === 'YouTube' && type==='Trailer' && official)
            ?.map(({key , published_at}) => ({
                url: `https://www.youtube.com/watch?v=${key}`,
                published_at
            }))
            ?.sort((a , b) => new Date(b.published_at) - new Date(a.published_at))[0]?.url || null;
            
            const movieDetails = {
                _id: movieId,
                title : movieApiData.title,
                overview : movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditData.cast,
                release_date : movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
                trailer_link: movieTrailerData
            }

            

            //add movie to the DB
            movie = await Movie.create(movieDetails);

        }

        const showsToCreate = [];

        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            } )
        });

        if(showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        

        //inngest function to send email notification 
        await inngest.send({
            name: 'app/show.added',
            data: {
                movieId: movieId,
                movieTitle: movie.title,
                posterUrl:  TMDB_IMAGE_BASE_URL + movie.poster_path,
                year: new Date(movie.release_date).getFullYear(),
                genre: movie.genres.slice(0 , 3).map(({name}) => name).join(", "),
                description: movie.overview,
                bookingUrl: `${CLIENT_BASE_URL}/movies/${movieId}`
            }
        })

        res.json({
            success: true,
            message: "Show Added successfully."
        })

    } catch (error) {
        console.log("Error in addShow", error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}

//API to get all show from the database

export const getShows = async (req , res) => {

    try {
        
        const shows = await Show.find({
            showDateTime: {$gte: new Date()}
        })
        .populate('movie') // Replaces movie ID with full movie document (title, poster, etc.)
        .sort({showDateTime: 1});

        //filter unique shows 
        const uniqueShows = new Set(shows.map(show => show.movie));

        res.json({
            success : true,
            shows: Array.from(uniqueShows)
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

//API to get single show from the data base
export const getShow = async (req , res) => {

    try {
        
        const {movieId } = req.params;

        //get all upcomming shows for the movie
        const shows = await Show.find({movie: movieId , showDateTime: {$gte: new Date()}});

        const movie = await Movie.findById(movieId);

        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];

            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({
                time: show.showDateTime,
                showId: show._id,

            })
        })

        res.json({
            success: true ,
            movie,
            dateTime
        })


    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        })
        
    }
}