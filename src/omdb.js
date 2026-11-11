const API_KEY = import.meta.env.VITE_OMDB_API_KEY?.trim()
const BASE_URL = 'https://www.omdbapi.com/'

export async function searchMovies(query) {
  if (!API_KEY) {
    throw new Error('Не задан ключ OMDb API. Добавьте VITE_OMDB_API_KEY в файл .env')
  }

  const url = `${BASE_URL}?apikey=${encodeURIComponent(API_KEY)}&s=${encodeURIComponent(query)}`

  let res
  try {
    res = await fetch(url)
  } catch {
    throw new Error('Ошибка сети: не удалось связаться с OMDb')
  }

  if (res.status === 401) {
    throw new Error(
      'Ключ OMDb не принят (401): проверьте, что он активирован по ссылке из письма и вставлен без пробелов',
    )
  }

  if (!res.ok) {
    throw new Error(`Ошибка сети: сервер ответил ${res.status}`)
  }

  try {
    return await res.json()
  } catch {
    throw new Error('Сервер вернул некорректный ответ')
  }
}
