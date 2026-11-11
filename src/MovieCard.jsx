import { useState } from 'react'

const PLACEHOLDER_POSTER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">' +
    '<rect width="300" height="450" fill="#fff2f2"/>' +
    '<rect x="26" y="26" width="248" height="398" rx="18" fill="none" stroke="#ffc9c6" stroke-width="2" stroke-dasharray="10 8"/>' +
    '<circle cx="150" cy="196" r="34" fill="none" stroke="#ffd1ce" stroke-width="3"/>' +
    '<circle cx="150" cy="196" r="11" fill="#ffd1ce"/>' +
    '<text x="150" y="268" text-anchor="middle" font-family="Nunito, Segoe UI, Arial, sans-serif" font-size="19" font-weight="700" fill="#f0a09a">Нет постера</text>' +
    '</svg>',
)}`

const TYPE_LABELS = {
  movie: 'Фильм',
  series: 'Сериал',
  episode: 'Эпизод',
}

function MovieCard({ movie }) {
  const initialPoster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER_POSTER
  const [poster, setPoster] = useState(initialPoster)

  function handlePosterError() {
    if (poster !== PLACEHOLDER_POSTER) setPoster(PLACEHOLDER_POSTER)
  }

  const imdbUrl = movie.imdbID ? `https://www.imdb.com/title/${movie.imdbID}/` : null

  const card = (
    <>
      <div className="movie-card__poster">
        <img src={poster} alt={`Постер фильма «${movie.Title}»`} loading="lazy" onError={handlePosterError} />
        {movie.Type && (
          <span className="movie-card__type">{TYPE_LABELS[movie.Type] ?? movie.Type}</span>
        )}
      </div>
      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.Title}</h3>
        <dl className="movie-card__meta">
          <div>
            <dt>Год</dt>
            <dd>{movie.Year}</dd>
          </div>
        </dl>
      </div>
    </>
  )

  if (!imdbUrl) return <article className="movie-card">{card}</article>

  return (
    <a className="movie-card" href={imdbUrl} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  )
}

export default MovieCard
