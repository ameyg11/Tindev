const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAdmin = token === "xyza";

    if(!isAdmin){
        res.status(401).send("You are not authorized")
    }else{
        next();
    }
};

module.exports= {
    adminAuth,
}