import ForgotModel from './model';
import UsersModel from './../users/model';
import Utils from './../utils/utils';

const bcrypt = require('bcrypt');
const util = new Utils();
/*  */

export default class ForgotService {

	save(req){
		let { email } = req.body;
		let generated_pin = this.generatePin();

			if( `${ generated_pin }`.length < 6 ){
				this.save(req)
			}

		return new Promise((resolve, reject)=>{
			ForgotModel.find({ pin : generated_pin }, (err, result)=>{
				if(err){ reject(err); return; }
				if( result.length > 0 ){
					resolve( this.save(req) )
				}else{  
					/////
					UsersModel.find({ email }, (user_err, user_result)=>{
						if(user_err){ reject(user_err) }
						if(user_result.length < 1 ){ 
							let errOut = {
								status:'Error',
								messages:['User not found']
							}
							reject(errOut);
						}
						let user = user_result.shift(); 
						util.sendSMS(user.phone, `Your Recovery PIN is: ${ generated_pin }`)
						.then( response => {
							ForgotModel.remove({
								user_id: user._id
							}, (err, result)=>{
								if(err){ reject(err); return; }
								new ForgotModel({
									pin: generated_pin,
									user_id: user._id
								}).save((err, doc) => {
						            if(err){ reject(err); return; }
						            let output = {
					                	status:'Success',
					                	message:'Pin sent with success'
					                } 
					                resolve(output);
								}) 
							})
						}).catch( error => {
							reject(error)
						})   
					}) 
					/////
				}
			})
		})

		
	}

	validateAndRemove(req){ 
		let { pin, email, password } = req.body; 

		return new Promise((resolve, reject)=>{


			UsersModel.find({ email }, (user_err, user_result)=>{
				if(user_err){ reject(user_err) }
				if(user_result.length < 1 ){ 
					let errOut = {
						status:'Error',
						messages:['User not found']
					}
					reject(errOut);
				}
				let user = user_result.shift(); 

					ForgotModel.find({
						pin: pin,
						user_id: user._id
					}, ( err, result )=>{
						if(err){ reject(err); return; }
						if( result.length > 0 ){  
							let parsed_result = result.shift()
		 
							bcrypt.hash(password, 10, (err, hash) => {
								UsersModel.update({
									_id: user._id
								}, { password: hash }, (err, result)=>{
									if(err){reject(err); return }
									ForgotModel.remove({
										pin: pin
									}, (errr, resultt) => {
										if(err){reject(err); return }
										let output = {
					                 		status:'Success',
					                 		message:'New password created with success'
					                 	}
					                 	resolve(output)  
									})  
								})    
							})

						}else{
							let errOut = {
								status:'Error',
								messages:['Pin not match']
							}
							reject(errOut);
						}
					})

				}).catch( error => {
					reject(error)
				})    


		}) 
	}

	generatePin(){
		return Math.floor( Math.random() * 1000000) + 1;
	}

}