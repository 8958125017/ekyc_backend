const mongoUrl = 'mongodb://penny:boostersA123@127.0.0.1:27017/ekyc?authSource=admin'; 	// Mongo DB URL for Node maintained data
const host='http://49.50.67.44';				// URL for Angular code (Entity) [RedirectURL]
const port='2019';								// Port on which Node instance is running
const credentials = require("multichain-node")({
  port: '9251',
  host: '49.50.67.44',
  user: "multichainrpc",
  pass: "3a6ykGHVUd8vTMKH1SXniHA4asMhKgkHP1oAp6o9Ljg4"
});
const adminAddress = '1VVoqN4SnfyGRuk1NhbxypVgpzDj2rXrfXec5X';
const emailAddress = "qtlmailer@gmail.com"
const emailPassword="boostersA123"
module.exports = {
	mongoUrl: mongoUrl,
	host: host,
	port: port,
	credentials:credentials,
	adminAddress:adminAddress,
	emailAddress:emailAddress,
	emailPassword:emailPassword
}
