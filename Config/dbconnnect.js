const mongoose=require("mongoose");

const dbconnect=()=>{
    mongoose.connect(process.env.DB_URI)
        .then(()=>console.log("successful"))
        .catch((err)=>console.log(err))
}

module.exports=dbconnect;

