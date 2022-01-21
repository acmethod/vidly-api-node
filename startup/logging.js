require('express-async-errors'); // This will monkey patch our route handlers with a try catch block
require('winston-mongodb');
const winston = require('winston');

function logging(){

    // To catch any unhandled exceptions outside of the request pipeline, manually subscribe
    // or add transports to the exceptionHandlers section in the call to configue  below

    // process.on('uncaughtException', (ex) => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    // process.on('unhandledRejection', (ex) => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    // Or use the the following plus add the exceptionsHandlers transport as done below

    //For unhandled Promise rejections
    process.on('unhandledRejection', (ex) =>{
        // Handle the Rejection and throw to winston.handleExceptions
        throw ex;
    });

    winston.configure({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({filename: 'logfile.log'}),
            new winston.transports.MongoDB({ 
                db: 'mongodb://localhost/vidly',
                level: 'info',
                options: {
                    useUnifiedTopology: true,
                }
            })
        ],
        exceptionHandlers: [
            new winston.transports.Console( { colorize: true, prettyPrint: true}),
            new winston.transports.File({ filename: 'ex.log' })
        ]
    });
}

module.exports = logging;