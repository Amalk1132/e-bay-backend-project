const jwt=require("jsonwebtoken");


module.exports=function generate(id,username){
    const payload={
        userid:id,
        name:username
    }
    const secretkey=process.env.JWT_SECRET_KEY;
    
    const options={expiresIn:"12h"};
    
    return jwt.sign(payload,secretkey,options);
}



 
