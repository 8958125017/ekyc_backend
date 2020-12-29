const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let business = new Schema({

    email: {type:String , unique: true,lowercase:true},
    businessName: {type: String },
    businessAddress: {type: String },
    businessState: {type: String },
    businessCountry: {type: String },
    phone: {type: String},
    mobile: {type: String},
    tax_reg_no: {type: String, unique: true},
    type_of_business: {type: String},
    blockaddr: {type: String},
    password: {type:String},
    cts : { type:Date, default:Date.now }

})

module.exports = mongoose.model('business',business);

