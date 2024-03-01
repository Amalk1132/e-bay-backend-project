const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require:true,
 
  },
  email: {
    type: String,
    require:true,
    
  },
  password: {
    type: String,
    require:true,
  
  },
  address: {type:Object },
  cart: Array,
  whishlist: Array,
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
});

/////////////////////PASSWORD//////////////////

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const user = mongoose.model("users", userSchema);

module.exports = user;
