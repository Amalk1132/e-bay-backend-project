const userModel = require("../Schemas/users");
const productModel = require("../Schemas/Product");
const cloudinary = require("../utils/cloudinary");
const Createtoken = require("../Helper/Createtoken");

//////////////--ADMIN LOGIN--/////////////////
const adminlogin = async (req, res) => {
  const user = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  };

  const token = Createtoken(user.username, user.password);
  console.log(token);
  res.cookie("adminjwt", token);
  res.status(200).send("success");
};

///////////----ADMIN LOGOUT----////////////
const logout = async (req, res) => {
  res.cookie("adminjwt", " ");
  res.status(200).send("successfully logout");
};

/////////--GET ALL USERS--//////////
const allUsers = async (req, res) => {
  const users = await userModel.find();
  if (users) {
    res.status(200).send(users);
  }
};

/////////--GET USER BY ID--/////////
const userById = async (req, res) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);
  if (user) {
    res.status(200).send(user);
  }
};
/////////--GET PRODUCTS--//////////////
const allProducts = async (req, res) => {
  const products = await productModel.find();
  if (products) {
    res.status(200).send(products);
  }
};

/////////--GET PRODUCT BY ID--//////////////
const productById = async (req, res) => {
  const prodId = req.params.id;
  const product = await productModel.findById(prodId);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send("product not found");
  }
};

/////////-- PRODUCT CATEGORY--//////////////
const productByCategory = async (req, res) => {
  const category = req.params.category;
  const products = await productModel.find({ category: category });
  if(products){
    res.status(200).send(products)
  }else{
    res.status(404).send("product not found")
  }
};

///////////--ADD PRODUCT--//////////////
const addproduct = async (req, res) => {
 
 console.log(req.body);
//   const existProduct = await productModel.findOne({ Title: Title });
//   if (existProduct) {
//     res.status(409).send("product is already exist");
//   } else {
//     const result = await cloudinary.uploader.upload(Image);
//     const addded = await productModel.create({
//       Title: Title,
//       Description: Decription,
//       Price: Price,
//       Category: Category,
//       Image: result.url,
//     });
//     res.status(201).json({
//       status: "success",
//       message: "successfully created a product",
//       data: addded,
//     });
//   }
};

///////////--UPDATE PRODUCT--//////////////
const updateproduct = async (req, res) => {
  const prodId = req.params.id;
  try {
    const { Title, Description, Price, Category, Image } = req.body;
    const result = await cloudinary.uploader.upload(Image);
    console.log(result);
    await productModel.findByIdAndUpdate(prodId, {
      $set: {
        Title,
        Description,
        Price,
        Category,
        Image: result.url,
      },
    });
    res.status(200).send("product updated");
  } catch (err) {
    console.log(err);
  }
};

///////////--DELETE PRODUCT--//////////////
const deleteproduct = async (req, res) => {
  const prodId = req.params.id;
  const product = await productModel.findByIdAndDelete(prodId);
  if (!product) {
    res.status(404).send("product not found");
  } else {
    res.status(200).send("product deleated");
  }
};
module.exports = {
  adminlogin,
  logout,
  allUsers,
  userById,
  allProducts,
  productById,
  productByCategory,
  addproduct,
  updateproduct,
  deleteproduct,
};
