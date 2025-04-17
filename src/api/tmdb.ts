import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// 創建axios實例
const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'zh-TW'
    }
});

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
}

export interface MovieResponse {
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export const tmdbService = {
    // 獲取正在上映的電影
    getNowPlaying: async (page: number = 1) => {
        const response = await tmdbApi.get<MovieResponse>('/movie/now_playing', {
            params: { page }
        });
        return response.data;
    },

    // 獲取即將上映的電影
    getUpcoming: async (page: number = 1) => {
        const response = await tmdbApi.get<MovieResponse>('/movie/upcoming', {
            params: { page }
        });
        return response.data;
    },

    // 搜索電影
    searchMovies: async (query: string, page: number = 1) => {
        const response = await tmdbApi.get<MovieResponse>('/search/movie', {
            params: { query, page }
        });
        return response.data;
    },

    // 獲取電影詳情
    getMovieDetails: async (movieId: number) => {
        const response = await tmdbApi.get(`/movie/${movieId}`);
        return response.data;
    }
}; 