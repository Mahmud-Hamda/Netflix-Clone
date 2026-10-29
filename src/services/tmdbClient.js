import axios from "axios";

/**
 * Axios instance preconfigured with the TMDB v3 API base URL.
 * Request paths must include their own query string (see `buildTmdbPath`
 * and `TMDB_ENDPOINTS`), including the API key.
 *
 * @type {import("axios").AxiosInstance}
 */
const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export { tmdbClient };
