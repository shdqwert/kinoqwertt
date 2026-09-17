import { translate } from '../../i18n/translations.js'

const DUNE_REVIEWS_EN = [
  {
    id: 1,
    rating: '10',
    title: 'One Of The Greatest Sequel Ever Made, Dune: Part Two Was Easily The Best Films Of The Year So Far',
    username: 'username',
    date: '20 Feb 2024',
    body: "In the quiet embrace of ink and page, a story unfolded, timeless and sage, through the lens of a filmmaker's artistry, its essence soared, a masterpiece for all to see, i think Denis Villeneuve has just made the most visually stunning epic story of a movie that's ever been made, the most powerful story of a movie ever been told in the last 20 years, there has been no movies with this scale resulting in not just a piece of a film no more but a piece of art, it's what Infinity War and Endgame looks like...",
    helpful: '210',
  },
  {
    id: 2,
    rating: '10',
    title: 'One Of The Greatest Sequel Ever Made, Dune: Part Two Was Easily The Best Films Of The Year So Far',
    username: 'username',
    date: '20 Feb 2024',
    body: "In the quiet embrace of ink and page, a story unfolded, timeless and sage, through the lens of a filmmaker's artistry, its essence soared, a masterpiece for all to see, i think Denis Villeneuve has just made the most visually stunning epic story of a movie that's ever been made, the most powerful story of a movie ever been told in the last 20 years, there has been no movies with this scale resulting in not just a piece of a film no more but a piece of art, it's what Infinity War and Endgame looks like...",
    helpful: '210',
  },
]

const DUNE_REVIEWS_RU = [
  {
    id: 1,
    rating: '10',
    title: 'Один из величайших сиквелов, «Дюна: Часть вторая» — уже лучший фильм этого года',
    username: 'username',
    date: '20 фев 2024',
    body: 'В тихих объятиях чернил и страниц разворачивалась история, вечная и мудрая, и через объектив режиссёрского мастерства её суть воспарила — шедевр для всех. Мне кажется, Дени Вильнёв снял самую визуально ошеломляющую эпическую историю за последние 20 лет: масштаб такой, что это уже не просто фильм, а произведение искусства — вот так должны выглядеть «Война бесконечности» и «Финал»...',
    helpful: '210',
  },
  {
    id: 2,
    rating: '10',
    title: 'Один из величайших сиквелов, «Дюна: Часть вторая» — уже лучший фильм этого года',
    username: 'username',
    date: '20 фев 2024',
    body: 'В тихих объятиях чернил и страниц разворачивалась история, вечная и мудрая, и через объектив режиссёрского мастерства её суть воспарила — шедевр для всех. Мне кажется, Дени Вильнёв снял самую визуально ошеломляющую эпическую историю за последние 20 лет: масштаб такой, что это уже не просто фильм, а произведение искусства — вот так должны выглядеть «Война бесконечности» и «Финал»...',
    helpful: '210',
  },
]

export function getReviewsFor(movie, lang = 'en') {
  if (movie.slug === 'dune-part-two') return lang === 'ru' ? DUNE_REVIEWS_RU : DUNE_REVIEWS_EN

  if (lang === 'ru') {
    const genre = movie.genres?.[0] ? translate('ru', movie.genres[0]).toLowerCase() : undefined
    return [
      {
        id: 1,
        rating: movie.score,
        title: `По-настоящему цепляет — «${movie.title}» не подводит`,
        username: 'username',
        date: '20 фев 2024',
        body: `Режиссура ${movie.director} держит «${movie.title}» от начала до конца — ${genre ? `элементы жанра «${genre}» ` : ''}работают, ${movie.stars[0]} полностью отдаётся роли, а темп не проседает. Фильм не идеален, но точно знает, каким хочет быть, и добивается этого.`,
        helpful: '84',
      },
      {
        id: 2,
        rating: movie.score,
        title: `Стоит своего времени, если вам нравится «${genre || 'этот жанр'}»`,
        username: 'username',
        date: '20 фев 2024',
        body: `Шёл со скромными ожиданиями, а вышел приятно удивлённым. ${movie.stars.slice(0, 2).join(' и ')} несут эмоциональную нагрузку истории, а финал полностью оправдывает себя. Рекомендую, если вам нравятся другие работы ${movie.director}.`,
        helpful: '52',
      },
    ]
  }

  const genre = movie.genres?.[0]?.toLowerCase()
  return [
    {
      id: 1,
      rating: movie.score,
      title: `A Genuinely Satisfying Watch — ${movie.title} Delivers`,
      username: 'username',
      date: '20 Feb 2024',
      body: `${movie.director}'s direction carries ${movie.title} from start to finish — the ${genre || ''} elements land, ${movie.stars[0]} commits fully to the role, and the pacing never drags. Not a flawless film, but one that knows exactly what it wants to be and delivers on it.`,
      helpful: '84',
    },
    {
      id: 2,
      rating: movie.score,
      title: `Worth Your Time If You Like ${movie.genres?.[0] || 'This Genre'}`,
      username: 'username',
      date: '20 Feb 2024',
      body: `Went in with modest expectations and came out pleasantly surprised. ${movie.stars.slice(0, 2).join(' and ')} carry the emotional weight of the story, and the last act sticks the landing. Recommended if you enjoyed ${movie.director}'s other work.`,
      helpful: '52',
    },
  ]
}
