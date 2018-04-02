const assert = require('assert');
const should = require('should');
const request = require('request');
const expect = require('chai').expect;
const util = require("util");

let baseUrl = "http://localhost:3000/";

const loggUser = () =>{
	return new Promise((resolve, reject)=>{  
		let post_payload = { 
			cpf:'017.698.221-35', 
			password:'123456'
		} 
		request.post({ 
			url:`${ baseUrl }login`, form: post_payload 
		}, (error, response, body) => { 
			resolve(JSON.parse(body).token)
		});
	});   
}

const loggiUser = () =>{
	return new Promise((resolve, reject)=>{   
		let post_payload = { 
			name:'IxRAEL TDD DELETABLE', 
			email:'israel.outeiro@99.delete' ,
			phone:'+5561981613925' ,
			cpf:'297.666.131-68',  
		}
		request.post({ 
			url:`${ baseUrl }users`, form: post_payload 
		},  (error,response,body)=>{
			resolve(JSON.parse(body).token) 
		})  
	})   
}
 
const createUser = () => { 
	it('Create user', (done) => {  
		let post_payload = { 
			name:'IxRAEL TDD USER', 
			email:'israel.outeiro@99.exchange' ,
			phone:'+5561981613925' ,
			cpf:'017.698.221-35' , 
			password:'123456'
		}
		request.post({ 
			url:`${ baseUrl }users`, form: post_payload 
		}, 
		(error,response,body)=>{
				expect(response.statusCode).to.equal(200); 
			done();
		})
	}) 
} 

 
const readUser = ( token, done ) => {   
	request.get({ 
		url:`${ baseUrl }users`,  
		headers:{
			authorization: `JWT ${ token }`
		}
	},  (error,response,body)=>{
			expect(response.statusCode).to.equal(200); 
		done();
	}) 
} 
 
const updateUser = ( token, done ) => {  
	let post_payload = { 
		name:'IxRAEL UPDATED', 
		email:'israel.outeiro@99.exchange' ,
		phone:'+5561981613925' ,
		cpf:'017.698.221-35' ,
	}
	request.put({ 
		url:`${ baseUrl }users`, 
		form: post_payload,
		headers:{
			authorization: `JWT ${ token }`
		}
	},  (error,response,body)=>{
			expect(response.statusCode).to.equal(200); 
		done();
	}) 
} 
 
const deleteUser = ( token, done ) => {   
	request.delete({ 
		url:`${ baseUrl }users`,  
		headers:{
			authorization: `JWT ${ token }`
		}
	},  (error,response,body)=>{
			expect(response.statusCode).to.equal(200); 
		done();
	}) 
} 




describe('Users', () => {
	createUser();  
	it('Read user', (done) => {  
		loggUser().then( token => {  
			readUser(token, done);   
		}).catch(err=>{ });
	});
	it('Update user', (done) => {  
		loggUser().then( token => {  
			updateUser(token, done);   
		}).catch(err=>{ });
	});
	it('Delete user', (done) => {  
		loggiUser().then( token => {  
			deleteUser(token, done);   
		}).catch(err=>{ });
	});
})