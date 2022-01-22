const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name : { type: String, required: true, minlength: 5, maxlength: 50},
    email: { type: String, requried: true, unique: true, minlength: 5, maxlength: 255},
    password: { type: String, requried: true, minlength: 5, maxlength: 1024},
    isAdmin: { type: Boolean }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign( { _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

const complexityOptions = {
    min: 5,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};

function validateUser( user ){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        password: passwordComplexity(complexityOptions)
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.complexityOptions = complexityOptions;