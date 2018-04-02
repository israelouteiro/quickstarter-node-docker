import express from 'express';

import DocsApi from './apidoc/api'
import UsersApi from './users/api' 
import OAuthApi from './oauth/api'   
import ForgotApi from './forgot/api'

const passport = require('passport'); 

let router = express.Router();

const docsApi = new DocsApi();
const usersApi = new UsersApi(); 
const authApi = new OAuthApi();     
const forgotApi = new ForgotApi();

router.get('/', docsApi.index); 
router.get("/hash", authApi.getKey );
router.post('/users', usersApi.store); 
router.post("/login", authApi.login );

router.post("/forgot", forgotApi.store );
router.post("/newpassword", forgotApi.validate );

/*
 *
 *	Authentication
 *
 *
 *
 */  

router.get('/logout', passport.authenticate('jwt', { session: false }), authApi.logout); 

/* Below we have authenticated routes */

router.get('/users', passport.authenticate('jwt', { session: false }), usersApi.index); 
router.put('/users', passport.authenticate('jwt', { session: false }), usersApi.update); 
router.delete('/users', passport.authenticate('jwt', { session: false }), usersApi.destroy); 

export default router;