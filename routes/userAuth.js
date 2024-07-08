// const jwt =require("jsonwebtoken");

// const authenticationToken =(req,res,next)=>{
//     const authHeader =req.headers["authorization"];
//     const token =authHeader && authHeader.split(" ")[1];

//     if(token == null){
//         return res.send(401).json({message:"Authenication token required"})
//     }

//     jwt.verify(token,"book123",(err,user)=>{
//         if(err){
//           return res.status(403).json(err);
//         }
//         req.user=user;
//         next();
//     });
// };

// module.exports ={authenticationToken};


const jwt = require('jsonwebtoken');

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Authentication token requiredd" });
    }

    jwt.verify(token, "book123", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token", error: err });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticationToken };