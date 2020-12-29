const Helpers = require('../helpers/helper.js');
const constant = require('../helpers/constant');
const config = require('../helpers/config');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const saltRounds = 10
const admin = require('../models/admin');
const _ = require('underscore');


module.exports = {

	login: async (req, res) => {
		console.log('[success][admin][login]: Request params --> ', req.body);
		if (!req.body.email) return res.send(Message.error400('Email address'))
		if (!req.body.password) return res.send(Message.error400('Password'))
    try{
      let user = await admin.findOne({email:req.body.email});
      console.log(user);
      if(user == null) return res.send({ statusCode: 404, message: "The email address that you've entered doesn't match any account" })
  		bcrypt.compare(req.body.password, user.password, async function (err, match) {
  			console.log("[success][admin][login] : ", err, match)
  			if (err)  return res.send({statusCode:500,message:"Something went wrong."});
  			if (!match) return res.send({statusCode: 500,message: "The password that you've entered is incorrect."})
        return res.send({statusCode:200,message:"Login Successfully.",data:user});
  		})
    }
    catch(err)
    {
      console.log('[error][admin][login]: error --> ', err);
      return res.send({statusCode:500,message:"Something went wrong."});
    }
	}

}
