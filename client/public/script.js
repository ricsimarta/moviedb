import { data } from '/data.js';

const create = (rootElement, component) => rootElement.insertAdjacentHTML("beforeend", component());

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

const getProfessionalName = (id, professionalsArray) => professionalsArray.find(prof => prof.id === id).name;

const changeIdsToNames = (idsArray, professionalsArray) => idsArray.map(id => getProfessionalName(id, professionalsArray));

const profNames = (writers, actors, directors, professionalsArray) => {
  return {
    writers: changeIdsToNames(writers, professionalsArray),
    actors: changeIdsToNames(actors, professionalsArray),
    directors: changeIdsToNames(directors, professionalsArray)
  }
}

// const reduceProfNames = (profsObj, professionalsArray) => ["writers", "actors", "directors"].reduce((accumulator, profType) => ({...accumulator, [profType]: changeIdsToNames(profsObj[profType], professionalsArray)}), {});


const updateMovies = (moviesArray, professionalsArray) => moviesArray.map(movie => ({
  ...movie,
  ...profNames(movie.writers, movie.actors, movie.directors, professionalsArray)
}));

const movies = (moviesArray) => `
  <h2>Favorite Movies</h2>
  <div class="movies">
    ${moviesArray.map(movie).join("")}
  </div>
  `;
//${moviesArray.map(moveData => movie(movieData)).join("")}

const movie = (movieData) => `
  <div class="movie">
    <h3 class="title">${movieData.title}</h3>
    <h4 class="year">${movieData.year}</h3>
    <p class="date">${movieData.releaseDate}</p>
    <p class="runtime">${movieData.runtime}</p>
    <p class="storyline">${movieData.storyline}</p>
    
    ${list("genres", movieData.genres)}
    ${list("writers", movieData.writers)}
    ${list("actors", movieData.actors)}
    ${list("directors", movieData.directors)}
  </div>
`;

const list = (name, array) => `
  <h5>${name}:</h5>
  <ul class=${name}>
    ${array.map(element => `<li>${element}</li>`).join("")}
  </ul>
`;

const professionals = (type, professionalsArray) => `
  <h2>${type}</h2>
  <div class=${type}>
    ${professionalsArray
        .filter(profData => profData.roles.includes(type.slice(0, -1)))
        .map(profData => professional(profData))
        .join("")
    }
  </div>
`;

const professional = (profData) => `
    <div class="professional">
      <h3>${profData.name}</h3>
      ${list("roles", profData.roles)}
    </div>
`;

const loadEvent = function () {
  const page = window.location.pathname.substring(1);
  console.log(window.location)

  console.log("data: ", data);

  const rootElement = document.getElementById("root");
  create(rootElement, header);

  const profTypes = ['writers', 'actors', 'directors'];

  if (page === 'movies') {
    create(rootElement, () => movies(updateMovies(data.movies, data.professionals)));
  } else if (profTypes.includes(page)) {
    create(rootElement, () => professionals(page, data.professionals));
  }  else if (page === 'genres') {
    console.log("genres component");
  } 
}

window.addEventListener("load", loadEvent);
