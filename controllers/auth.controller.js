const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const authService = require('../services/auth.service')

exports.login = async (req, res) => {
  console.log("Login user", req.body);

  const username = req.body.username;
  const password = req.body.password;

  try {
    const result = await User.findOne({username:username}, {username:1, email:1, password:1, roles:1});
    console.log("User: ", result);
    const isMatch = await bcrypt.compare(password, result.password)

    // if (result && result.username === username && result.password === password) { // Χωρις κρυπτογραφηση
    // if (result && result.username === username && isMatch) { // Μονο οι κρυπτογραφημενοι κωδικοι
    if (result && result.username === username && result.password === password || isMatch) {    // Και οι κρυπτογραφημενοι κωδικοι και χωρις κρυπτογραφηση
      const token = authService.generateAccessToken(result);
      res.status(200).json({status:true, data:token})
    } else {
      res.status(404).json({status:false, data: "User not logged on"})
    }
  } catch (err) {
    console.log("Problem in logging", err);
    res.status(400).json({status:false, data:err})
  }
  
}

exports.googleLogin = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.status(400).json({status: false, data: "Authorization code is missing"})
  } else {
    let user = await authService.googleAuth(code); // 2
    if (user) {
      console.log(">>>", user);
      res.status(200).json({status:true, data: user});
    } else {
      res.status(400).json({status: false, data: "Problem in Google login"})
    }
  }
}