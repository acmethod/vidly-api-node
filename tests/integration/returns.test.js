//Return 401 if client is not logged in
//Return 400 if customerId is not provided
//Return 400 if movieId is not provided
//Return 404 if no rental found for this customer/movie
//Return 400 if rental already processes
//Return 200 if valid request
//Set the return date
//Calculate the rental fee
//Increase the stock
//Return the rental

const request = require('supertest');
const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');
const { User } = require('../../models/user');
const moment = require('moment');
const { Movie } = require('../../models/movie');



describe('/api/returns', () =>{
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    beforeEach( async () => { 
        server = require('../../index');
        
        customerId = new mongoose.Types.ObjectId();
        
        movieId = new mongoose.Types.ObjectId();

        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: {
                name: '12345'
            },
            numberInStock: 10,
            dailyRentalRate: 2
        });

        await movie.save();

        rental = new Rental({
            customer: { _id: customerId, name: '12345', phone: '12345'},
            movie: { _id: movieId, title: '12345', dailyRentalRate: 2}
        });

        await rental.save();
    });

    afterEach(async () =>{ 
        await Rental.remove({});
        await Movie.remove({});
        await server.close();
    });

    const exec = function(){
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId: customerId , movieId: movieId});
    };

    it('should return 401 if client is not logged in', async () =>{
        token = '';

        const res = await exec();
        
        expect(res.status).toBe(401);  
    });

    
    it('should return 400 if customerId is not provided', async () =>{
        customerId = '';

        const res = await exec();
        
        expect(res.status).toBe(400);  
    });

    it('should return 400 if movieId is not provided', async () =>{
        movieId = '';

        const res = await exec();
        
        expect(res.status).toBe(400);  
    });

    it('should return 404 if no rental found for this customer/movie', async () =>{
        customerId = new mongoose.Types.ObjectId();
    
        const res = await exec();
        
        expect(res.status).toBe(404);  
    });

    it('should return 400 if rental is already processed', async () =>{
        rental.inDate = Date.now();

        await rental.save();

        const res = await exec();
        
        expect(res.status).toBe(400);  
    });

    it('should return 200 if we have a valid request', async () =>{        
        const res = await exec();
        
        expect(res.status).toBe(200);  
    });

    it('should set the retun date if we have a valid request', async () =>{        
        const res = await exec();
        
        expect(res.status).toBe(200);

        const diff = new Date() - new Date(res.body.inDate);
        
        expect(diff).toBeLessThan(10000);
    });
    
    it('should calculate the rental fee if we have a valid request', async () =>{        
        rental.outDate = moment().add(-7, 'days').toDate();

        await rental.save();
        
        const res = await exec();
        
        expect(res.status).toBe(200);
        
        expect(res.body.rentalFee).toBe( 7 * res.body.movie.dailyRentalRate );
    });

    it('should increase the stock if we have a valid request', async () =>{        
        
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);
        
        expect(res.status).toBe(200);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if we have a valid request', async () =>{        
        
        const res = await exec();
        
        expect(res.status).toBe(200);

        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['outDate', 'customer', 'movie', 'rentalFee', 'inDate'])
        );
    })
});