const express=require("express");
const router=express.Router();
const userControler=require("../Controller/Usercontroller");

router.post("/register",userControler.register);
router.post("/verify",userControler.verifyotp);
router.post("/login",userControler.login);
router.get("/logout",userControler.logout);
router.get("/getuser",userControler.getuser);
router.get("/products",userControler.getproducts);
router.get("/products/:category",userControler.productbyCategory);
router.get("/product/:id",userControler.productById);
router.post("/addtocart/:userid/:prodid",userControler.addtocart);
router.get("/viewcart/:id",userControler.viewCart);
router.get("/cartcount/:userId",userControler.getCartCount);
router.put("/updatecartquantity/:productId/:userId",userControler.updateQuantity);
router.delete("/deletecartitem/:productId/:userId",userControler.removeCart);
router.post("/addWishlist/:userId/:productId",userControler.addWishlist);
router.get("/viewwishlist/:userId",userControler.viewWishlist);
router.delete("/removewishlist/:productId/:userId",userControler.removeWishlist);
router.post("/address",userControler.updateAddress);
router.get("/getaddress/:id",userControler.getaddress);

module.exports=router;




