import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

const movieDB = {
	professionals: [],
	movies: [],
	genres: []
}

const findProfessionalId = (professionalsArray, name) => {
	const foundProfessional = professionalsArray.find(professional => professional.name === name);

	if (foundProfessional) {
		return foundProfessional.id;
	} else {
		return name;
	}
}

const replaceNamesToId = (movie, professionalsArray) => {
	const newMovie = { ...movie, id: uuidv4() };
	const types = ["actors", "directors", "writers"];

	types.forEach(type => newMovie[type] = newMovie[type].map(professional => findProfessionalId(professionalsArray, professional)));

	return newMovie;
}

const handleProfessionals = (movie, type, professionalsArray) => {
	const role = type.slice(0, -1);

	movie[type].forEach(profName => {
		const newProfessional = {
			id: professionalsArray.length > 0 ? professionalsArray[professionalsArray.length - 1].id + 1 : 1,
			name: profName,
			roles: [role]
		}

		const foundProfessional = professionalsArray.find(professional => professional.name === newProfessional.name);

		if (!foundProfessional) { 
			professionalsArray.push(newProfessional);
		} else {
			if (!foundProfessional.roles.includes(role)) { 
				foundProfessional.roles.push(role);
			}
		}
	})
}

const addMovie = (movie, moviesArray, professionalsArray) => {
	const newMovie = replaceNamesToId(movie, professionalsArray);
	moviesArray.push(newMovie);
}

const addProfessionals = (movie, professionalsArray) => {
	["writers", "directors", "actors"].forEach(type => handleProfessionals(movie, type, professionalsArray));
}

const addGenres = (movie, genresArray) => {
	movie.genres.forEach(genreName => {
		genresArray.find(genre => genre.name === genreName) ? null : genresArray.push({ id: uuidv4(), name: genreName });
	})
}

const addMovieDBData = (movie, movieDB) => {
	addProfessionals(movie, movieDB.professionals);
	addMovie(movie, movieDB.movies, movieDB.professionals);
	addGenres(movie, movieDB.genres);
}

fs.readFile("data.json", "utf8", (err, dataString) => {
	if (err) {
		console.log("error: ", err);
		return;
	}	

	const { movies } = JSON.parse(dataString);

	movies.forEach(movie => addMovieDBData(movie, movieDB));
})

export { movieDB };