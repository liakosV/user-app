const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')

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
  

  try {
    const payload = jwt.verify(token, secret)
    console.log("DECODED", payload)
    return {verified:true, data:payload};
  } catch (error) {
    return {verified:false, data: error.message}
  }
}

async function googleAuth(code) {  //3
  console.log("Google Login", code);
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const REDIRECT = process.env.REDIRECT_URI;

  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT)

  try {
    // Exchange code for tokens
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID
    })

    const userInfo = await ticket.getPayload();
    console.log("Google User", userInfo)

    // return{user: userInfo, tokens}
    const user = {
      username: userInfo.given_name,
      email: userInfo.email,
      roles: ['EDITOR', 'READER']
    }
    const token = this.generateAccessToken(user);
    return token;
  } catch (error) {
    console.log("Error in google authentication", error)
    return {error: "Failed to authenticate with google"}
  }
}

module.exports = {generateAccessToken, verifyAccessToken, googleAuth}