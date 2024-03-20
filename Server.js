const express=require("express");
const app= express();
const cors=require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config/config.env" });

const cookieparser=require("cookie-parser");
const userRouter=require("./Routes/Userroute");
const adminRouter=require("./Routes/Adminroute");



app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cookieparser());



app.use(cors({
    origin:" http://localhost:3000",
    credentials:true,
}))


app.use("/user",userRouter);
app.use("/admin",adminRouter);
     


const dbconnect = require("./Config/dbconnnect");
dbconnect();

app.listen(process.env.PORT,(err)=>{

    if(err){
        console.log(err);
    }else{
        console.log("succesfulled");
    }
});