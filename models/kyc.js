const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let kyc = new Schema({
    name: {type:String},
    father_name: {type:String},
    first_name: {type:String},
    m_name: {type:String},
    l_name: {type:String},
    mother_name: {type:String},
    govt_id_1: {type:String},
    govt_id_2: {type:String},
    govt_id_3: {type:String},
    govt_id_4: {type:String},
    govt_doc_1: {type:String},
    govt_doc_2: {type:String},
    govt_doc_3: {type:String},
    govt_doc_4: {type:String},
    mob_num: {type:String},
    curr_add: {type:String},
    state: {type:String},
    country: {type:String},
    postal_code: {type:String},
    email: {type:String ,lowercase:true},
    password: {type:String},
    sts : {type:String, default: 'active'},
    pubBlockaddr : {type: String},
    cts : { type:Date, default:Date.now },
    kycid: { type: String, unique: true}
})

module.exports = mongoose.model('kyc',kyc);
