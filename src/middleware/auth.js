const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async(req, res, next) => {

    try{
        const { token } = req.cookies;
        if(!token){
            throw new Error("Token is not valid!!!!!!!!!!!!");
        }
    
        const decodedData = await jwt.verify(token, "tin@dev1110");
    
        const { _id } = decodedData;
        
        const user = await User.findById( _id );
        if(!user){
            throw new Error("User not found???????");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("" + err);
    }

}

module.exports= {
    userAuth,
}