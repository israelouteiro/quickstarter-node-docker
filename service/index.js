require("babel-polyfill");

import http from 'http';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import SocketIO from 'socket.io';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import router from './src/router';

import _ from "lodash";  
import jwt from 'jsonwebtoken';

import passport from "passport";
import passportJWT from "passport-jwt";

import UserModel from './src/users/model';
import AuthModel from './src/oauth/model';

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

require('dotenv').config()

let app = express();
app.server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));





///////////////////
// Auth Strategy //
///////////////////

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = process.env.API_SECRET;
jwtOptions.passReqToCallback = true;
 
const strategy = new JwtStrategy( jwtOptions , (req, jwt_payload, next) => { 
    let ctoken = ((req.headers.authorization.split(' '))[1])
    AuthModel.find({
      user_id: jwt_payload.id,
      token: ctoken,
      is_valid: true
    }, (err, htoken) => { 
      if (err) { return next(err); }
      if (!htoken.length) { return next(null, false); } 
      UserModel.find(
        { _id : jwt_payload.id }
        , (err, user) => {
          // console.log(user)
        if (err) { return next(err); }
        if (!user.length) { return next(null, false); }
        user = user.shift()
        return next(null, user);
      });
    });
  //
});

passport.use(strategy);

// End Strategy ///





app.use(morgan('dev'));
app.use(express.static('src/apidoc'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(methodOverride());

app.use('/',router);

app.server.listen(process.env.PORT || 3000, () => {
    console.log(`Started on port ${app.server.address().port}`);
});

