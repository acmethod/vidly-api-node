const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

function db(){
    const db = config.get('db');
    mongoose.connect(db)
        .then(() => { winston.info(`Connected to ${db}...`)});
        //.catch((error) => { console.log('Error connnecting to mongo db...', error)});
        //the line above now will get hanlded by our winston global error handling block.
    }

module.exports = db;
