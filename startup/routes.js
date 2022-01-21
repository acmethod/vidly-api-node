const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rental = require('../routes/rentals');
const user = require('../routes/users');
const auth = require('../routes/auth');
const home = require('../routes/home');
const error = require('../middleware/error');

function loadRoutes( app ){
    app.use(express.json());                            // Middleware to parses in JSON, and returs the requst. Needs to be before routes
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rental);
    app.use('/api/auth', auth);
    app.use('/api/users', user);
    app.use('/', home);
    
    // Must be at the end of the use statements. Last in the request pipeline
    app.use(error);
}

module.exports = loadRoutes;