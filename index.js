const winston = require('winston');
const express = require('express');
const app = express();

//Enable logging first, to catch exceptions while starting up
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation');


const enviro = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {winston.info(`Listening on port ${port} in ${enviro} environment...`);});
 

module.exports = server;