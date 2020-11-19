const express = require('express')
const bcrypt = require('bcryptjs')
const Users = require('./user-model')
const restrict = require('../middleware/restrict')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/users', restrict(), async(req, res, next)=>{
    try {
        res.json(await Users.find())
    } catch (error) {
        next(error)
    }
})

router.post('/register', async (req, res, next)=>{
    try {
        const {username, password, department} = req.body
        const user = await Users.findBy({username}).first()

        if(user){
            return res.status(409).json({
                message: "Username is already taken",
            })
        }
        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14),
            department,
        })
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
})

router.post('/login', async(req, res, next)=>{
    try {
        const {username, password} = req.body
        const user = await Users.findBy({username}).first()

        if(!user){
            return res.status(401).json({
                message: "You shall not pass!",
            })
        }
        const passwordValid = await bcrypt.compare(password, user.password)
        if(!passwordValid){
            return res.status(401).json({
                message: "You shall not pass!",
            })
        }
        const payload = {
            userId: user.id,
        }
        res.cookie('token', jwt.sign(payload, process.env.JWT_SECRET))
        res.json({
            message: `Welcome ${user.username}`,
        })
    } catch (error) {
        next(error)
    } 
})

router.get('/logout', async(req, res, next)=> {
    try {
        req.session.destroy((err)=>{
            if(err){
                next(err)
            }else{
                res.status(204).end()
            }
        })
    } catch (error) {
        next(error)
    }
})



module.exports = router