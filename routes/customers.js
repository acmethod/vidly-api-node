const { Customer, validateCustomer } = require('../models/customer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();

router.get('/',  async (req, res)=>{
    const customers = await Customer.find().sort( { name: 1 } );

    res.send(customers);
});

router.get('/:id',  async (req, res)=>{
    const customer = await Customer.findById(req.params.id);

    if ( !customer ){
        res.status(404).send(`Customer with Id ${req.params.id} was not found`);
        return;
    }

    res.send(customer);
});

router.post('/',  [auth, validate(validateCustomer)], async (req, res)=>{
    const customer = new Customer({isGold: req.body.isGold, name: req.body.name, phone: req.body.phone});

    await customer.save();

    res.send(customer);
});

router.put('/:id', [auth, validate(validateCustomer)], async (req, res)=>{
    
    // third object tells to return the updated obj
    const customer = await Customer.findByIdAndUpdate(req.params.id, { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone }, {new: true})
    
    if ( !customer ){
        res.status(404).send(`Customer with Id ${req.params.id} was not found`);
        return;
    }

    res.send(customer);
});

router.delete('/:id',  async (req, res)=>{
    const customer = await Customer.findByIdAndRemove( req.params.id )

    if ( !customer ){
        res.status(404).send(`Customer with Id ${req.params.id} was not found`);
        return;
    }

    res.send(customer);
});



module.exports = router;