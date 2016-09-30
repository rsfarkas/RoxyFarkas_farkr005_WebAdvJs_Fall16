var Xray = require('x-ray');
var x = Xray();

x('https://www.rottentomatoes.com/browse/opening/#', '.mb-movies', [{
	topMovies: x('.mb-movie', [{
		poster:'.poster_container a@href',
		title: '.movie_info a .movieTitle',
		rating:'.movie_info a .tMeterIcon .tMeterScore',
		release_date: '.movie_info .release-date',
	}])
}])
    .write('results.json');