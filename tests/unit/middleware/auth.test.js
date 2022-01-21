const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe( 'auth middleware', () =>{
    it('should populate req.use with the payload of a valid JWT', () =>{
        const u = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
        
        const token = new User(u).generateAuthToken();
        
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        
        const res = {};

        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(u);
    });
});