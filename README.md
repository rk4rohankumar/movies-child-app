# Movies · Micro Frontend remote

OMDb movie search (search box, 10-per-page pagination, poster grid) packaged as a
webpack Module Federation remote. It runs standalone on Vercel and is loaded at
runtime by the [micro-frontend host](https://github.com/rk4rohankumar/micro-frontend-host).

Stack: CRA 5 + CRACO 7, React 19, Tailwind 3, axios, framer-motion.

## Data source

[OMDb API](https://www.omdbapi.com/). Put your key in `.env`:

```
REACT_APP_OMDB_API_KEY=your_key
```

(See `.env.example`.) OMDb returns `"N/A"` when it has no poster, and some
`m.media-amazon.com` poster URLs 404; both cases fall back to `PosterPlaceholder`
inside a fixed 2:3 box so the grid never shifts.

## Run / build

```bash
npm install
npm start          # http://localhost:3000 (dev publicPath '/')
npm run build      # production build in build/ (publicPath 'auto')
```

## How the host consumes it

| | |
|---|---|
| Scope name | `MoviesApp` |
| Remote entry | `https://movies-child-app.vercel.app/remoteEntry.js` |
| Exposed module | `./MoviesApp` → `src/App` |

The host injects `remoteEntry.js`, calls `container.init(__webpack_share_scopes__.default)`
and then `container.get('./MoviesApp')`. `src/index.js` is an async boundary
(`import('./bootstrap')`) so shared modules are negotiated before anything renders.

### Shared singletons

`react`, `react-dom`, `framer-motion` and `axios` are declared `singleton: true`
with `requiredVersion` taken from `package.json`. The host must provide the same
singletons (and a compatible React major) or webpack will warn and fall back to
this remote's own copy, which breaks hooks and context across the boundary.
`publicPath` is `'auto'` in production so chunks resolve relative to wherever
`remoteEntry.js` was fetched from.
