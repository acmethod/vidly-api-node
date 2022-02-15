const mongoose = require('mongoose');
const Joi = require('joi');             //Exports a class

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, minlength: 5, maxlength: 55 }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50)
    });

    return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
module.exports.genreSchema = genreSchema;
