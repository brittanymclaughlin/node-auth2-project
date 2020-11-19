const Users = require("../users/user-model")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

function restrict(){
    const authError={
        message: "You shall not pass"
    }
    return async (req, res, next) =>{
        try {
            // const {username, password} = req.headers
            // if(!username || !password){
            //     return res.status(401).json(authError)
            // }
            // const user = await Users.findBy({username}).first()
            // if(!user){
            //     return res.status(401).json(authError)
            // }

            // const passwordValid = await bcrypt.compare(password, user.passwor)
            // if(!passwordValid){
            //     return res.status(401).json(authError)
            // }

           const token = req.cookies.token
           if(!token){
            return res.status(401).json(authError)
           }
           jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
             if(err){
                return res.status(401).json(authError)
             }  
             next()
           })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = restrict;