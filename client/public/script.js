import { data } from '/data.js';

const header = () => `
  <header>
    <ul>
      <li>
        <a href="/movies">Movies</a>
      </li>
      
      <li>
        <a href="/writers">Writers</a>
      </li>
      
      <li>
        <a href="/directors">Directors</a>
      </li>
      
      <li>
        <a href="/actors">Actors</a>
      </li>

      <li>
        <a href="/genres">Genres</a>
      </li>
    </ul>
  </header>
`;

/* 
{
      "actors": [
        "Paul Walker",
        "Tyrese Gibson",
        "Chris Ludacris Bridges",
        "Eva Mendes",
        "Cole Hauser"
      ],
      "directors": [
        "John Singleton"
      ]
      },
      */

const getProfessionalName = (id, professionalsArray) => professionalsArray.find(prof => prof.id === id).name;

const changeIdsToNames = (idsArray, professionalsArray) => idsArray.map(id => getProfessionalName(id, professionalsArray));

const profNames = (writers, actors, directors, professionalsArray) => {
  const writersNames = changeIdsToNames(writers, professionalsArray);
  const actorsNames = changeIdsToNames(actors, professionalsArray);
  const directorsNames = changeIdsToNames(directors, professionalsArray);

  return {
    writers: writersNames,
    actors: actorsNames,
    directors: directorsNames
  }
}

const reduceProfNames = (profsObj, professionalsArray) => ["writers", "actors", "directors"].reduce((accumulator, profType) => ({...accumulator, [profType]: changeIdsToNames(profsObj[profType], professionalsArray)}), {});


const updateMovies = (moviesArray, professionalsArray) => {
  return moviesArray.map(movie => {
    // const names = profNames(movie.writers, movie.actors, movie.directors, professionalsArray);
    const names = reduceProfNames({
      writers: movie.writers,
      directors: movie.directors,
      actors: movie.actors
    }, professionalsArray);

    return {
      ...movie,
      ...names
    }
  })
}

const movies = (moviesArray) => `
  <h2>Favorite Movies</h2>
  <div class="movies">
    ${moviesArray.map(movieData => movie(movieData)).join("")}
  </div>
`;

const movie = (movieData) => `
  <div class="movie">
    <h3 class="title">${movieData.title}</h3>
    <h4 class="year">${movieData.year}</h3>
    <p class="date">${movieData.releaseDate}</p>
    <p class="runtime">${movieData.runtime}</p>
    <p class="storyline">${movieData.storyline}</p>
    
    <h5>Genres:</h5>
    <ul class="genres">
      ${movieData.genres.map(genre => `<li>${genre}</li>`).join("")}
    </ul>

    <h5>Writers:</h5>
    <ul class="writers">
      ${movieData.writers.map(writer => `<li>${writer}</li>`).join("")}
    </ul>

    <h5>Actors:</h5>
    <ul class="actors">
      ${movieData.actors.map(actor => `<li>${actor}</li>`).join("")}
    </ul>
  </div>
`;


const loadEvent = function () {

  const page = window.location.pathname.substring(1);
  console.log(window.location)
  // Write your JavaScript code after this line

  console.log("data: ", data);
  console.log("page: ", page);

  const rootElement = document.getElementById("root");
  rootElement.insertAdjacentHTML("beforeend", header());

  if (page === 'movies') {
    console.log("movies component");
    rootElement.insertAdjacentHTML("beforeend", movies(updateMovies(data.movies, data.professionals)));
  } else if (page === 'writers') {
    console.log("writers component");
  } else if (page === 'genres') {
    console.log("genres component");
  } else if (page === 'actors') {
    console.log("actors component");
  }

  // Write your JavaScript code before this line

}

window.addEventListener("load", loadEvent);
