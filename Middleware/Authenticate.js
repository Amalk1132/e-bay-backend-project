const authToken=(req,res,next)=>{
    const token=req.cookies;
    console.log(token);
    if(!token){
        res.status(401).send("unautherized")
    }else{
        next()
    }
}


module.exports={authToken}


