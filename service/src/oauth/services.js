import mongoose from 'mongoose';
import _ from "lodash";  
import jwt from 'jsonwebtoken'; 
import passportJWT from "passport-jwt";
import UserModel from './../users/model';
import AuthModel from './model';
import Utils from './../utils/utils';

const bcrypt = require('bcrypt');
const ExtractJwt = passportJWT.ExtractJwt;
const util = new Utils();

export default class AuthService {

  doLogin(body){
	return new Promise( (resolve, reject) => {
	  	let { email, password } = body 

		let jwtOptions = {}
		jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
		jwtOptions.secretOrKey = process.env.API_SECRET;

	  	UserModel.find( { email } , (err, user) => { 

	      if ( err ) { reject( err);  }
	      if ( !user.length || user.length < 1 ) { reject({ status:'Error', messages:["User not found"] }); return;}
	      	user = user.shift() 
	      	let cuser = {
	      		name: user.name,
	      		email: user.email,
	      		cpf: user.cpf,
	      		phone:user.phone
	      	}

			bcrypt.compare(password, user.password, function(err, password_match) {
			    if( password_match ) { 
				    let payload = { id: user.id };
				    let minutes_token = 60;
				    let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: ( minutes_token * 60 ) } ); 

				    AuthModel
				    	.updateMany({ 'user_id': user.id }, 
				    			{ is_valid : false }, null,
                       			(err,doc)=>{
	                        		if(err) reject({ status:'Error', messages:["DB Error"], error:err })
		                        	// SAVE	TOKEN //
								    	new AuthModel({
								    		token,
								    		is_valid: true,
								    		user_id: user.id
								    	}).save( (err, doc) => {
								            if(err){ reject(err); } 
								            resolve({ status:'Success', message: "User logged in with Success", token: token, user: cuser });
								        });
								    ////////////////
                    }) 
				    	
				} else {
				    reject({ status:'Error', messages:["Password wrong"] }) 
				}
			});

	  	}); 

	});
  }

  doLogout(req){
	return new Promise( (resolve, reject) => {  
	    AuthModel
    	.updateMany({ 'user_id': req.user.id }, 
    		{ is_valid : false }, null,
       		(err,doc)=>{
        		if(err) reject({ status:'Error', messages:["DB error"], error:err })
		    resolve({ status:'Success', message: "User logged out with Success" }) ;
    	}) 
	});
  }

  generateKey(){
  	return new Promise((resolve, reject)=>{
  		resolve({ 
  			status:'Success',
  			message:'Hash generated with Success',
			hash: require('crypto')
				  .createHash('sha256')
				  .update(`${ Math.random(10000000) }`)
				  .update('salt').digest('hex') 
		});
  	})
  }
   
}