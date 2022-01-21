
const config = require('config');

function getConfig(){
    if ( !config.get('jwtPrivateKey') ) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}

module.exports = getConfig;