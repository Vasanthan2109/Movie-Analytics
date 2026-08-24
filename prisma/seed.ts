import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Genres ---
  const genreData = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western',
    'Musical', 'Family', 'Biography', 'History', 'Sport'
  ];
  const genres: Record<string, string> = {};
  for (const name of genreData) {
    const g = await prisma.genre.create({ data: { name } });
    genres[name] = g.id;
  }

  // --- Streaming Platforms ---
  const platforms = await Promise.all([
    prisma.streamingPlatform.create({ data: { name: 'Netflix', description: 'World\'s leading streaming service with original content and vast library', brandColor: '#E50914' } }),
    prisma.streamingPlatform.create({ data: { name: 'Amazon Prime Video', description: 'Amazon\'s streaming platform with movies, TV shows, and originals', brandColor: '#00A8E1' } }),
    prisma.streamingPlatform.create({ data: { name: 'Disney+', description: 'Home of Disney, Pixar, Marvel, Star Wars, and National Geographic', brandColor: '#113CCF' } }),
    prisma.streamingPlatform.create({ data: { name: 'HBO Max', description: 'Premium streaming with HBO originals, Warner Bros. films, and more', brandColor: '#B026FF' } }),
    prisma.streamingPlatform.create({ data: { name: 'Apple TV+', description: 'Apple\'s streaming service featuring original content from top creators', brandColor: '#A2AAAD' } }),
    prisma.streamingPlatform.create({ data: { name: 'Hulu', description: 'Streaming service with next-day TV, originals, and add-on options', brandColor: '#1CE783' } }),
  ]);
  const platformMap: Record<string, string> = {};
  platforms.forEach(p => { platformMap[p.name] = p.id; });

  // --- People (Directors + Actors) ---
  const peopleData = [
    { name: 'Christopher Nolan' }, { name: 'Martin Scorsese' }, { name: 'Quentin Tarantino' },
    { name: 'Denis Villeneuve' }, { name: 'Ridley Scott' }, { name: 'Steven Spielberg' },
    { name: 'Wes Anderson' }, { name: 'Bong Joon-ho' }, { name: 'Jordan Peele' },
    { name: 'Greta Gerwig' }, { name: 'James Cameron' }, { name: 'Peter Jackson' },
    { name: 'David Fincher' }, { name: 'Guy Ritchie' }, { name: 'Taika Waititi' },
    { name: 'Timothée Chalamet' }, { name: 'Leonardo DiCaprio' }, { name: 'Brad Pitt' },
    { name: 'Cate Blanchett' }, { name: 'Meryl Streep' }, { name: 'Tom Hanks' },
    { name: 'Scarlett Johansson' }, { name: 'Robert Downey Jr.' }, { name: 'Florence Pugh' },
    { name: 'Pedro Pascal' }, { name: 'Zendaya' }, { name: 'Margot Robbie' },
    { name: 'Keanu Reeves' }, { name: 'Oscar Isaac' }, { name: 'Saoirse Ronan' },
    { name: 'Joaquin Phoenix' }, { name: 'Adam Driver' }, { name: 'Ana de Armas' },
    { name: 'Austin Butler' }, { name: 'Paul Mescal' }, { name: 'Sydney Sweeney' },
    { name: 'Will Smith' }, { name: 'Matt Damon' }, { name: 'Christian Bale' },
    { name: 'Emily Blunt' }, { name: 'Ryan Gosling' }, { name: 'Emma Stone' },
  ];
  const people: Record<string, string> = {};
  for (const p of peopleData) {
    const person = await prisma.person.create({ data: { name: p.name } });
    people[p.name] = person.id;
  }

  // --- Movies ---
  const movies = [
    {
      title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      releaseYear: 2008, runtime: 152, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 9.0, popularity: 87.5, voteCount: 2850000,
      directorId: people['Christopher Nolan'],
      genreNames: ['Action', 'Crime', 'Drama', 'Thriller'],
      castNames: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      platformNames: ['Netflix', 'HBO Max'],
    },
    {
      title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      releaseYear: 2010, runtime: 148, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.8, popularity: 91.2, voteCount: 2300000,
      directorId: people['Christopher Nolan'],
      genreNames: ['Action', 'Sci-Fi', 'Thriller'],
      castNames: ['Leonardo DiCaprio', 'Tom Hardy', 'Elliot Page'],
      platformNames: ['Amazon Prime Video', 'HBO Max'],
    },
    {
      title: 'Interstellar', description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
      releaseYear: 2014, runtime: 169, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.7, popularity: 88.9, voteCount: 1950000,
      directorId: people['Christopher Nolan'],
      genreNames: ['Adventure', 'Drama', 'Sci-Fi'],
      castNames: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      platformNames: ['Amazon Prime Video', 'Paramount+'],
    },
    {
      title: 'Oppenheimer', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
      releaseYear: 2023, runtime: 180, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.3, popularity: 95.1, voteCount: 850000,
      directorId: people['Christopher Nolan'],
      genreNames: ['Biography', 'Drama', 'History'],
      castNames: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
      platformNames: ['Apple TV+', 'Amazon Prime Video'],
    },
    {
      title: 'Pulp Fiction', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      releaseYear: 1994, runtime: 154, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.9, popularity: 82.3, voteCount: 2100000,
      directorId: people['Quentin Tarantino'],
      genreNames: ['Crime', 'Drama'],
      castNames: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
      platformNames: ['Netflix', 'Hulu'],
    },
    {
      title: 'Kill Bill: Vol. 1', description: 'After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.',
      releaseYear: 2003, runtime: 111, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.2, popularity: 75.6, voteCount: 1200000,
      directorId: people['Quentin Tarantino'],
      genreNames: ['Action', 'Crime', 'Thriller'],
      castNames: ['Uma Thurman', 'Lucy Liu', 'Vivica A. Fox'],
      platformNames: ['HBO Max'],
    },
    {
      title: 'Dune: Part Two', description: 'Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
      releaseYear: 2024, runtime: 166, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.5, popularity: 96.8, voteCount: 620000,
      directorId: people['Denis Villeneuve'],
      genreNames: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
      castNames: ['Timothée Chalamet', 'Zendaya', 'Austin Butler'],
      platformNames: ['HBO Max', 'Amazon Prime Video'],
    },
    {
      title: 'Blade Runner 2049', description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
      releaseYear: 2017, runtime: 164, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.0, popularity: 79.4, voteCount: 680000,
      directorId: people['Denis Villeneuve'],
      genreNames: ['Action', 'Drama', 'Mystery', 'Sci-Fi'],
      castNames: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
      platformNames: ['HBO Max', 'Hulu'],
    },
    {
      title: 'Arrival', description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
      releaseYear: 2016, runtime: 116, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 7.9, popularity: 76.1, voteCount: 740000,
      directorId: people['Denis Villeneuve'],
      genreNames: ['Drama', 'Mystery', 'Sci-Fi'],
      castNames: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker'],
      platformNames: ['HBO Max', 'Hulu'],
    },
    {
      title: 'Parasite', description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      releaseYear: 2019, runtime: 132, language: 'Korean', country: 'South Korea', ageCertification: 'R',
      rating: 8.5, popularity: 90.3, voteCount: 870000,
      directorId: people['Bong Joon-ho'],
      genreNames: ['Comedy', 'Drama', 'Thriller'],
      castNames: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
      platformNames: ['Hulu', 'Amazon Prime Video'],
    },
    {
      title: 'Get Out', description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.',
      releaseYear: 2017, runtime: 104, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 7.7, popularity: 78.5, voteCount: 680000,
      directorId: people['Jordan Peele'],
      genreNames: ['Horror', 'Mystery', 'Thriller'],
      castNames: ['Daniel Kaluuya', 'Allison Williams', 'Bradley Whitford'],
      platformNames: ['Netflix', 'Hulu'],
    },
    {
      title: 'Barbie', description: 'Barbie suffers a crisis that leads her to question her world and her existence.',
      releaseYear: 2023, runtime: 114, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 7.0, popularity: 97.2, voteCount: 520000,
      directorId: people['Greta Gerwig'],
      genreNames: ['Adventure', 'Comedy', 'Fantasy'],
      castNames: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera'],
      platformNames: ['Amazon Prime Video', 'HBO Max'],
    },
    {
      title: 'The Grand Budapest Hotel', description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.',
      releaseYear: 2014, runtime: 99, language: 'English', country: 'Germany', ageCertification: 'R',
      rating: 8.1, popularity: 74.3, voteCount: 820000,
      directorId: people['Wes Anderson'],
      genreNames: ['Adventure', 'Comedy', 'Crime'],
      castNames: ['Ralph Fiennes', 'F. Murray Abraham', 'Tony Revolori'],
      platformNames: ['Disney+', 'Hulu'],
    },
    {
      title: 'Avatar', description: 'A paraplegic Marine is dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
      releaseYear: 2009, runtime: 162, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 7.9, popularity: 85.7, voteCount: 1300000,
      directorId: people['James Cameron'],
      genreNames: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
      castNames: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
      platformNames: ['Disney+', 'Hulu'],
    },
    {
      title: 'Avatar: The Way of Water', description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. He must protect the oceanic Metkayina clan from the RDA\'s threat.',
      releaseYear: 2022, runtime: 192, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 7.6, popularity: 92.1, voteCount: 640000,
      directorId: people['James Cameron'],
      genreNames: ['Action', 'Adventure', 'Sci-Fi'],
      castNames: ['Sam Worthington', 'Zoe Saldana', 'Kate Winslet'],
      platformNames: ['Disney+', 'HBO Max'],
    },
    {
      title: 'The Shawshank Redemption', description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      releaseYear: 1994, runtime: 142, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 9.3, popularity: 88.0, voteCount: 2800000,
      directorId: people['Martin Scorsese'],
      genreNames: ['Drama'],
      castNames: ['Tim Robbins', 'Morgan Freeman'],
      platformNames: ['Netflix', 'Hulu'],
    },
    {
      title: 'Goodfellas', description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
      releaseYear: 1990, runtime: 146, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.7, popularity: 80.2, voteCount: 1200000,
      directorId: people['Martin Scorsese'],
      genreNames: ['Biography', 'Crime', 'Drama'],
      castNames: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
      platformNames: ['HBO Max', 'Amazon Prime Video'],
    },
    {
      title: 'The Wolf of Wall Street', description: 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.',
      releaseYear: 2013, runtime: 180, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.2, popularity: 86.9, voteCount: 1350000,
      directorId: people['Martin Scorsese'],
      genreNames: ['Biography', 'Crime', 'Drama'],
      castNames: ['Leonardo DiCaprio', 'Jonah Hill', 'Margot Robbie'],
      platformNames: ['Netflix', 'Amazon Prime Video'],
    },
    {
      title: 'Gladiator', description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      releaseYear: 2000, runtime: 155, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.5, popularity: 82.8, voteCount: 1650000,
      directorId: people['Ridley Scott'],
      genreNames: ['Action', 'Adventure', 'Drama'],
      castNames: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
      platformNames: ['Netflix', 'Amazon Prime Video'],
    },
    {
      title: 'Alien', description: 'After investigating a mysterious transmission, the crew of a commercial spacecraft encounters a deadly lifeform.',
      releaseYear: 1979, runtime: 117, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.5, popularity: 78.4, voteCount: 890000,
      directorId: people['Ridley Scott'],
      genreNames: ['Horror', 'Sci-Fi', 'Thriller'],
      castNames: ['Sigourney Weaver', 'Tom Skerritt', 'John Hurt'],
      platformNames: ['Hulu', 'Disney+'],
    },
    {
      title: 'Schindler\'s List', description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
      releaseYear: 1993, runtime: 195, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 9.0, popularity: 81.5, voteCount: 1400000,
      directorId: people['Steven Spielberg'],
      genreNames: ['Biography', 'Drama', 'History'],
      castNames: ['Liam Neeson', 'Ralph Fiennes', 'Ben Kingsley'],
      platformNames: ['Netflix', 'Amazon Prime Video'],
    },
    {
      title: 'Jurassic Park', description: 'A pragmatic paleontologist touring an almost complete theme park is tasked with protecting a pair of kids after a power failure causes the park\'s cloned dinosaurs to run loose.',
      releaseYear: 1993, runtime: 127, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.2, popularity: 83.6, voteCount: 1100000,
      directorId: people['Steven Spielberg'],
      genreNames: ['Action', 'Adventure', 'Sci-Fi'],
      castNames: ['Sam Neill', 'Laura Dern', 'Jeff Goldblum'],
      platformNames: ['Netflix', 'Amazon Prime Video'],
    },
    {
      title: 'The Lord of the Rings: The Return of the King', description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
      releaseYear: 2003, runtime: 201, language: 'English', country: 'New Zealand', ageCertification: 'PG-13',
      rating: 9.0, popularity: 86.7, voteCount: 1900000,
      directorId: people['Peter Jackson'],
      genreNames: ['Action', 'Adventure', 'Drama', 'Fantasy'],
      castNames: ['Elijah Wood', 'Viggo Mortensen', 'Ian McKellen'],
      platformNames: ['HBO Max', 'Amazon Prime Video'],
    },
    {
      title: 'Fight Club', description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
      releaseYear: 1999, runtime: 139, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.8, popularity: 84.5, voteCount: 2200000,
      directorId: people['David Fincher'],
      genreNames: ['Drama'],
      castNames: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'],
      platformNames: ['Netflix', 'Hulu'],
    },
    {
      title: 'The Social Network', description: 'As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea.',
      releaseYear: 2010, runtime: 120, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 7.8, popularity: 73.2, voteCount: 750000,
      directorId: people['David Fincher'],
      genreNames: ['Biography', 'Drama'],
      castNames: ['Jesse Eisenberg', 'Andrew Garfield', 'Justin Timberlake'],
      platformNames: ['Netflix', 'Amazon Prime Video'],
    },
    {
      title: 'Jojo Rabbit', description: 'A young German boy in the Hitler Youth whose imaginary friend is Adolf Hitler discovers that his mother is hiding a Jewish girl in their home.',
      releaseYear: 2019, runtime: 108, language: 'English', country: 'New Zealand', ageCertification: 'PG-13',
      rating: 7.9, popularity: 70.8, voteCount: 420000,
      directorId: people['Taika Waititi'],
      genreNames: ['Comedy', 'Drama', 'War'],
      castNames: ['Roman Griffin Davis', 'Thomasin McKenzie', 'Scarlett Johansson'],
      platformNames: ['Disney+', 'Hulu'],
    },
    {
      title: 'Everything Everywhere All at Once', description: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
      releaseYear: 2022, runtime: 139, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 7.8, popularity: 89.4, voteCount: 680000,
      directorId: people['Daniel Kwan'],
      genreNames: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
      castNames: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan'],
      platformNames: ['Amazon Prime Video', 'Hulu'],
    },
    {
      title: 'The Matrix', description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
      releaseYear: 1999, runtime: 136, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.7, popularity: 85.9, voteCount: 1900000,
      directorId: people['Lana Wachowski'],
      genreNames: ['Action', 'Sci-Fi'],
      castNames: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
      platformNames: ['HBO Max', 'Hulu'],
    },
    {
      title: 'Dune', description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy.',
      releaseYear: 2021, runtime: 155, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.0, popularity: 88.7, voteCount: 820000,
      directorId: people['Denis Villeneuve'],
      genreNames: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
      castNames: ['Timothée Chalamet', 'Rebecca Ferguson', 'Zendaya'],
      platformNames: ['HBO Max', 'Amazon Prime Video'],
    },
    {
      title: 'Knives Out', description: 'A detective investigates the death of the patriarch of an eccentric, combative family.',
      releaseYear: 2019, runtime: 130, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 7.9, popularity: 80.6, voteCount: 580000,
      directorId: people['Rian Johnson'],
      genreNames: ['Comedy', 'Crime', 'Drama', 'Mystery'],
      castNames: ['Daniel Craig', 'Chris Evans', 'Ana de Armas'],
      platformNames: ['Amazon Prime Video', 'Hulu'],
    },
    {
      title: 'The Batman', description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
      releaseYear: 2022, runtime: 176, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 7.8, popularity: 91.5, voteCount: 720000,
      directorId: people['Matt Reeves'],
      genreNames: ['Action', 'Crime', 'Drama'],
      castNames: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano'],
      platformNames: ['HBO Max', 'Hulu'],
    },
    {
      title: 'Spider-Man: Across the Spider-Verse', description: 'Miles Morales catapults across the multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      releaseYear: 2023, runtime: 140, language: 'English', country: 'USA', ageCertification: 'PG',
      rating: 8.7, popularity: 93.2, voteCount: 340000,
      directorId: people['Joaquim Dos Santos'],
      genreNames: ['Action', 'Adventure', 'Animation', 'Fantasy'],
      castNames: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
      platformNames: ['Netflix', 'Disney+'],
    },
    {
      title: 'Spirited Away', description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
      releaseYear: 2001, runtime: 125, language: 'Japanese', country: 'Japan', ageCertification: 'PG',
      rating: 8.6, popularity: 77.8, voteCount: 820000,
      directorId: people['Hayao Miyazaki'],
      genreNames: ['Animation', 'Adventure', 'Family', 'Fantasy'],
      castNames: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
      platformNames: ['HBO Max', 'Disney+'],
    },
    {
      title: 'The Godfather', description: 'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.',
      releaseYear: 1972, runtime: 175, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 9.2, popularity: 83.1, voteCount: 1900000,
      directorId: people['Francis Ford Coppola'],
      genreNames: ['Crime', 'Drama'],
      castNames: ['Marlon Brando', 'Al Pacino', 'James Caan'],
      platformNames: ['Amazon Prime Video', 'HBO Max'],
    },
    {
      title: 'Forrest Gump', description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
      releaseYear: 1994, runtime: 142, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.8, popularity: 85.3, voteCount: 2100000,
      directorId: people['Robert Zemeckis'],
      genreNames: ['Drama', 'Romance'],
      castNames: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
      platformNames: ['Netflix', 'Amazon Prime Video'],
    },
    {
      title: 'The Truman Show', description: 'An insurance salesman discovers his whole life is actually a reality TV show.',
      releaseYear: 1998, runtime: 103, language: 'English', country: 'USA', ageCertification: 'PG',
      rating: 8.2, popularity: 76.9, voteCount: 980000,
      directorId: people['Peter Weir'],
      genreNames: ['Comedy', 'Drama', 'Sci-Fi'],
      castNames: ['Jim Carrey', 'Ed Harris', 'Laura Linney'],
      platformNames: ['Hulu', 'Amazon Prime Video'],
    },
    {
      title: 'Whiplash', description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
      releaseYear: 2014, runtime: 106, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.5, popularity: 79.1, voteCount: 920000,
      directorId: people['Damien Chazelle'],
      genreNames: ['Drama', 'Musical'],
      castNames: ['Miles Teller', 'J.K. Simmons', 'Melissa Benoist'],
      platformNames: ['Netflix', 'Hulu'],
    },
    {
      title: 'Poor Things', description: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.',
      releaseYear: 2023, runtime: 141, language: 'English', country: 'Ireland', ageCertification: 'R',
      rating: 8.0, popularity: 82.7, voteCount: 310000,
      directorId: people['Yorgos Lanthimos'],
      genreNames: ['Comedy', 'Drama', 'Romance', 'Sci-Fi'],
      castNames: ['Emma Stone', 'Mark Ruffalo', 'Willem Dafoe'],
      platformNames: ['Hulu', 'Amazon Prime Video'],
    },
    {
      title: 'Past Lives', description: 'Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora\'s family emigrates from South Korea. Twenty years later, they are reunited for one fateful week.',
      releaseYear: 2023, runtime: 105, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 7.8, popularity: 75.4, voteCount: 180000,
      directorId: people['Celine Song'],
      genreNames: ['Drama', 'Romance'],
      castNames: ['Greta Lee', 'Teo Yoo', 'John Magaro'],
      platformNames: ['Amazon Prime Video'],
    },
    {
      title: 'John Wick: Chapter 4', description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.',
      releaseYear: 2023, runtime: 169, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 7.7, popularity: 90.8, voteCount: 440000,
      directorId: people['Chad Stahelski'],
      genreNames: ['Action', 'Crime', 'Thriller'],
      castNames: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård'],
      platformNames: ['Amazon Prime Video'],
    },
    {
      title: 'The Holdovers', description: 'A curmudgeonly instructor at a New England prep school is forced to remain on campus during Christmas break to babysit a handful of students with nowhere to go.',
      releaseYear: 2023, runtime: 133, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.1, popularity: 72.3, voteCount: 210000,
      directorId: people['Alexander Payne'],
      genreNames: ['Comedy', 'Drama'],
      castNames: ['Paul Giamatti', 'Da\'Vine Joy Randolph', 'Dominic Sessa'],
      platformNames: ['Hulu', 'Amazon Prime Video'],
    },
    {
      title: 'Top Gun: Maverick', description: 'After thirty years of service as one of the Navy\'s top aviators, Pete "Maverick" Mitchell is where he belongs, pushing the envelope as a courageous test pilot.',
      releaseYear: 2022, runtime: 131, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.3, popularity: 94.5, voteCount: 560000,
      directorId: people['Joseph Kosinski'],
      genreNames: ['Action', 'Drama'],
      castNames: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly'],
      platformNames: ['Amazon Prime Video', 'Apple TV+'],
    },
    {
      title: 'La La Land', description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
      releaseYear: 2016, runtime: 128, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.0, popularity: 80.1, voteCount: 780000,
      directorId: people['Damien Chazelle'],
      genreNames: ['Comedy', 'Drama', 'Musical', 'Romance'],
      castNames: ['Ryan Gosling', 'Emma Stone', 'John Legend'],
      platformNames: ['Netflix', 'Hulu'],
    },
    {
      title: 'Mad Max: Fury Road', description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.',
      releaseYear: 2015, runtime: 120, language: 'English', country: 'Australia', ageCertification: 'R',
      rating: 8.1, popularity: 81.3, voteCount: 1100000,
      directorId: people['George Miller'],
      genreNames: ['Action', 'Adventure', 'Sci-Fi'],
      castNames: ['Tom Hardy', 'Charlize Theron', 'Nicholas Hoult'],
      platformNames: ['HBO Max', 'Hulu'],
    },
    {
      title: 'The Prestige', description: 'After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
      releaseYear: 2006, runtime: 130, language: 'English', country: 'USA', ageCertification: 'PG-13',
      rating: 8.5, popularity: 81.7, voteCount: 1400000,
      directorId: people['Christopher Nolan'],
      genreNames: ['Drama', 'Mystery', 'Sci-Fi', 'Thriller'],
      castNames: ['Christian Bale', 'Hugh Jackman', 'Scarlett Johansson'],
      platformNames: ['Netflix', 'HBO Max'],
    },
    {
      title: 'No Country for Old Men', description: 'Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.',
      releaseYear: 2007, runtime: 122, language: 'English', country: 'USA', ageCertification: 'R',
      rating: 8.2, popularity: 77.6, voteCount: 980000,
      directorId: people['Ethan Coen'],
      genreNames: ['Crime', 'Drama', 'Thriller'],
      castNames: ['Javier Bardem', 'Josh Brolin', 'Tommy Lee Jones'],
      platformNames: ['Netflix', 'Amazon Prime Video'],
    },
    {
      title: 'Snatch', description: 'Unscrupulous boxing promoters, violent bookmakers, a Russian gangster, incompetent amateur robbers, and supposedly Jewish jewelers fight to track down a priceless stolen diamond.',
      releaseYear: 2000, runtime: 104, language: 'English', country: 'UK', ageCertification: 'R',
      rating: 8.2, popularity: 73.8, voteCount: 870000,
      directorId: people['Guy Ritchie'],
      genreNames: ['Comedy', 'Crime'],
      castNames: ['Brad Pitt', 'Jason Statham', 'Benicio Del Toro'],
      platformNames: ['Amazon Prime Video', 'Hulu'],
    },
  ];

  // Create movies and relations
  const movieIds: string[] = [];
  for (const m of movies) {
    const movie = await prisma.movie.create({
      data: {
        title: m.title,
        description: m.description,
        releaseYear: m.releaseYear,
        runtime: m.runtime,
        language: m.language,
        country: m.country,
        ageCertification: m.ageCertification,
        rating: m.rating,
        popularity: m.popularity,
        voteCount: m.voteCount,
        directorId: m.directorId,
      }
    });
    movieIds.push(movie.id);

    // Create genre relations
    for (const gName of m.genreNames) {
      if (genres[gName]) {
        await prisma.movieGenre.create({
          data: { movieId: movie.id, genreId: genres[gName] }
        });
      }
    }

    // Create cast relations
    for (let i = 0; i < Math.min(m.castNames.length, 5); i++) {
      const castName = m.castNames[i];
      if (people[castName]) {
        await prisma.movieCast.create({
          data: { movieId: movie.id, personId: people[castName], character: castName }
        });
      }
    }

    // Create streaming platform relations
    for (const pName of m.platformNames) {
      if (platformMap[pName]) {
        await prisma.movieStreaming.create({
          data: { movieId: movie.id, platformId: platformMap[pName] }
        });
      }
    }
  }

  // --- Create a default user ---
  const user = await prisma.user.create({
    data: { email: 'viewer@cineverse.app', name: 'Movie Fan' }
  });

  // --- Create some sample activities ---
  const activityTypes = ['VIEW', 'LIKE', 'RATE'];
  for (let i = 0; i < 15; i++) {
    const movieId = movieIds[i % movieIds.length];
    const type = activityTypes[i % 3];
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        movieId,
        activityType: type,
        userRating: type === 'RATE' ? 6 + Math.random() * 3.5 : null,
      }
    });
  }

  // --- Create some watchlist entries ---
  for (let i = 0; i < 8; i++) {
    const movieId = movieIds[(i * 5) % movieIds.length];
    const statuses = ['PLAN_TO_WATCH', 'WATCHING', 'COMPLETED'];
    try {
      await prisma.watchlist.create({
        data: {
          userId: user.id,
          movieId,
          status: statuses[i % 3],
        }
      });
    } catch { /* unique constraint - skip duplicates */ }
  }

  console.log('Seed completed successfully!');
  console.log(`Created ${movies.length} movies, ${genreData.length} genres, ${platforms.length} platforms`);
  console.log(`Default user: ${user.email} (${user.id})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
