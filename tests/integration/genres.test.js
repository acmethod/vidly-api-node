const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () =>{
    // Open and close the server on each test
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        await Genre.remove({}); 
        server.close(); 
    });

    describe('GET / ', () =>{
        it('should return all genres', async () =>{
            await Genre.collection.insertMany([
                { name : 'genre1' },
                { name : 'genre2' },
                { name : 'genre3' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy();         
            expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy();         
            expect(res.body.some((g) => g.name === 'genre3')).toBeTruthy();         
        });
    });

    describe('GET /:id', () =>{
        it('should return a genre if id is found', async()=>{
            
            const genre = new Genre({ name: 'genre1'});

            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if id is not found', async()=>{
            
            const genre = new Genre({ name: 'genre1'});

            await genre.save();

            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genres with the given id exists', async()=>{
            
            const genre = new Genre({ name: 'genre1'});

            await genre.save();

            const res = await request(server).get('/api/genres/' + new mongoose.Types.ObjectId());

            expect(res.status).toBe(404);
        });

    });

    describe('POST /', () =>{ 

        // Define the happy path, and then in each test, we change 
        // one parameter than clearly aligns with the name of the test.

        let token;
        let name;

        const exec = async function(){
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: name  });
        }

        beforeEach( () =>{
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if user is not logged in', async () =>{
            token = '';
            
            const res = await exec();
            
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () =>{   
            name = '1234';

            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is greater than 50 characters', async () =>{         
            // Will produce a string of 51 characters
            name = new Array(52).join('a');

            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () =>{        
            const res = await exec();

            const genre = await Genre.find({ name: 'genre1'});

            expect(res.status).toBe(200);
            expect(genre).not.toBeNull();
            expect(genre[0]).toHaveProperty('name', 'genre1');
        });

        it('should return the genre if it is valid', async () =>{
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

});