const express=require("express");
const router=express.Router();
const userControler=require("../Controller/Usercontroller");

router.post("/register",userControler.register);
router.post("/verify",userControler.verifyotp);
router.post("/login",userControler.login);
router.get("/logout",userControler.logout);
router.get("/getuser/:id",userControler.getuser);
router.get("/products",userControler.getproducts);
router.get("/products/:category",userControler.productbyCategory);
router.get("/product/:id",userControler.productById);
router.post("/addtocart/:id",userControler.addtocart);
router.get("/viewcart/:id",userControler.viewCart);
router.get("/cartcount/:id",userControler.getCartCount);
router.put("/updatecartquantity/:productId/:userId",userControler.updateQuantity);
router.delete("/deletecartitem/:productId/:userId",userControler.removeCart);
router.post("/address",userControler.updateAddress);
router.get("/getaddress/:id",userControler.getaddress);

module.exports=router;




