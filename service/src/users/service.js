import UserModel from './model';
import AuthModel from './../oauth/model';
import jwt from 'jsonwebtoken'; 
import passportJWT from "passport-jwt";
import Utils from './../utils/utils';

const bcrypt = require('bcrypt');
const ExtractJwt = passportJWT.ExtractJwt;
const idwall_end_point = `https://api-v2.idwall.co/`

const util = new Utils();
/*  */

// export const argon = require('argon2');

export default class UsersService {

	save(req){
		let { name, cpf, email, phone, password } = req.body;

		cpf = util.cleanCPF(cpf)

		let userPosted = { 
			cpf: cpf, 
			name: name, 
			email: email, 
			phone: phone, 
			validated_identity: false,
			validated_phone: false,
			validated_email: false
		};

		if( this.isSaveValidated(userPosted) !== true ){
			return new Promise((resolve,reject) => { 
				reject( this.isSaveValidated(userPosted) )
			});
		}else{
			/* Save */ 

				//argon2.generateSalt().then(salt => {
				  	//argon2.hash(userPosted.password, salt).then(hash => {
				  		//user.password = hash;
				  	//});
				//});
				
			return new Promise((resolve,reject) => { 

				// at moment we are usign BCrypt but it need be improved to Argon2

				if(  password && password.length > 0 ){ 
					userPosted['password'] = password 
				}else{
					userPosted['password'] = Math.random(100000);
				} 

				let errOut = {
					status:'Error',
					messages:[]
				} 

				let self = this;
				bcrypt.hash(userPosted.password, 10, (err, hash) => {
					userPosted.password = hash;
					self.verifyEmail(email, false)
						.then( response => {
							self.verifyCPF(cpf, false)
								.then( response => { 
									new UserModel(userPosted).save( (err, doc) => {
					                    if(err){ reject(err); return; }
					                    
					                    delete userPosted.password;
					                    self.getUserToken({ id: doc._id }).then( result => {
					                    	let output = {
						                    	status:'Success',
						                    	message:'User created with success',
						                    	user: userPosted,
						                    	token: result
						                    }
						                    resolve(output)
					                    }).catch( err => {
					                    	reject(err)
					                    })  

					                });
								}).catch( err =>{
									errOut.messages.push( err );
									reject(errOut)
								})
						}).catch( err =>{
							errOut.messages.push( err );
							reject(errOut)
						}) 
				}); 
				// end bcrypt
		    })
		}



	} 

	update(req){
		let { name, cpf, email, phone } = req.body;
		
		cpf = util.cleanCPF(cpf)

		let objPosted = {}
		let errOut = {
			status:'Error',
			messages:[]
		}

		if( name && name.length > 0 ){ objPosted['name'] = name }
		if( phone && phone.length > 0 ){ objPosted['phone'] = phone }

		return new Promise((resolve, reject)=>{
			this.verifyEmail(email, req.user.id )
				.then( response => { 
					objPosted['email'] = email ;
					this.verifyCPF( cpf, req.user.id )
						.then( response => { 
							//do Update
							objPosted['cpf'] = cpf ;  
							if( errOut.messages.length === 0 ){
								UserModel.update({
									_id: req.user._id	
								}, objPosted, (err, result)=>{
									if(err){ reject(err); return; }
									let output = {
					                	status: 'Success',
					                	message: 'User updated with success',
					                	user: objPosted
					                }
									resolve(output)
								})
							}else{
								reject(errOut)
							} 
						}).catch( err =>{
							errOut.messages.push( err );
							reject(errOut)
						}) 
				}).catch( err =>{
					errOut.messages.push( err );
					reject(errOut)
				})	
		})
	}

	read(req){
		return new Promise((resolve, reject)=>{
			resolve({
				cpf:req.user.cpf,
				name:req.user.name,
				email:req.user.email,
				phone:req.user.phone
			})
		})
	}

	delete(req){
		return new Promise((resolve, reject)=>{
			UserModel.remove({
				_id: req.user.id	
			}, (err, result)=>{

				if(err){ reject(err); return; }
				let output = {
                	status:'Success',
                	message:'User deleted with success'
                }
				resolve(output)

			})
		})
	}

	isSaveValidated(user){  
		let output = {
			status:'Error',
        	messages:[]
        } 
		if ( !user.name ||  !(user.name.length > 0) ) output.messages.push('Name is required') ;
		if ( !user.cpf ||  !(user.cpf.length > 0) ) output.messages.push('CPF is required') ;
		if ( !user.email ||  !(user.email.length > 0) ) output.messages.push('Email is required') ;
		if ( !user.phone || !(user.phone.length > 0) ) output.messages.push('Phone is required') ;
		if ( !user.cpf || !util.isCpf(user.cpf) ) output.messages.push('Invalid CPF') ;
		if ( !user.email || !util.isEmail(user.email) ) output.messages.push('Invalid Email') ;
        return output.messages.length === 0 ? true : output
	}


	verifyEmail(email, user_id ){
		return new Promise( (resolve, reject) => {
			if( email && email.length > 0 ){ 
				if(!util.isEmail(email)){  
					reject('Invalid Email');
				}else{
					let query = {}
					if( user_id === false ){ query = { 'email': email }   }else{ query = { 'email': email, '_id': { $ne: user_id } }; }
					UserModel.find( query , (eer, reegisters) => {
	            		if( reegisters.length ){ 
	            			reject('Email is already in use');
	            		}else{ 
	            			resolve(true);
	            		}
	            	})
				}
			}else{ 
	           	resolve(true);
			}
		});
	}

	verifyCPF( cpf, user_id ){
		return new Promise( (resolve, reject) => {
			if( cpf && cpf.length > 0 ){  
				if(!util.isCpf(cpf)){   
					reject('Invalid CPF');
				}else{
					let query = {}
					if( user_id === false ){ query = { 'cpf': cpf }   }else{ query = { 'cpf': cpf, '_id': { $ne: user_id } }; }
					UserModel.find( query , (eer, reegisters) => {
	            		if( reegisters.length ){ 
	            			reject('CPF is already in use');
	            		}else{ 
	            			resolve(true);				
	            		}
	            	})
				}
			}else{
	            resolve(true);		
			}
		})
	}



	getUserToken(user){ 
		return new Promise( (resolve, reject) => {
			let jwtOptions = {}
			jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
			jwtOptions.secretOrKey = process.env.API_SECRET;

			let payload = { id: user.id };
		    let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: ( 15 * 60 ) } ); 

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
					            resolve(token);
					        });
					    ////////////////
	        }) 
		}) 
	}



	/* BitGO */
	// initBitGO(){
	// 	let bitgo = new BitGoJS.BitGo({
	// 		accessToken:'v2xab1bf3b947e1d81fdab02406c512557376d1f2b586ad8d2b2562314315ea7e88'
	// 	});
	// 	bitgo.session({}, (err, session) => {
	// 	  if (err) {
	// 	    // handle error
	// 	  }
	// 	  console.log(session);
	// 	});
	// } 


	




}