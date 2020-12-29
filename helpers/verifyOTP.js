const otp = require('../models/otp');
const Message = require('../helpers/message');
const dummyAuthPerson = require("../models/dummyAuthPersonData");
const Helpers = require("./helper.js")

module.exports={

  verifyOTP:(req,res,next)=>{
    console.log('\n[success] [verifyOTP] : Request ', req.body)
    if (!req.body.otp) return res.send(Message.error400("OTP"));
    if(req.body.referenceNo) req.body["refNo"]=req.body.referenceNo;
    if(!req.body.refNo) return res.send(Message.error400("Reference No"));
    otp.findOneAndUpdate({refNo:req.body.refNo,otp:req.body.otp},{$set :{otp:0,uts: Helpers.dateSeconds()}},{new:true})
    .then(success=>{
        if(success==null)
        {
          console.log('\n[Error] [verifyOTP] : Invalid OTP')
          return res.send({statusCode:400,message:"Invalid OTP."})
        }
        else
        {
          console.log('\n[success] [verifyOTP] : OTP verify successfully . ')
          next();
        }

    })
    .catch(error=>{
        console.log('\n[Error] [verifyOTP] : ',error)
        return res.send(Message.Error500(error));
    })
  },

  verifyAuthPersonOtp: async (req, res, next) => {
		if (!req.body.otp) return res.send(Message.error400("OTP"));
		if (!req.body.refNo) return res.send(Message.error400("Reference Number"));

		dummyAuthPerson.findOne({
				otp: req.body.otp,
				refNo: req.body.refNo
			})
			.then(async (data) => {
				if (data) {
					console.log("\n\n\n======DATA FOUND====\n", data);
          try{
            let delData = await dummyAuthPerson.findOneAndUpdate({
              otp: req.body.otp,
              refNo: req.body.refNo
            }, {
              $set: {
                otp: 0
              }
            });

            next();
          }
          catch(err) {
            return res.send(Message.Error500());
          }
				} else {
					return res.send(Message.error404("Invalid OTP"));
				}
			})
			.catch((e) => {
				console.log("=========ERRROR=====", e);
				return res.send(Message.Error500());
			});
	},
}
