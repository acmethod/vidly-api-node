const Fawn = require('fawn');
const express = require('express');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');


const router = express.Router();

Fawn.init('mongodb://localhost/vidly');

router.get('/', async (req, res)=>{
    const rental = await Rental.find().sort( { rentalDate: -1 } );
    res.send(rental);
});

router.get('/:id',  async (req, res)=>{
    const rental = await Rental.findById(req.params.id);

    if ( !rental ){
        res.status(404).send(`Rental with Id ${req.params.id} was not found`);
        return;
    }

    res.send(rental);
});

router.post('/', async (req, res)=>{
    const {error} = validate(req.body);
    
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const movie = await Movie.findById(req.body.movieId);
    if ( !movie ){
        res.status(404).send(`Movie with Id ${req.params.movieId} was not found`);
        return;
    }

    const customer = await Customer.findById(req.body.customerId);
    if ( !customer ){
        res.status(404).send(`Customer with Id ${req.params.customerId} was not found`);
        return;
    }

    if (movie.numberInStock === 0) return res.status(400).send('Movie not it stock');

    let rental = new Rental({
        movie: {
            _id: movie._id,
            name: movie.name,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        }
    });

    // Its possible that an error could happen betweend these opperations
    // Use Fawn to perform a 2 phase commit. This will ensure saving the 
    // rentals record and updating the inventory will happen in on transaction
    // rental = await rental.save();
    // movie.numberInStock--;
    // movie.save();
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id}, {$inc: { numberInStock: -1 }})
            .run();    
        
        res.send(rental);
    }
    catch ( ex ){
        res.status(500).send('Something failed', ex.message);
    }
});

router.put('/:id', async (req, res)=>{
    const {error} = validate(req.body);
    
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const movie = await Movie.findById(req.body.movieId);
    if ( !movie ){
        res.status(404).send(`Movie with Id ${req.body.movieId} was not found`);
        return;
    }

    const customer = await Customer.findById(req.body.customerId);
    if ( !customer ){
        res.status(404).send(`Customer with Id ${req.body.customerId} was not found`);
        return;
    }

    // third object tells to return the updated obj
    const rental = await Rental.findByIdAndUpdate(req.params.id, { 
            movie: {
                _id: movie._id,
                name: movie.name,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            },
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            }
        }, { new: 1 });
    
    if ( !rental ){
        res.status(404).send(`Movie with Id ${req.params.id} was not found`);
        return;
    }

    res.send(rental);
});

router.delete('/:id', async (req, res)=>{
    const movie = await Rental.findByIdAndRemove( req.params.id )

    if ( !movie ){
        res.status(404).send(`Movie with Id ${req.params.id} was not found`);
        return;
    }

    res.send(movie);
});

module.exports = router;