/*
 * GET home page.
 */

var crypto=require('crypto');
var secretKey="dlksnfiwaerwofnwe9r8uyweunzx9cew0u98erq";

var getHash=function(state,ts){
	
	var text=state+"|"+ts+"|"+secretKey;
	var hmac=crypto.createHmac("sha256",secretKey);
	hmac.setEncoding('base64');
	hmac.write(text);
	hmac.end();
	var hash=hmac.read();
	return hash;
	
	
	
}

exports.index = function(req, res) {
	var http = require('http');
	var ts=new Date().getTime();
	var state="NoCoinState";
	var hash=getHash(state,ts);
	
	var Client = require('node-rest-client').Client;
	var client = new Client();

	// direct way
		client.get("http://gbserver-harshank.rhcloud.com", function(data,
			response) {

		var count=data.countGumballs;
		var msg="\n\n Mighty Gumball INC \n Model#"+data.modelNumber+"\n"+"Serial #"+data.serialNumber+"\n"+"\n"+state+"\n\n";
		

		res.render('index', {
			message : msg,state:state,ts:ts,hash:hash,modelNumber:data.modelNumber,serialNumber:data.serialNumber
		});

	});

};

exports.GumballAction = function(req, res) {

	var action=req.param('event');
	var state=req.param('state');
	var hash1=req.param('hash');
	var modelNumber=req.param('modelNumber');
	var serialNumber=req.param('serialNumber');
	var ts=parseInt(req.param('ts'));
	var now=new Date().getTime();
	var diff=((now-ts)/1000);
	hash2=getHash(state,ts);
	if(diff>120 || hash1!=hash2){
		//error(req,res,"********Session Invalid********");
		res.render('index', {
			message : "********Session Invalid********"
		});
	}
	

	// var message=req.param('message');
	if (action === 'InsertQuater' && state === 'NoCoinState') {

		state = 'HasACoin';
		var messagesToBePut = [];
		var msg="\n\n Mighty Gumball INC \n Model#"+modelNumber+"\n"+"Serial #"+serialNumber+"\n"+"\n"+state+"\n\n";
		
		
		res.render('index', {
			message : msg,state:state,ts:ts,hash:getHash(state,ts),modelNumber:modelNumber,serialNumber:serialNumber
		});

	}
	
	//COde for turn the crank,only if the state is HasACoin
	if (action === 'TurnTheCrank' && state === 'HasACoin') {
		var messagesToBePutInPost = [];
		var Client = require('node-rest-client').Client;
		var client = new Client();
				client.put("http://gbserver-harshank.rhcloud.com/1", args,
				response) {
			var ar = {};

			ar = data;

			var count = ar.countGumballs;

			if (count !== 0) {
				state="NoCoinState"
				count = count - 1;
				var args = {
					data : {
						countGumballs : count
					},
					headers : {
						"Content-Type" : "application/json"
					}
				};
				client.put("http://gumball-gumballprasad.rhcloud.com/gumball/1", args,
						function(data, response) {
							// parsed response body as js object
							console.log(data);
							// raw response
							console.log(response);
							var msg="\n\n Mighty Gumball INC \n Model#"+modelNumber+"\n"+"Serial #"+serialNumber+"\n"+"\n"+state+"\n\n";
							res.render('index', {
								message : msg,state:state,ts:ts,hash:getHash(state,ts),modelNumber:modelNumber,serialNumber:serialNumber
							});
						});

			}else{
				
				var msg="\n\n Mighty Gumball INC \n Model#"+data.modelNumber+"\n"+"Serial #"+data.serialNumber+"\n"+"\n"+"OutOfStock"+"\n\n";
				res.render('index', {
					message : messagesToBePutInPost
				});
			}

		});

	}

};