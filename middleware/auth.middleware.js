const jwt = require('jsonwebtoken')
const authService = require('../services/auth.service')

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // console.log("REQ>>>", req)
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({status:false, message:"Access denied. No token provided"})
  }

  const result = authService.verifyAccessToken(token);

  if (!result.verified) {
    return res.status(403).json({status:false, data: result.data})
  }

  req.user = result.data
  // console.log("REQ2>>>", req)
  next()
}

function verifyRoles(allowedRole) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({status:false, data: "Forbidden no roles found"})
    }

    const userRoles = req.user.roles
    const hasPermision = userRoles.includes(allowedRole)

    if (!hasPermision) {
      return res.status(403).json({status:false, data: "Forbidden: insufficient permisions"})
    }
    next()
  }
}

module.exports = {verifyToken, verifyRoles};