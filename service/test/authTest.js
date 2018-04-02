const assert = require('assert');
const should = require('should');
const request = require('request');
const expect = require('chai').expect;
const util = require("util");

let baseUrl = "http://localhost:3000/";
 
const loginUser = () => { 
	it('Login user', (done) => {  
		let post_payload = {  
			cpf:'017.698.221-35' ,
			password:'123456' ,
		}
		request.post({ 
				url:`${ baseUrl }login`, form: post_payload 
			}, 
			(error,response,body)=>{
					expect(response.statusCode).to.equal(200); 
				done();
			})
	}) 
} 


const logoutUser = (token, done) => {
	request.get({ 
		url:`${ baseUrl }logout`,
		headers:{
			authorization: `JWT ${ token }`
		}
	}, (error,response,body)=>{
			expect(response.statusCode).to.equal(200); 
		done();
	})
} 

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
		}) 
	}) 
}

describe('OAuth', () => {
	loginUser();  
	it('Logout user', (done) => {  
		loggUser().then( token =>{
			logoutUser(token, done);
		}) 
	})
})