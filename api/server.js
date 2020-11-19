const express = require('express');
const helmet = require('helmet');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const KnexSessionStore = require('connect-session-knex')(session)
const db = require("../data/db-config")

const UserRouter = require('../users/user-router')


const server = express();

server.use(helmet());
server.use(express.json());
server.use(cookieParser());
// server.use(session({
//     resave: false,
//     saveUninitialized: false,
//     secret: "keep it secret, keep it safe",
//     store: new KnexSessionStore({
//         knex:db,
//         createtable: true,
//     }),
// }))
//server api
server.use('/api', UserRouter);

server.use((err, req, res, next)=>{
    console.log(err)
    res.status(500).json({
      message: 'Oops something went wrong',
    })
  })

module.exports = server;