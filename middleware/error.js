const winston = require('winston');

function error (err, req, res, next){
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
        
    winston.error({message: err.message, stack: err.stack, metadata: err});

    res.status(500).send('Something failed.');
}

module.exports = error;