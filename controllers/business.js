const async = require('async');
const _ = require('underscore');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const saltRounds = 10
const admin = require('../models/admin');
const config = require('../helpers/config')
const Helpers = require('../helpers/helper')
const business = require('../models/business');
const kyc = require('../models/kyc');

const multichain = require('../helpers/multichain')
const multichainCredential = config.credentials;

async function signup (req,res){
	if (!req.body.email) return res.send({statusCode:400,message:"Email Id is missing."});
    if (!req.body.businessName) return res.send({statusCode:400,message:"Business name is missing."});
    if (!req.body.businessAddress) return res.send({statusCode:400,message:"Business Address is missing."});
    if (!req.body.tax_reg_no) return res.send({statusCode:400,message:"tax_reg_no name is missing."});
    if (!req.body.business_type) return res.send({statusCode:400,message:"business_type name is missing."});
    if (!req.body.password) return res.send({statusCode:400,message:"password name is missing."});

    try{
      let hashPassword = await Helpers.hashPasswordfn(req.body.password);
      req.body["password"] = hashPassword;
      req.body["blockaddr"] = await multichain.getNewAddressandpermissionOnMultichain();
      let mdata = await business.create(req.body);
      delete req.body.password
	  	let publish = await multichainCredential.publishFrom({
		            from:config.adminAddress,
		            stream:"business",
		            key:req.body.blockaddr,
		            data: {"json":req.body}
		          })
	  	return res.send({statusCode:200,message:"Business has been Successfully registered."})
      console.log('[success][business][signup]: Request blockaddr --> ',publish);
    }
    catch(err)
    {
      console.log('[error][business][signup]: error --> ', err.code);
      if(err.code ==11000) return res.send({statusCode:500,message:"Record with the Email or tax registration number already exist"});
      return res.send({statusCode:500,message:"Something went wrong."});
    }
}

async function businesslogin (req,res){
	if (!req.body.email) return res.send({statusCode:400,message:"Email Id is missing."});
  if (!req.body.password) return res.send({statusCode:400,message:"Password is missing."});
  let hashPassword = await Helpers.hashPasswordfn(req.body.password);
  try{
    let user = await business.findOne({email:req.body.email});
    console.log(user);
    if(user == null) return res.send({ statusCode: 404, message: "The email address that you've entered doesn't match any account" })
    // if(user == null) return res.send({ statusCode: 404, message: "The email address that you've entered doesn't match any account" })
    bcrypt.compare(req.body.password, user.password, async function (err, match) {
      console.log("[success][business][login] : ", err, match)
      if (err)  return res.send({statusCode:500,message:"Something went wrong."});
      if (!match) return res.send({statusCode: 500,message: "The password that you've entered is incorrect."})
      return res.send({statusCode:200,message:"Login Successfully.",data:user});
    })
  }
  catch(err)
  {
    console.log('[error][business][login]: error --> ', err);
    return res.send({statusCode:500,message:"Something went wrong."});
  }
}

async function registerKyc (req,res){
	let publishData = {}
	let keys = []
  if (!req.body.pubBlockaddr) return res.send({statusCode:400,message:"publisher address not provided"})
  if(req.files.govt_doc_1){
  	let gov_id_1_path = "./files/gov_id/"+req.files.govt_doc_1.name
  	req.files.govt_doc_1.mv(gov_id_1_path)
  	publishData["govt_doc_1"] = gov_id_1_path
  }
  if(req.files.govt_doc_2){
  	let gov_id_2_path = "./files/gov_id/"+req.files.govt_doc_2.name
  	req.files.govt_doc_2.mv(gov_id_2_path)
  	publishData["govt_doc_2"] = gov_id_2_path
  }
  if(req.files.govt_doc_3){
  	let gov_id_3_path = "./files/gov_id/"+req.files.govt_doc_3.name
  	req.files.govt_doc_3.mv(gov_id_3_path)
  	publishData["govt_doc_3"] = gov_id_3_path
  }
  if(req.files.govt_doc_4){
  	let gov_id_4_path = "./files/gov_id/"+req.files.govt_doc_4.name
  	req.files.govt_doc_4.mv(gov_id_4_path)
  	publishData["govt_doc_4"] = gov_id_4_path
  }
  if(req.body.govt_id_1){
  	publishData["govt_id_1"] = req.body.govt_id_1
  	keys.push(req.body.govt_id_1)
  }
  if(req.body.govt_id_2){
  	publishData["govt_id_2"] = req.body.govt_id_2
  	keys.push(req.body.govt_id_2)
  }
  if(req.body.govt_id_3){
  	publishData["govt_id_3"] = req.body.govt_id_3
  	keys.push(req.body.govt_id_3)
  }
  if(req.body.govt_id_4){
  	publishData["govt_id_4"] = req.body.govt_id_4
  	keys.push(req.body.govt_id_4)
  }
  if(req.body.first_name){
  	publishData["first_name"] = req.body.first_name
  }
  if(req.body.m_name){
  	publishData["m_name"] = req.body.m_name	
  }
  if(req.body.l_name){
  	publishData["l_name"] = req.body.l_name
  }
  if(req.body.father_name){
  	publishData["father_name"] = req.body.father_name
  }
  if(req.body.mother_name){
  	publishData["mother_name"] = req.body.mother_name
  }
  if(req.body.curr_add){
  	publishData["curr_add"] = req.body.curr_add
  }
  if(req.body.city){
  	publishData["city"] = req.body.city
  }
  if(req.body.state){
  	publishData["state"] = req.body.state
  }
  if(req.body.country){
  	publishData["country"] = req.body.country
  }
  if(req.body.pincode){
  	publishData["pincode"] = req.body.pincode
  }
  if(req.body.dob){
  	publishData["dob"] = req.body.dob
  }
  if(req.body.mob_num){
  	publishData["mob_num"] = req.body.mob_num
  }
  if(req.body.email){
  	publishData["email"] = req.body.email
  }
  let random = Math.floor(Math.random() * (9999999999 - 1000000000)) + 10000

  publishData["kycid"] = 'ID'+random.toString()
  publishData["pubBlockaddr"] =req.body.pubBlockaddr

  //check all owners if they are registered or not
  // if not registred register

  
  let publish = await multichainCredential.publishFrom({
      from: req.body.pubBlockaddr,
      stream:"kyc",
      key: publishData.kycid,
      data: {"json":publishData}
    }, (err, result)=>{

    if(err) res.send({statusCode:400,message:"Error occured while publishing KYC", data:err})

    else{
      kyc.create(publishData, async (err,result)=>{
		    if(err) return res.send({statusCode:400,message:"error in inserting doc", data : err})
		    
		    return res.send({statusCode:200,message:"KYC registered Successfully"})
		    
		  });
      
    }

  })
}

async function getIssuedKyc (req,res){
	  if (!req.body.kycid) return res.send({statusCode:400,message:"kycid not provide"})

	  if (!req.body.pubBlockaddr) return res.send({statusCode:400,message:"pubBlockaddr not provide"})

	  kyc.find({pubBlockaddr:req.body.pubBlockaddr, kycid: req.body.kycid}, (err, result)=>{
	    if (err) return res.send({statusCode:400,message:"Error occured while fetching KYC", data:err})
	    if (result){
	      return res.send({statusCode:200,message:"KYC records found", data:result, count:result.length})
	    }
	    else{
	      return res.send({statusCode:200,message:"No data found", data:result})
	    }
	  })
}

async function getallKYC (req,res){
	if (!req.body.pubBlockaddr) return res.send({statusCode:400,message:"pubBlockaddr not provide"})
  kyc.find({pubBlockaddr:req.body.pubBlockaddr}, (err, result)=>{
    if (err) return res.send({statusCode:400,message:"Error occured while fetching KYC", data:err})
    if (result){
      return res.send({statusCode:200,message:"KYC records found", data:result, count:result.length})
    }
    else{
      return res.send({statusCode:200,message:"No data found", data:result})
    }
  })
}

async function searchKYC (req,res){
	let publishData = {}
  if(req.body.govt_id_1){
  	publishData["govt_id_1"] = req.body.govt_id_1
  }
  if(req.body.govt_id_2){
  	publishData["govt_id_2"] = req.body.govt_id_2
  }
  if(req.body.govt_id_3){
  	publishData["govt_id_3"] = req.body.govt_id_3
  }
  if(req.body.govt_id_4){
  	publishData["govt_id_4"] = req.body.govt_id_4
  }
  if(req.body.first_name){
  	publishData["first_name"] = req.body.first_name
  }
  if(req.body.m_name){
  	publishData["m_name"] = req.body.m_name	
  }
  if(req.body.l_name){
  	publishData["l_name"] = req.body.l_name
  }
  if(req.body.father_name){
  	publishData["father_name"] = req.body.father_name
  }
  if(req.body.mother_name){
  	publishData["mother_name"] = req.body.mother_name
  }
  if(req.body.curr_add){
  	publishData["curr_add"] = req.body.curr_add
  }
  if(req.body.city){
  	publishData["city"] = req.body.city
  }
  if(req.body.state){
  	publishData["state"] = req.body.state
  }
  if(req.body.country){
  	publishData["country"] = req.body.country
  }
  if(req.body.pincode){
  	publishData["pincode"] = req.body.pincode
  }
  if(req.body.dob){
  	publishData["dob"] = req.body.dob
  }
  if(req.body.mob_num){
  	publishData["mob_num"] = req.body.mob_num
  }
  if(req.body.email){
  	publishData["email"] = req.body.email
  }
  console.log(publishData)
  kyc.find(publishData, (err, result)=>{
    if (err) return res.send({statusCode:400,message:"Error occured while fetching KYC", data:err})
    if (result){
      return res.send({statusCode:200,message:"KYC records found", data:result, count:result.length})
    }
    else{
      return res.send({statusCode:200,message:"No data found", data:result})
    }
  })
}
async function getAllKycCount (req,res){
	kyc.countDocuments({}, function( err, count){
		if (err) return res.send({statusCode:400,message:"Error occured while fetching count", data:err})
		 if (count){
      return res.send({statusCode:200,message:"KYC records count", data:count})
    }
    console.log( "Number of kyc:", count );
	})
}
async function getAllBusinessCount (req,res){
	business.countDocuments({}, function( err, count){
		if (err) return res.send({statusCode:400,message:"Error occured while fetching count", data:err})
		 if (count){
      return res.send({statusCode:200,message:"Business records count", data:count})
    }
    console.log( "Number of Business:", count );
	})
}
async function getAllBusinessKycCount (req,res){
	kyc.countDocuments({pubBlockaddr:req.body.pubBlockaddr}, function( err, count){
		if (err) return res.send({statusCode:400,message:"Error occured while fetching count", data:err})
		 if (count){
      return res.send({statusCode:200,message:"Business records count", data:count})
    }
    console.log( "Number of Business:", count );
	})
}

exports.signup=signup;
exports.businesslogin=businesslogin;
exports.registerKyc=registerKyc;
exports.getIssuedKyc=getIssuedKyc;
exports.getallKYC=getallKYC;
exports.searchKYC=searchKYC;
exports.getAllKycCount=getAllKycCount;
exports.getAllBusinessCount=getAllBusinessCount;
exports.getAllBusinessKycCount=getAllBusinessKycCount;
