function validate(validator){
    return ( req, res, next) => {
        const {error} = validator(req.body);
    
        if (error){
            res.status(400).send(error.details[0].message);
            return;
        }

        next();
    }
}

module.exports = validate