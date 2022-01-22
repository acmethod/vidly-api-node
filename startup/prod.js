const helmet = require('helmet');
const compression = required('compression');

function prod(app){
    app.use(helmet());
    app.use(compression());
}

module.exports = prod;