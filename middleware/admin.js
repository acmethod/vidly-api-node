const config = require('config');

function admin ( req, res, next ){

    if (!config.get("requiresAuth")) return next();

    if (!req.user.isAdmin){
        res.status(403).send('Access denied')
    }

    next();
}

module.exports = admin