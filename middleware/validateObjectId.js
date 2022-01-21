const mongoose = require('mongoose');

const validateObjectId = function(req, res, next){

    if( !mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404).send(`Invalid Id`);
        return;
    }

    next();
};

module.exports = validateObjectId;