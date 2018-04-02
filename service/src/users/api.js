import userModel from './model';
import UsersService from './service';

const userService = new UsersService();

export default class UsersApi { 
	
	index(req, res) {
		/**
		 * @api {get} /users Get current logged User
		 * @apiName ReadUser
		 * @apiGroup User
		 * @apiVersion 1.0.0
		 *
		 * @apiHeader {String} authorization `JWT {{ ACCESS_TOKEN }}`.
		 *
		 * @apiSuccess {String} status Status of request ( Success )
		 * @apiSuccess {String} message A message about status
		 * @apiSuccess {Object} user User registered object
		 * @apiSuccess {String} user.name User register Name
		 * @apiSuccess {String} user.cpf User register CPF
		 * @apiSuccess {String} user.phone User register Phone
		 * @apiSuccess {String} user.email User register Email 
		 *
		 * @apiError {String} status Status of request ( Error )
		 * @apiError {String} messages Messages about status
		 *
		 */
		 userService.read(req)
			.then( response => {
				res.send(response) 
			}).catch( err => {
				res.status(400).send(err)
			})
	}    

	store(req, res){
		/**
		 * @api {post} /users Create new user
		 * @apiName CreateUser
		 * @apiGroup User
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {String} name Name of User
		 * @apiParam {String} cpf CPF of User.
		 * @apiParam {String} email Email of User.
		 * @apiParam {String} phone Phone of User.
		 * @apiParam {String} [password] Password of User.
		 *
		 * @apiSuccess {String} status Status of request ( Success )
		 * @apiSuccess {String} message A message about status
		 * @apiSuccess {Object} user User registered object
		 * @apiSuccess {String} user.name User register Name
		 * @apiSuccess {String} user.cpf User register CPF
		 * @apiSuccess {String} user.phone User register Phone
		 * @apiSuccess {String} user.email User register Email
		 * @apiSuccess {String} token User OAuth token
		 *
		 * @apiError {String} status Status of request ( Error )
		 * @apiError {String} messages Messages about status
		 *
		 */

		userService.save(req)
			.then( response => {
				res.send(response) 
			}).catch( err => {
				res.status(400).send(err)
			})
	}

	update(req, res) {
		/**
		 * @api {put} /users Update user
		 * @apiName UpdateUser
		 * @apiGroup User
		 * @apiVersion 1.0.0
		 *
		 * @apiHeader {String} authorization `JWT {{ ACCESS_TOKEN }}`.
		 *
		 * @apiParam {String} [name] Name of User
		 * @apiParam {String} [cpf] CPF of User.
		 * @apiParam {String} [email] Email of User.
		 * @apiParam {String} [phone] Phone of User. 
		 *
		 * @apiSuccess {String} status Status of request ( Success )
		 * @apiSuccess {String} message A message about status
		 * @apiSuccess {Object} user User registered object
		 * @apiSuccess {String} user.name User register Name
		 * @apiSuccess {String} user.cpf User register CPF
		 * @apiSuccess {String} user.phone User register Phone
		 * @apiSuccess {String} user.email User register Email
		 *
		 * @apiError {String} status Status of request ( Error )
		 * @apiError {String} messages Messages about status
		 *
		 */
		 userService.update(req)
			.then( response => {
				res.send(response) 
			}).catch( err => {
				res.status(400).send(err)
			})
	}  

	destroy(req, res) {
		/**
		 * @api {delete} /users Delete user
		 * @apiName DeleteUser
		 * @apiGroup User
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
		userService.delete(req)
			.then( response => {
				res.send(response) 
			}).catch( err => {
				res.status(400).send(err)
			})
	}  
}