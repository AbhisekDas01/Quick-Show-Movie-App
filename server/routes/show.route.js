import { Router } from "express";
import { addShow, getNowPlayingMovies, getShow, getShows, getUniversalReleases, searchMovies } from "../controllers/show.controller.js";
import { protectAdmin } from "../middleware/auth.middleware.js";

const showRouter = Router();

showRouter.get('/now-playing', protectAdmin , getNowPlayingMovies);
showRouter.get('/universal-releases', getUniversalReleases);
showRouter.get('/search/:query', searchMovies);
showRouter.post('/add' , protectAdmin,  addShow);
showRouter.get('/all' , getShows);
showRouter.get('/:movieId' , getShow);

export default showRouter;