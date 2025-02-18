const userModel = require("../models/usermodels");
const userService = require("../services/user.service.js");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);

  const { fullname, email, password } = req.body;
  const isUserAlreadyExist = await userModel.findOne({ email });
  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "User already exist" });
  }
  
  try {
    const hashedPassword = await userModel.hashpassword(password);

    // Pass fullname correctly
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });

    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
 const {email,password} =req.body;

 const  user = await userModel.findOne({email}).select('+password');
 if (!user) {
  return res.status(401).json({message : 'Invalid email or password'});

}
const isMatch = await user.comparePassword(password);
if (!isMatch) {
  return res.status(401).json({message : 'Invalid email or password'});
} 
const token =user.generateAuthToken();
return res.status(201).json({user,token});
}

module.exports.logoutUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const blacklisttoken = new blacklisttokenModel({ token });
  await blacklisttoken.save();
  res.status(200).json({ message: "User logged out successfully" });
};
module.exports.getProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
  
}