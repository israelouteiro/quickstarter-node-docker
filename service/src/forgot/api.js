import ForgotService from './service';

const forgotService = new ForgotService();

export default class ForgotApi {    

	store(req, res){
		/**
		 * @api { post } /forgot Start forgot process
		 * @apiName callForgot
		 * @apiGroup Forgot
		 * @apiVersion 1.0.0 
		 *
		 * @apiParam {String} email Email of user
		 *
		 * @apiSuccess {String} status Status of request ( Success )
		 * @apiSuccess {String} message A message about status
		 *
		 * @apiError {String} status Status of request ( Error )
		 * @apiError {String} messages Messages about status
		 *
		 */

		forgotService.save(req)
			.then( response => {
				res.send(response) 
			}).catch( err => {
				res.status(400).send(err)
			})
	}

	validate(req, res) {
		/**
		 * @api { post } /newpassword Create a new password
		 * @apiName newPassword
		 * @apiGroup Forgot
		 * @apiVersion 1.0.0 
		 *   
		 * @apiParam {String} cpf Email of Received
		 * @apiParam {String} token Token Received
		 * @apiParam {String} password User new password
		 * 
		 * @apiSuccess {String} status Status of request ( Success )
		 * @apiSuccess {String} message A message about status 
		 *
		 * @apiError {String} status Status of request ( Error )
		 * @apiError {String} messages Messages about status
		 *
		 */
		forgotService.validateAndRemove(req)
			.then( response => {
				res.send(response) 
			}).catch( err => {
				res.status(400).send(err)
			})
	}  
}