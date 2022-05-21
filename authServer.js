require('dotenv').config();
const app = require('./app'); // App setup (connection to DB, etc.)

const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { auth, 
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken 
} = require('./middleware/auth');

const User = require('./models/User');

app.use(cookieParser());

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
    sendAccessToken(res, accessToken);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message : err.message });
  }
})

// Logout a user
app.post('/logout', async (req, res) => {
  try {
    // Remove stored refresh token from database
    const user_id = auth(req);
    const user = await User.findById(user_id);
    user.token = '';
    await user.save();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // Clear cookies
  res.clearCookie('refreshtoken');
  res.send({ message: 'You have logged out.'})
})

// Get a new access token using refresh token
app.post('/refresh_token', async (req, res) => {
  const token = req.cookies.refreshtoken;

  try {
    // No refresh token, give empty access token
    if (!token) return res.json({ accessToken: '' });

    let payload = null;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.json({ accessToken: '' });
    }

    // Check if user exists, and that token match
    const user = await User.findById(payload.user_id);

    if (!user || user.token !== token) {
      return res.json({ accessToken: '' });
    }

    // Token exist, create new refresh and access tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Put refresh token in database
    user.token = refreshToken;
    await user.save();
    
    // Send tokens:
    // Access token as a regular response
    // Refresh token as a cookie
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message : err.message });
  }
})

// Deregister a user
app.delete('/deregister', async (req, res) => {
  try {
    const user_id = auth(req);
    const user = await User.deleteOne({ _id: user_id });
    res.status(200).json({ message: "User has been deleted"});
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message : err.message });
  }
})

// Testing a protected route
app.post('/protected', async (req, res) => {
  try {
    const user_id = auth(req);

    if (user_id === null) {
      return res.status(401).json({ 
        message: "You have to login to access this page."
      });
    }

    res.status(200).json({ data: "sample data"});
  } catch (err) {
    res.status(500).json({ message: err.message});
  }
})


