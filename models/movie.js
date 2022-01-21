const { genreSchema } = require('./genre');
const mongoose = require('mongoose');
const Joi = require('joi');


const movieSchema = new mongoose.Schema({
        title: { type: String, required: true, minlength: 5, maxlength: 50},
        genre: { type: genreSchema, required: true },
        numberInStock: { type: Number, required: true, default: 0, minlength: 0, maxlength: 255},
        dailyRentalRate: { type: Number, required: true, default: 0, minlength: 0, maxlength: 255}
});

const Movie = mongoose.model('Movie', movieSchema); 

function validateMovie(movie){

    const schema = Joi.object({
        title: Joi.string().required().min(5).max(50),
        genreId: Joi.objectId.required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });

    return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;