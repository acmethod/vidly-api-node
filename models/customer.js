const mongoose = require('mongoose');
const Joi = require('joi'); 

const customerSchema = new mongoose.Schema({
    isGold: { type: Boolean, default: false },
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    phone: { type: String, required: true, minlength: 5, maxlength: 50 },
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        phone: Joi.string().required().min(5).max(50),
        isGold: Joi.boolean().optional()
    });

    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;