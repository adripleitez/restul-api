var Movie = require('../models/movie');
var debug = require('debug')('web-api:movie_controller');

// Search one movie
module.exports.getOne = (req, res, next) => {
	debug('Search Movie', req.params);
	Movie.findOne(
		{
			name: req.params.name
		},
		'-year'
	)
		.then((foundMovie) => {
			debug('Found Movie', foundMovie);
			if (foundMovie) return res.status(200).json(foundMovie);
			else return res.status(400).json(null);
		})
		.catch((err) => {
			next(err);
		});
};

//Get all movies

module.exports.getAll = (req, res, next) => {
	var perPage = Number(req.query.size) || 10,
		page = req.query.page > 0 ? req.query.page : 0;

	var sortProperty = req.query.sortby || 'createdAt',
		sort = req.query.sort || 'desc';

	debug('Movie List', {
		size: perPage,
		page,
		sortby: sortProperty,
		sort
	});

	Movie.find({})
		.limit(perPage)
		.skip(perPage * page)
		.sort({
			[sortProperty]: sort
		})
		.then((movies) => {
			debug('Found movies', movies);
			return res.status(200).json(movies);
		})
		.catch((err) => {
			next(err);
		});
};

// New Movie

module.exports.register = (req, res, next) => {
	debug('New Movie', {
		body: req.body
	});
	Movie.findOne(
		{
			name: req.body.name
		},
		''
	)
		.then((foundMovie) => {
			if (foundMovie) {
				debug('Pelicula duplicada');
				throw new Error(`Pelicula duplicada ${req.body.name}`);
			} else {
				let newMovie = new Movie({
					name: req.body.name,
					film_genre: req.body.name,
					director: req.body.director || '',
					year: req.body.year || '',
					gate_money: req.body.gate_money,
					rating: req.body.rating
				});
				return newMovie.save();
			}
		})
		.then((movie) => {
			return res.header('Location', '/movies/' + movie.name).status(201).json({
				name: movie.name
			});
		})
		.catch((err) => {
			next(err);
		});
};

// Update movie

module.exports.update = (req, res, next) => {
    debug("Update movie", {
        id: req.params.id,
        ...req.body
    });

    let update = {
        ...req.body
    };

    Movie.findOneAndUpdate({
            id: req.params.id
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });
}

//Delete Movie

module.exports.delete = (req, res, next) => {
	var id = req.body.id;

	Movie.findByIdAndDelete(id, (error, movie) => {
		if (error) return res.status(500).json({ success: false, message: 'Error interno del servidor' });

		if (movie) {
			return res.status(200).json({ success: true, message: 'Pelicula eliminada con exito del sistema', movie });
		} else {
			return res.status(404).json({ success: false, message: 'Error al eliminar pelicula' });
		}
	});
};
