import React, { useState, useEffect } from 'react';

const API_KEY = 'ВАШ_КЛЮЧ_ЗДЕСЬ'; // 👈 НЕ ЗАБУДЬТЕ ВСТАВИТЬ КЛЮЧ

export function MovieCard({ movie }) {
  const [plot, setPlot] = useState('');
  const [plotLoading, setPlotLoading] = useState(true);

  // Заглушка для постера, если API вернул "N/A"
  const posterUrl = movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://via.placeholder.com/300x450?text=No+Poster';

  // Запрос описания (доп. задание)
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPlot = async () => {
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`, {
          signal: controller.signal
        });
        const data = await res.json();
        if (data.Plot && data.Plot !== 'N/A') {
          setPlot(data.Plot);
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setPlotLoading(false);
      }
    };

    fetchPlot();
    return () => controller.abort();
  }, [movie.imdbID]);

  return (
    <article className="movie-card">
      <img src={posterUrl} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <p><strong>Год:</strong> {movie.Year}</p>
      <p>
        <strong>Описание:</strong> {plotLoading ? 'Загрузка...' : (plot || 'Нет описания')}
      </p>
    </article>
  );
}