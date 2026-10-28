# Netflix Clone

A movie and TV browser styled after Netflix. Posters, backdrops, descriptions, and trailers come from [TMDB](https://www.themoviedb.org/). This is a student project and is not affiliated with Netflix.

## Features

- Home, TV Shows, Movies, and New & Popular rows from TMDB
- Search from the header, plus a full results page
- Play opens a YouTube trailer when TMDB has one
- Sign up and sign in with email and password
- My List saved separately for each account
- Notifications for titles trending today
- Account page to rename the profile or change the password

Accounts, the signed-in session, and My List live in the browser’s local storage. There is no account server, so a list stays on the device and browser where it was saved.

Browse by Languages is still a placeholder page.

## Stack

- React 19
- React Router 7
- Vite 8
- Axios for TMDB requests

## Run it locally

Create a TMDB API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

```bash
npm install
```

Create a `.env` file in this folder:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

```bash
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the production site into `dist` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

## Deploy

Vercel and Netlify both work. Set `VITE_TMDB_API_KEY` in the host’s environment variables before the first build. Vite reads that variable while it builds.

Refreshing a route such as `/movies` or `/signin` needs the host to serve `index.html`. This repo includes `vercel.json` for Vercel and `public/_redirects` for Netlify.

Do not commit `.env`. It is listed in `.gitignore`. Any `VITE_` variable is copied into the public JavaScript bundle, so treat the TMDB key as public and regenerate it on TMDB if it leaks.
