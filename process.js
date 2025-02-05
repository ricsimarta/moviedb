import * as fs from 'node:fs';

const movieDB = {
	professionals: [],
	movies: [],
	genres: []
}

//write you code after this line
const findProfessionalId = (professionalsArray, name) => {
	const foundProfessional = professionalsArray.find(professional => professional.name === name);

	if (foundProfessional) {
		return foundProfessional.id;
	} else {
		return name;
	}
}

const replaceNamesToId = (movie, professionalsArray) => {
	const newMovie = { ...movie };
	const types = ["actors", "directors", "writers"];

	types.forEach(type => newMovie[type] = newMovie[type].map(professional => findProfessionalId(professionalsArray, professional)));

	return newMovie;
}

const handleProfessionals = (movie, type, professionalsArray) => {
	const role = type.slice(0, -1);

	movie[type].forEach(professional => {
		const newProfessional = {
			id: professionalsArray.length > 0 ? professionalsArray[professionalsArray.length - 1].id + 1 : 1,
			name: professional,
			roles: [role]
		}

		const foundProfessional = professionalsArray.find(prof => prof.name === newProfessional.name);

		// if (foundProfessional === undefined) {
		if (!foundProfessional) { // !falsy -> true
			professionalsArray.push(newProfessional);
		} else {
			// if (foundProfessional.roles.includes(role) === false) {
			if (!foundProfessional.roles.includes(role)) { // !falsy -> true 
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

fs.readFile("data.json", "utf8", (err, dataString) => {
	if (err) {
		console.log("error: ", err);
		return;
	}

	const { movies } = JSON.parse(dataString);

	movies.forEach(movie => {
		addProfessionals(movie, professionalsArray);
		addMovie(movie, movieDB.movies, movieDB.professionals);
	})
})


//write your code brefore this line

export { movieDB };
