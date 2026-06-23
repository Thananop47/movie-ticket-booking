/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GenreType } from '../common/enums/movie-genre.enum';

/**
 * ข้อมูลหนัง 15 เรื่อง ครอบคลุมทุก Genre ใน enum
 * posterUrl ใช้ placeholder ที่ render จริงได้ (ไม่ใช่ URL ปลอม)
 */
export const MOVIE_SEED_DATA = [
  {
    title: 'Inception',
    genre: GenreType.SCI_FI,
    durationMinutes: 148,
    synopsis:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/gVhGjY9k7mUvsLn0ea2obchJXgk.jpg',
    director: 'Christopher Nolan',
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
    rating: 'PG-13',
  },
  {
    title: 'Interstellar',
    genre: GenreType.SCI_FI,
    durationMinutes: 169,
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes uninhabitable.",
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/aDJlk2mPEo0weBzJ1eikAqZeHwS.jpg',
    director: 'Christopher Nolan',
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
    rating: 'PG-13',
  },
  {
    title: 'The Conjuring',
    genre: GenreType.HORROR,
    durationMinutes: 112,
    synopsis:
      'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/dzp7dWsAXvbyEYyZRxkYBycfpGd.jpg',
    director: 'James Wan',
    cast: 'Patrick Wilson, Vera Farmiga, Lili Taylor',
    rating: 'R',
  },
  {
    title: 'Hereditary',
    genre: GenreType.HORROR,
    durationMinutes: 127,
    synopsis:
      'A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/1Db2JEcbNJDtRFf9792zJ8QVvxP.jpg',
    director: 'Ari Aster',
    cast: 'Toni Collette, Alex Wolff, Milly Shapiro',
    rating: 'R',
  },
  {
    title: 'La La Land',
    genre: GenreType.ROMANCE,
    durationMinutes: 128,
    synopsis:
      'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/58hnrv3h02txPhYlu5ZwhgAt3Pb.jpg',
    director: 'Damien Chazelle',
    cast: 'Ryan Gosling, Emma Stone',
    rating: 'PG-13',
  },
  {
    title: 'The Notebook',
    genre: GenreType.ROMANCE,
    durationMinutes: 123,
    synopsis:
      'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated by social differences.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/ejRGXck0CehfmYFtRSw2A4DbjvR.jpg',
    director: 'Nick Cassavetes',
    cast: 'Ryan Gosling, Rachel McAdams',
    rating: 'PG-13',
  },
  {
    title: 'Inside Out',
    genre: GenreType.ANIMATION,
    durationMinutes: 95,
    synopsis:
      'After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions conflict on how best to navigate a new city, house, and school.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/35I2iQlscBsOyLnlwYuYpb3bJG2.jpg',
    director: 'Pete Docter',
    cast: 'Amy Poehler, Phyllis Smith, Bill Hader',
    rating: 'PG',
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    genre: GenreType.ANIMATION,
    durationMinutes: 117,
    synopsis:
      'Teen Miles Morales becomes Spider-Man and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/ptMVSBXjD5Ty5nLDnKxmcRI9NyF.jpg',
    director: 'Bob Persichetti',
    cast: 'Shameik Moore, Jake Johnson, Hailee Steinfeld',
    rating: 'PG',
  },
  {
    title: 'John Wick',
    genre: GenreType.ACTION,
    durationMinutes: 101,
    synopsis:
      'An ex-hitman comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/4o9DGK9EjpMB8TljOGTc3a0KgnM.jpg',
    director: 'Chad Stahelski',
    cast: 'Keanu Reeves, Michael Nyqvist, Alfie Allen',
    rating: 'R',
  },
  {
    title: 'Mad Max: Fury Road',
    genre: GenreType.ACTION,
    durationMinutes: 120,
    synopsis:
      'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/gioi31RDMpSMwlDmnx6MTaggsPt.jpg',
    director: 'George Miller',
    cast: 'Tom Hardy, Charlize Theron',
    rating: 'R',
  },
  {
    title: 'The Hangover',
    genre: GenreType.COMEDY,
    durationMinutes: 100,
    synopsis:
      'Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the bachelor missing.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/50PEirTiB1evtSmkNWRLh3gozpm.jpg',
    director: 'Todd Phillips',
    cast: 'Bradley Cooper, Ed Helms, Zach Galifianakis',
    rating: 'R',
  },
  {
    title: 'Superbad',
    genre: GenreType.COMEDY,
    durationMinutes: 113,
    synopsis:
      'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.',
    posterUrl: 'https://placehold.co/400x600/1a1a2e/e94560?text=Superbad',
    director: 'Greg Mottola',
    cast: 'Jonah Hill, Michael Cera',
    rating: 'R',
  },
  {
    title: 'The Shawshank Redemption',
    genre: GenreType.DRAMA,
    durationMinutes: 142,
    synopsis:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    director: 'Frank Darabont',
    cast: 'Tim Robbins, Morgan Freeman',
    rating: 'R',
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    genre: GenreType.FANTASY,
    durationMinutes: 178,
    synopsis:
      'A meek hobbit and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/wDXHlJRBrVt4HSEIV6zhPVGn5nv.jpg',
    director: 'Peter Jackson',
    cast: 'Elijah Wood, Ian McKellen, Viggo Mortensen',
    rating: 'PG-13',
  },
  {
    title: 'Free Solo',
    genre: GenreType.DOCUMENTARY,
    durationMinutes: 100,
    synopsis:
      'Alex Honnold attempts to become the first person to ever free solo climb El Capitan, scaling 3,000 feet of granite rock without a rope.',
    posterUrl:
      'https://media.themoviedb.org/t/p/w94_and_h141_face/v4QfYZMACODlWul9doN9RxE99ag.jpg',
    director: 'Jimmy Chin',
    cast: 'Alex Honnold, Tommy Caldwell',
    rating: 'PG-13',
  },
];
