const express=require("express");
const router=express.Router();
const adminControl=require("../Controller/Admincontroller");
const upload=require("../utils/multer");
const {adminAuth}=require("../Middleware/Adminauth");


router.post("/adminlogin",adminControl.adminlogin);
router.delete("/logout",adminControl.logout);
router.get("/users",adminAuth,adminControl.allUsers);
router.get("/user/:id",adminAuth,adminControl.userById);
router.get("/products",adminAuth,adminControl.allProducts);
router.get("/product/:id",adminAuth,adminControl.productById);
router.get("/product/:category",adminAuth,adminControl.productByCategory);
router.post("/addproduct",adminAuth,upload.single("image"),adminControl.addproduct);
router.put("/product/:id",adminAuth,adminControl.updateproduct);
router.delete("/product/:id",adminAuth,adminControl.deleteproduct);

module.exports=router;





