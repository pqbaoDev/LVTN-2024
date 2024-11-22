const jwt =require("jsonwebtoken");
const User = require("../app/models/UserSchema.js");
const EmployeeModel = require("../app/models/employeeSchema.js");

const authenticate = async (req, res, next)=>{
    const authToken = req.headers.authorization;

    if(!authToken){
        return res.status(401).json({success:false, messega:"No token, authorization denied"});
    }
    try {
        const token = authToken.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) ;

        req.userId =decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({messega:"Token is expired"});
        }
        return res.status(401).json({ success:false,messega:"Invalid token"});     
    }
};

const restrict = roles=> async (req, res, next)=>{
    const userId = req.userId;
    
    let user;

    const users = await User.findById(userId);
    const employee = await EmployeeModel.findById(userId);
    // const admin = await Admin.findById(userId);
   

    if(users){
        user = users;
    }
    if(employee){
        user = employee;
    }
    // if(admin){
    //     user = admin;
    // }
    if(!roles.includes(user.role)){
        return res.status(401).json({success: false, message:"You're not authorized"});
    }
    next();

};
module.exports={authenticate,restrict}
