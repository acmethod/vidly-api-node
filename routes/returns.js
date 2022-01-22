const { Rental } = require('../models/rental');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Movie } = require('../models/movie');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const router = express.Router();

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    
    if (!rental){
        res.status(404).send('Rental not found. Invalid movie and customer combination');
        return;
    }

    if ( rental.inDate ){
        res.status(400).send('Rental has already been processed');
        return;
    }
    
    rental.doReturn();

    await rental.save();

    await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1}});

    res.status(200).send(rental);
});


function validateReturn(r){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(r);
}

module.exports = router;