const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async ( req, res ) => {
    const user = await User.findById(req.user._id).select({ name: 1, email: 1});
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if ( error ){
        res.status(400).send(error.details[0].message);
        return;
    }

    let user = await User.findOne({email: req.body.email});

    if ( user ){
        res.status(400).send(`User with email ${req.body.email} is already registered`);
        return 
    }

    // Instead of the following use pick 
    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    user = new User(_.pick( req.body, ['name', 'email', 'password']));
    
    // Encrypt the password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();

    const token = user.generateAuthToken();

    // We don't want to send back the password, use pick to create a new obj
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
});

module.exports = router;