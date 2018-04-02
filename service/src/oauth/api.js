// import model from './model';
import AuthService from './services';

const authService = new AuthService();

export default class OAuthApi {

	login(req, res) { 

		/**
		 * @api {post} /login User Login 
		 * @apiName LoginUser
		 * @apiGroup OAuth
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {String} email Email of User
		 * @apiParam {String} password Password of User  
		 *
		 * @apiSuccess {String} status Status of request ( Success )
		 * @apiSuccess {String} message A message about status
		 * @apiSuccess {String} token User token
		 * @apiSuccess {Object} user User object
		 * @apiSuccess {String} user.name Name of user
		 * @apiSuccess {String} user.email Email of user 
		 * @apiSuccess {String} user.cpf CPF of user 
		 * @apiSuccess {String} user.phone Phone of user  
		 *
		 * @apiError {String} status Status of request ( Error )
		 * @apiError {String} messages Messages about status
		 *
		 */

		authService.doLogin(req.body)
		  .then((response)=>{
		  	res.json(response)
		}).catch((err)=>{  
		  	res.status(401).json(err)
		})
	}

	logout(req, res) { 

		/**
		 * @api {get} /logout User Logout 
		 * @apiName LogoutUser
		 * @apiGroup OAuth
		 * @apiVersion 1.0.0
		 * 
		 * @apiHeader {String} authorization `JWT {{ ACCESS_TOKEN }}`.
		 *
		 * @apiSuccess {String} status Status of request ( Success )
		 * @apiSuccess {String} message A message about status  
		 *
		 * @apiError {String} status Status of request ( Error )
		 * @apiError {String} messages Messages about status
		 *
		 */

		authService.doLogout(req)
		  .then((response)=>{
		  	res.json(response)
		}).catch((err)=>{  
		  	res.status(401).json(err)
		})
	}

	getKey(req, res){

		/**
		 * @api {get} /hash Get a generic Hash
		 * @apiName GetHash
		 * @apiGroup System
		 * @apiVersion 1.0.0 
		 *
		 * @apiSuccess {String} status Status of request ( Success )
		 * @apiSuccess {String} message A message about status  
		 * @apiSuccess {String} hash Hash generated  
		 *
		 * @apiError {String} status Status of request ( Error )
		 * @apiError {String} messages Messages about status
		 *
		 */

		authService.generateKey()
		  .then((response)=>{
			res.json(response)
		}).catch((err)=>{
			res.status(400).json(err)
		})
	}

}