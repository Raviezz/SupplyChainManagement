const bodyParser = require('body-parser'); //Body parser is a middleware to handle POST data in Express.
const urlencodedParser = bodyParser.urlencoded({extended: true});
const express = require('express')
const sessions = require('express-session')
const app = express(); // routing
const cors = require('cors');
const web3 = require('web3');
const path = require('path');	
const http = require('http');
const Web3 = new web3();

Web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));
//Web3.eth.getAccounts()
var abi =[
	{
		"constant": true,
		"inputs": [],
		"name": "_p_id",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tracks",
		"outputs": [
			{
				"name": "_product_id",
				"type": "uint256"
			},
			{
				"name": "_owner_id",
				"type": "uint256"
			},
			{
				"name": "_product_owner",
				"type": "address"
			},
			{
				"name": "_timeStamp",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"name": "_product_name",
				"type": "string"
			},
			{
				"name": "_product_cost",
				"type": "uint256"
			},
			{
				"name": "_product_specs",
				"type": "string"
			},
			{
				"name": "_product_review",
				"type": "string"
			},
			{
				"name": "_product_owner",
				"type": "address"
			},
			{
				"name": "_manufacture_date",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "participants",
		"outputs": [
			{
				"name": "_userName",
				"type": "string"
			},
			{
				"name": "_passWord",
				"type": "string"
			},
			{
				"name": "_address",
				"type": "address"
			},
			{
				"name": "_userType",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_t_id",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_u_id",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "trck_id",
				"type": "uint256"
			}
		],
		"name": "getProduct_trackindex",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "uid",
				"type": "uint256"
			},
			{
				"name": "uname",
				"type": "string"
			},
			{
				"name": "pass",
				"type": "string"
			},
			{
				"name": "utype",
				"type": "string"
			}
		],
		"name": "userLogin",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "own_id",
				"type": "uint256"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "p_cost",
				"type": "uint256"
			},
			{
				"name": "p_specs",
				"type": "string"
			},
			{
				"name": "p_review",
				"type": "string"
			}
		],
		"name": "newProduct",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "user1_id",
				"type": "uint256"
			},
			{
				"name": "user2_id",
				"type": "uint256"
			},
			{
				"name": "prod_id",
				"type": "uint256"
			}
		],
		"name": "transferOwnership_product",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "pass",
				"type": "string"
			},
			{
				"name": "u_add",
				"type": "address"
			},
			{
				"name": "utype",
				"type": "string"
			}
		],
		"name": "createParticipant",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "p_id",
				"type": "uint256"
			}
		],
		"name": "getParticipant",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "prod_id",
				"type": "uint256"
			}
		],
		"name": "getProduct_details",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
var contadd = "0xa9080f6429e32ec29c154221103db8c42db6001d";

var session;

app.use(sessions({
	secret:'$@%*^gjb&@^&nhv' ,
	resave: false ,
	saveUninitialized: true
}))

var con = Web3.eth.contract(abi).at(contadd);
app.use(cors());  //cross resourse sharing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//console.log(app);
app.get('/newProduct',(req,res)=>{
	res.sendFile(__dirname + '/public/newProduct.html');
});
//
app.get('/transfer',(req,res)=>{
	res.sendFile(__dirname + '/public/transferProduct.html');
});
app.get('/account',(req, res)=> {
    res.sendFile(__dirname + '/public/register.html');
});
app.get('/index',(req, res)=> {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/login',(req, res)=> {
	session = req.session;
	if(session.uniqueID){
		res.redirect('/redirects');
	}
    res.sendFile(__dirname + '/public/login.html');
});
app.get('/logout',(req,res)=>{
	req.session.destroy();
	res.redirect('/login');
   });
   /*app.get('/redirect',(req,res)=>{
	   console.log
	   session = req.session;
	   console.log(session);
		if(session.uniqueID){
		   res.sendFile(__dirname + '/public/traceProduct.html');
		}else{
		   res.redirect('/login');
		}
   });*/


   app.get('/trace',(req,res)=>{
	   session = req.session;
	   if(!session.uniqueID){
		   res.redirect('/login');
	   }
	   
	   res.sendFile(__dirname + '/public/traceProduct.html');
	   console.log(session.uniqueID);
   });
   app.post('/transfer',(req,res)=>{
	   let response =[];
		let acc_id1 = parseInt(req.body.aid1);
		let address1= con.getParticipant.call(acc_id1);
		let add1 = address1[1];
		//response.push(add1);
		let acc_id2 = parseInt(req.body.aid2);
		let prd = parseInt(req.body.pid);
		let trns1 = con.transferOwnership_product.call(acc_id1,acc_id2,prd,{from:add1,gas:3000000});
		let trns = con.transferOwnership_product(acc_id1,acc_id2,prd,{from:add1,gas:3000000});
	//	if(trns){
		
		let track_id =parseInt(con._t_id.call());
		response.push(track_id);

		res.send(response);
		//res.send("transfered...");
		//}else{
		//	res.send("error...");
		//}
		//res.send("hey....");
});
   app.post('/trace', (req, res)=>{
		//let product_id = parseInt(req.body.pid);
		let response =[];
		let index = parseInt(req.body.tid);

		//let track_id =parseInt(con._t_id.call());
		let trackDetails = con.getProduct_trackindex.call(index);
		let track_id =parseInt(con._t_id.call());
		response.push(track_id);
		response.push(trackDetails[0]);
		response.push(trackDetails[1]);
		response.push(trackDetails[2]);
		response.push(trackDetails[3]);

		res.send(response);
   });
app.post('/login',(req,res)=>{
	session = req.session;
	if(session.uniqueID){
		res.redirect('/trace');
	}
	//try{
		var utype =  req.body.utype;
		var uid =parseInt(req.body.u_id);
		var name = req.body.name;
		var pass = req.body.pass;
		var p = con.userLogin.call(uid,name,pass,utype);
		//console.log("T:", types," :", stkid," ", password, "P: ", p);
		//session = req.session;
		if(p == true){
				session.uniqueID = req.body.name;	
				//res.redirect('/redirect');
				res.send("Login sucessfull");
		}else{
			//res.redirect('/redirect');
			res.send("Login Failed. Please try again.");
		}

	//}catch(error){
		//res.send("Some error occured.");
	//}
});

app.post('/newProduct',(req,res)=>{
	
	let userid = req.body.uid;
	let product_name = req.body.prdt_name;
	let prdt_cost = req.body.prdt_cost;
	let prdt_specs = req.body.prdt_specs;
	let prdt_desc = req.body.prdt_desc;

	let invoke = con.newProduct.call(userid,product_name,prdt_cost,prdt_specs,prdt_desc,{from:Web3.eth.accounts[0],gas:3000000});
	let invoke1 = con.newProduct(userid,product_name,prdt_cost,prdt_specs,prdt_desc,{from:Web3.eth.accounts[0],gas:3000000});
	if(parseInt(invoke1) != 0){
		let count =parseInt(con._p_id.call());
		let getProduct = con.getProduct_details.call(parseInt(count-1));
		let details=[]
	
		details.push(count-1);
		details.push(getProduct[0]);
		details.push(getProduct[1]);
		details.push(getProduct[2]);
		details.push(getProduct[3]);
		details.push(getProduct[4]);
		details.push(getProduct[5]);
	 
		res.send(details);
	}
	else{
		res.send("Invalid User");
	}
	
	
});
app.post('/account',(req ,res )=>{
	//if(!err){
		let response =[];
		let uname =req.body.name;
		//let x=1;
		let upass =req.body.pass;
		let utype = req.body.utype;
		let count =parseInt(con._u_id.call());
		let u_address =Web3.eth.accounts[count]; 
		let f_invoke = con.createParticipant.call(uname,upass,u_address,utype,{from:Web3.eth.accounts[0],gas:3000000});
		let f_invoke1 = con.createParticipant(uname,upass,u_address,utype,{from:Web3.eth.accounts[0],gas:3000000});
		let count1 =parseInt(con._u_id.call());
		let out =con.getParticipant.call(count1-1);
		//accnts.push(Web3.eth.accounts);
		response.push(f_invoke1);
		response.push(out);
		
		res.send(response);
		//res.redirect('http://127.0.0.1:3000/login');
	//}
    
});
app.listen(3000); 

