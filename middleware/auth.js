require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req) => {
  // Authorization field in the HTTP request header
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return null;
  }
  const token = authorization.split(' ')[1];
  const { user_id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  return user_id;
}

function generateAccessToken(user_id) {
  return jwt.sign({ user_id }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: "15m"});
}

function generateRefreshToken(user_id) {
  return jwt.sign({ user_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d"});
}

const sendAccessToken = (res, accessToken) => {
  res.json({
    accessToken
  })
}

const sendRefreshToken = (res, refreshToken) => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    path: '/refresh_token'
  })
}

module.exports = { 
  auth, 
  generateAccessToken, 
  generateRefreshToken, 
  sendAccessToken,
  sendRefreshToken
};