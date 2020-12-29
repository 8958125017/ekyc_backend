let multichain = require("multichain-node")({
  port: '9251',
  host: '49.50.67.44',
    user: "multichainrpc",
    pass: "3a6ykGHVUd8vTMKH1SXniHA4asMhKgkHP1oAp6o9Ljg4"
});

multichain.getInfo((err, info) => {
    if(err){
        throw err;
    }
    console.log(info);
})

var add = multichain.getNewAddress().then(data =>{
	console.log(data)
});
// console.log(add)