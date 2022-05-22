require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Authorization field in the HTTP request header
  const authorization = req.headers['authorization'];

  // No header
  if (!authorization) {
    return res.status(401).json({ message: "No token, unauthorized access."});
  }

  const token = authorization.split(' ')[1];

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token, unauthorized access."})
      }

      req.user = user;
      next();
    })
  } catch (err) {
    console.log("Authentication failed: " + err.message);
    return res.status(500).json({ message: "Server Error"});
  }
}

function generateAccessToken(user_id) {
  let payload = {user: { id: user_id } };
  return jwt.sign(payload, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: "1m"});
}

function generateRefreshToken(user_id) {
  let payload = {user: { id: user_id } };
  return jwt.sign(payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d"});
}

const sendAccessToken = (res, accessToken, statusCode) => {
  res.status(statusCode).json({ accessToken });
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