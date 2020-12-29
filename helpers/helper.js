const bcrypt = require('bcrypt-nodejs')
const saltRounds = 10;
const nodemailer = require('nodemailer');
const config = require('./config')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailAddress,
    pass: config.emailPassword
  }
});
module.exports = {
  dateSeconds: (date)=>{
		if (date)
			return Math.floor(date / 1000).toString()
		else
			return Math.floor(Date.now() / 1000).toString()
	},
  genratePassword:()=>{
    var password = '';
		var otppossible = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for (var i = 0; i < 8; i++) {
			password += otppossible.charAt(Math.floor(Math.random() * otppossible.length));
		};
    return password;
  },
  hashPasswordfn: (password) => {
    return new Promise( async (resolve, reject)=>{
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, null, async function (err, hash) {
          if (err) reject(false);
          resolve(hash);
          })
      })
    })
	},
  sendMail: (sendData)=>{
    transporter.sendMail(sendData, function (error, info) {
      if (error) {
        console.log('Error occurred while sending mail ============ :::::', error);
        // callback("Mail sent failed")
        // return res.send({
        //   statusCode: 500,
        //   message: error
        // })
      } else {
        console.log('********************** Mail sent successfully **************************')
        // callback("Mail sent succesfully")
      }
    })
  }

}
