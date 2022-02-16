const { Movie, validateMovie } = require('../models/movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');
const express = require('express');
const { Genre } = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res)=>{
    const movie = await Movie.find().sort( {name: 1} );
    res.send(movie);
});

router.get('/:id', async (req, res)=>{
    const movie = await Movie.findById(req.params.id);

    if ( !movie ){
        res.status(404).send(`Movie with Id ${req.params.id} was not found`);
        return;
    }

    res.send(movie);
});

router.post('/', [auth, validate(validateMovie)], async (req, res)=>{
    const {error} = validate(req.body);
    
    console.log(req);

    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const genre = await Genre.findById(req.body.genreId);
    if ( !genre ){
        res.status(404).send(`Genre with Id ${req.params.genreId} was not found`);
        return;
    }

    console.log(genre);

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    console.log(movie);

    await movie.save();

    res.send(movie);
});

router.put('/:id', [auth, validate(validateMovie)], async (req, res)=>{
    
    const genre = await Genre.findById(req.body.genreId);
    if ( !genre ){
        res.status(404).send(`Genre with Id ${req.params.genreId} was not found`);
        return;
    }

    // third object tells to return the updated obj
    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, { new: 1 });
    
    if ( !movie ){
        res.status(404).send(`Movie with Id ${req.params.id} was not found`);
        return;
    }

    res.send(movie);
});

router.delete('/:id', [auth, admin], async (req, res)=>{
    const movie = await Movie.findByIdAndRemove( req.params.id )

    if ( !movie ){
        res.status(404).send(`Movie with Id ${req.params.id} was not found`);
        return;
    }

    res.send(movie);
});

module.exports = router;