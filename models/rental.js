const mongoose = require('mongoose');
const Joi = require('joi');

const rentalCustomerSchema = new mongoose.Schema({
    isGold: { type: Boolean, default: false },
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    phone: { type: String, required: true, minlength: 5, maxlength: 50 },
});

const rentalMovieSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 50},
    dailyRentalRate: { type: Number, required: true, default: 0, minlength: 0, maxlength: 255}
});

const rentalSchema = new mongoose.Schema({
        rentalDate: { type: Date, required: true, default: Date.now },
        returnDate: { type: Date },
        movie: { type: rentalMovieSchema, required: true },
        customer: { type: rentalCustomerSchema, required: true },
        rentalFee: { type: Number, min: 0 }
});

const Rental = mongoose.model('Rental', rentalSchema); 

function validateRental(rental){
    const schema = Joi.object({
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required()
    });

    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;