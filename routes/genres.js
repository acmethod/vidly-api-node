const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Genre, validate } = require('../models/genre');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort( {name: 1} );
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res)=>{
    const genre = await Genre.findById(req.params.id);

    if ( !genre ){
        res.status(404).send(`Genre with Id ${req.params.id} was not found`);
        return;
    }

    res.send(genre);
});

router.post('/', auth, async (req, res)=>{
    const {error} = validate(req.body);
    
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const  genre = new Genre({name: req.body.name});

    await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res)=>{
    const {error} = validate(req.body);
    
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    
    // third object tells to return the updated obj
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {new: true})
    
    if ( !genre ){
        res.status(404).send(`Genre with Id ${req.params.id} was not found`);
        return;
    }

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res)=>{
    const genre = await Genre.findByIdAndRemove( req.params.id )

    if ( !genre ){
        res.status(404).send(`Genre with Id ${req.params.id} was not found`);
        return;
    }

    res.send(genre);
});

module.exports = router;