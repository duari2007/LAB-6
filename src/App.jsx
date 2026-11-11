import React, { useState, useEffect } from 'react';
import { MovieCard } from './components/MovieCard';

const API_KEY = '5d127567'; 

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('idle'); 
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');

  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
  });

  const fetchMovies = async (searchQuery, pageNumber = 1) => {
    if (!searchQuery.trim()) return;

    setStatus('loading');
    setError(null);

    try {
      const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&page=${pageNumber}&apikey=${API_KEY}`);
      const data = await res.json();

      if (data.Error) {
        setMovies([]);
        setStatus('error');
        setError('Ничего не найдено');
        return;
      }

      setMovies(data.Search || []);
      setTotalResults(Number(data.totalResults) || 0);
      setStatus('success');
      
      // Сохраняем в историю (только если это первый запрос, а не переключение страниц)
      if (pageNumber === 1) {
        setHistory(prev => {
          const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
          return newHistory;
        });
      }

    } catch (err) {
      setMovies([]);
      setStatus('error');
      setError('Ошибка сети. Проверьте подключение.');
    }
  };

  const handleSearch = () => {
    if (status !== 'loading') {
      setPage(1); // При новом поиске сбрасываем страницу на первую
      fetchMovies(query, 1);
    }
  };

  // Автопоиск с debounce
  useEffect(() => {
    if (query.trim() === '') {
      setMovies([]);
      setStatus('idle');
      return;
    }
    const timer = setTimeout(() => {
      setPage(1);
      fetchMovies(query, 1);
    }, 800);
    return () => clearTimeout(timer);
  }, [query]);

  // --- ЛОГИКА ФИЛЬТРАЦИИ ПО ГОДУ (на клиенте) ---
  const filteredMovies = movies.filter(movie => {
    const movieYear = parseInt(movie.Year.substring(0, 4)); // Берем только первые 4 цифры (на случай "2019–2021")
    const from = yearFrom ? parseInt(yearFrom) : 0;
    const to = yearTo ? parseInt(yearTo) : Infinity;
    return movieYear >= from && movieYear <= to;
  });

  // --- ЛОГИКА ПАГИНАЦИИ ---
  const totalPages = Math.ceil(totalResults / 10); // OMDb возвращает по 10 фильмов на страницу

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMovies(query, newPage);
    window.scrollTo(0, 0); // Прокрутка наверх при смене страницы
  };

  return (
    <div className="container">
      <h1>Поиск фильмов</h1>

      {history.length > 0 && (
        <div className="history">
          <strong>Последние запросы: </strong>
          {history.map(term => (
            <span key={term} onClick={() => { setQuery(term); setPage(1); fetchMovies(term, 1); }}>
              {term}
            </span>
          ))}
        </div>
      )}

      <div className="search-form">
        <input 
          type="text" 
          placeholder="Введите название фильма..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={status === 'loading'}>
          {status === 'loading' ? 'Поиск...' : 'Найти'}
        </button>
      </div>

      {/* ФИЛЬТРАЦИЯ ПО ГОДУ (Показываем только если есть результаты) */}
      {status === 'success' && movies.length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <strong>Фильтр по году:</strong>
          <input 
            type="number" placeholder="От" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} 
            style={{ padding: '5px', width: '80px' }}
          />
          <span>—</span>
          <input 
            type="number" placeholder="До" value={yearTo} onChange={(e) => setYearTo(e.target.value)} 
            style={{ padding: '5px', width: '80px' }}
          />
        </div>
      )}

      {status === 'idle' && <p className="status-message">Введите название фильма и нажмите «Найти».</p>}
      {status === 'loading' && <p className="status-message">Загрузка...</p>}
      {status === 'error' && <p className="status-message error-message">Ошибка: {error}</p>}
      
      {status === 'success' && filteredMovies.length === 0 && (
        <p className="status-message">По вашему запросу (с учетом фильтра по годам) ничего не найдено.</p>
      )}

      {status === 'success' && filteredMovies.length > 0 && (
        <>
          <div className="movie-list">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>

          {/* ПАГИНАЦИЯ (Кнопки) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <button 
              disabled={page === 1 || status === 'loading'} 
              onClick={() => handlePageChange(page - 1)}
              style={{ padding: '10px 20px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              Предыдущая
            </button>
            <span style={{ alignSelf: 'center' }}>Страница {page} из {totalPages}</span>
            <button 
              disabled={page === totalPages || status === 'loading'} 
              onClick={() => handlePageChange(page + 1)}
              style={{ padding: '10px 20px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Следующая
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;