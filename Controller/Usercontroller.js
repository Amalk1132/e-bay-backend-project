const userModel = require("../Schemas/users");
const productModel = require("../Schemas/Product");
const bcrypt = require("bcrypt");
const Createtoken = require("../Helper/Createtoken");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifysid = process.env.TWILIO_VERIFY_SID;
const client = require("twilio")(accountSid, authToken);
const jwt = require("jsonwebtoken");

/////////////-----USER REGISTRATION---///////////
const register = async (req, res) => {
  const phone = req.body.phone;
  const user = req.body;
  console.log(req.body);

  const userExist = await userModel.findOne({ email: user.email });
  if (!userExist) {
    client.verify.v2
      .services(verifysid)
      .verifications.create({ to: `+91${phone}`, channel: "sms" })
      .then((verification) => {
        if (verification.status === "pending") {
          res.status(200).send("success");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("verification falied");
      });
  } else {
    res.status(500).send("User is Already exist");
  }
};

///////////////VERIFY OTP//////////////////

const verifyotp = async (req, res) => {
  const user = req.body.formValues;
  const otp = req.body.Otp;
  const phone = req.body.formValues.phone;
  console.log(req.body);

  client.verify.v2
    .services(verifysid)
    .verificationChecks.create({ to: `+91${phone}`, code: Number(otp) })
    .then(async (verification_check) => {
      console.log(verification_check.status);

      if (verification_check.status === "approved") {
        const newUser = await userModel.create(user);

        const token = Createtoken(newUser.email);
        res.cookie("userjwt", token);
        res
          .status(200)
          .json({ status: "success", userdetails: newUser, token });
      } else {
        res.status(500).send("failed");
      }
    });
};

////////////////USER LOGIN/////////////////
const login = async (req, res) => {
  const { email, password } = req.body;

  const userExist = await userModel.findOne({ email: email });

  if (userExist) {
    console.log("hello get ");

    const auth = await bcrypt.compare(password, userExist.password);
    if (auth) {
      const token = Createtoken(userExist._id, userExist.username);

      res.cookie("userjwt", token);
      console.log("hello get user");
      res.status(200).json({
        user: userExist,
        status: true,
        token: token,
      });
    } else {
      res.status(404).send("incorrect username or password");
    }
  }
};

//////////---USER LOGOUT//////////////////
const logout = async (req, res) => {
  res.clearCookie("userjwt");
  res.status(200).json({
    success: true,
    message: "logout successfully",
  });
};

//////////////---GET USER---///////////////
const getuser = async (req, res) => {
  const decodeToken = jwt.decode(req.cookies.userjwt);
  if (decodeToken) {
    console.log(decodeToken);
    const user = await userModel.findById(decodeToken.userid);
    res.status(200).send(user);
  } else {
    res.status(404).send("error");
    console.log("error");
  }
};

/////////----USER ADDRESS---///////////////
const getaddress = async (req, res) => {
  const userId = req.params.userId;
  const user = await userModel.findById(userId);
  const address = user.address;
  if (address) {
    res.send(address);
  } else {
    res.status(404).send("not found");
  }
};

/////////---UPDATE ADDRESS---//////////////
const updateAddress = async (req, res) => {
  const address = req.body.values;
  const userId = req.body.user.userId;
  const uAddress = await userModel.findByIdAndUpdate(
    { _id: userId },
    { $set: { address: address } }
  );
  if (uAddress) {
    res.status(200).send("success");
  } else {
    res.status(500).send("failed");
  }
};

/////////---GET ALL PRODUCTS---////////////
const getproducts = async (req, res) => {
  const products = await productModel.find();
  if (products) {
    res.status(200).send(products);
  }
};
////////--PRODUCT BY ID----////////////
const productById = async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findById(id);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send("not found");
  }
};

////////////----ADD TO CART ---////////////
const addtocart = async (req, res) => {
  const { userid, prodid } = req.params;

  const user = await userModel.findById(userid);
  const product = await productModel.findById(prodid);
  if (!user) {
    res.status(400).send(" user not found");
    return;
  }

  if (!product) {
    res.status(400).send("product  not found");
    return;
  }

  const isExist = await user.cart.find((item) => item._id == prodid);
  console.log(isExist);

  if (!isExist) {
    const uUser = await userModel.findByIdAndUpdate(userid, {
      $push: { cart: product },
    });
    await uUser.save();
    res.status(200).send("successfully added");
  } else {
    res.status(409).send("already added");
  }
};

//////////////---VIEW CART---//////////////////

const viewCart = async (req, res) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);
  if (user) {
    res.status(200).send(user.cart);
  }
};

//////////////---GET CART COUNT---//////////////////

const getCartCount = async (req, res) => {
  const userId = req.params.userId;

  const user = await userModel.findById(userId);
  if (user) {
    const cartCount = user.cart.length;
    res.send({ data: cartCount, user: user });
  }
};

//////////---UPDATE CART QTY---///////////////
const updateQuantity = async (req, res) => {
  const quantity = req.body.qty;
  console.log(quantity);
  const productId = req.params.productId;

  const userId = req.params.userId;

  const user = await userModel.findById(userId);

  if (user) {
    const updatedCart = user.cart.map((item) => {
      console.log(item._id);
      console.log(productId);
      if (item._id == productId) {
        console.log("hello");
        return { ...item, qty: quantity };
      }
      return item;
    });
    console.log(updatedCart);
    const Uuser = await userModel.findByIdAndUpdate(userId, {
      $set: { cart: updatedCart },
    });
    res.status(200).send(Uuser.cart);
  }
};

////////---DELEATE ITEM FROM CART---/////////////
const removeCart = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  const userCheck = await userModel.findOne({ _id: userId });
  const userCart = userCheck.cart;
  console.log(userCart);

  if (!userCheck) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  const updatedCart = userCart.filter((ele) => ele._id != productId);

  userCheck.cart = updatedCart;

  await userCheck.save();

  res
    .status(200)
    .json({ message: "item removed from cart succcess", userCart });
};

///////////---ADD TO WISHLIST---//////////////////
const addWishlist = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  const productId = req.params.productId;
  console.log(productId);

  const user = await userModel.findById(userId);
  const product = await productModel.findById(productId);
  if (!user || !product) {
    return res.status(400).json({
      success: false,
      message: "user or product not found",
    });
  }

  const checkprod = user.whishlist.find((item) => item._id == productId);

  if (checkprod) {
    const newwishlist = user.whishlist.filter((item) => item._id != productId);
    console.log(newwishlist);
    await userModel.updateOne(
      { _id: userId },
      { $set: { whishlist: newwishlist } }
    );
    return res.status(404).json({
      success: false,

      message: "Product removed from wishlist",
    });
  } else {
    await userModel.updateOne(
      { _id: userId },
      { $push: { whishlist: product } }
    );
    return res.status(200).json({
      success: true,

      message: "Product successfully added to wishlist",
    });
  }
};

//////////---VIEW PRODUCT IN WISHLIST---/////////
const viewWishlist = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  res.status(200).send(user.whishlist);
};

//////////----REMOVE FROM WISHLIST----//////////
const removeWishlist = async (req, res) => {
  const userId = req.params.userId;
  // console.log(userId)
  const productId = req.params.productId;
  // console.log(productId)

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  const iswishlist = user.whishlist.find((item) => item._id == productId);
  if (iswishlist) {
    const updatedwishlist = user.whishlist.filter(
      (ele) => ele._id != productId
    );

    user.whishlist = updatedwishlist;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "item removed from wishlist succcess" });
  }
};

/////////////---PRODUCT BY CATEGORY---/////////
const productbyCategory = async (req, res) => {
  const category = req.params.category;
  const products = await productModel.find({ category: category });
  res.status(200).send(products);
};

module.exports = {
  register,
  verifyotp,
  login,
  logout,
  getuser,
  getaddress,
  updateAddress,
  getproducts,
  productById,
  addtocart,
  viewCart,
  getCartCount,
  updateQuantity,
  removeCart,
  addWishlist,
  viewWishlist,
  removeWishlist,
  productbyCategory,
};
