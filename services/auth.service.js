const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
  console.log("Auth Service", user)
  const payload = {
    username: user.username,
    email: user.email,
    roles: user.roles
  }

  const secret = process.env.TOKEN_SECRET;
  const options = {expiresIn: '1h'};

  return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {
  const secret = process.env.TOKEN_SECRET;
  const payload = jwt.verify(token, secret)

  try {
    console.log("DECODED", payload)
    return {verified:true, data:payload};
  } catch (error) {
    return {verified:false, data: error.message}
  }
}

module.exports = {generateAccessToken, verifyAccessToken}