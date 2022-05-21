require("dotenv").config();
const app = require('./app'); // App setup (connection to DB, etc.)

const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');

const PORT = process.env.AUTH_PORT || 4000;

// Set server to listen
app.listen(PORT, () => console.log(`Authentication server running on port ${PORT}`));

// Register a user
app.post('/register', async (req, res) => {
  // Get user input from request body
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  try {
    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("Email and password input are required")
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("A user with that email account already exists");
    }

    // Hash the input password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in the database
    const user = await User.create({
      email: email,
      password: hashedPassword,
    })

    console.log(await User.find());

    res.status(201).json({ user_id : user._id});
  } catch (err) {
    res.status(500).send({ message: err.message});
  }
})

// Login a user
app.post('/login', async (req, res) => {
  // Get user input from request body
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  
  try {
    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("Email and password input are required")
    }

    // Validate if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // Check if password matches
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("Invalid email or password");
    }

    // User exists and password matches, create access/refresh token
    // Access token --> short lifetime
    // Refresh token --> long lifetime
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Put refresh token in database
    user.token = refreshToken;
    await user.save();

    // Send tokens:
    // Access token as a regular response
    // Refresh token as a cookie
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message : err.message });
  }
})

// Logout a user
app.post('/logout', async (req, res) => {
  res.clearCookie('refreshtoken');
  res.send({ message: 'Logged out.'})
})



function generateAccessToken(user_id) {
  console.log("Generating access token...")
  return jwt.sign({ user_id }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: "15m"});
}

function generateRefreshToken(user_id) {
  console.log("Generating refresh token...")
  return jwt.sign({ user_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d"});
}

const sendAccessToken = (req, res, accessToken) => {
  console.log("Sending access token...")
  res.json({
    accessToken,
    email: req.body.email.toLowerCase()
  })
}

const sendRefreshToken = (res, refreshToken) => {
  console.log("Sending refresh token...")
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    path: '/refresh_token'
  })
}