const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, complexityOptions } = require('../models/user');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if ( error ){
        res.status(400).send(error.details[0].message);
        return;
    }

    let user = await User.findOne({email: req.body.email});

    if ( !user ){
        res.status(400).send(`Invalid email or password`);
        return 
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if (!validPassword){
        res.status(400).send(`Invalid email or password`);
        return 
    }

    const token = user.generateAuthToken();
    res.send(token);
});

function validate( user ){
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        password: passwordComplexity(complexityOptions)
    });

    return schema.validate(user);
}

module.exports = router;