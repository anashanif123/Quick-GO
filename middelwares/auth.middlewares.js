const userModel = require("../models/usermodels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklisttoken = require("../models/blacklisttoken.model.js");
const blacklisttokenModel = require("../models/blacklisttoken.model.js");
module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }
  const isblacklisted = await blacklisttokenModel.findOne({ token: token });
    if (isblacklisted) {
        return res.status(401).json({ message: "Unauthorized" });
    } 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id);

    req.user = user;
    
    return next();
  } catch (error) {
    console.log("Error verifying token:", error);
    res.status(500).json({ message: "UNAUTHORIZED" });
  }
};
