import axios from "axios"
import { TMDB_API_KEY } from "../config/env.js"



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