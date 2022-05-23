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
const Profile = require('./models/Profile');

app.use(cookieParser());

const PORT = process.env.AUTH_PORT || 4000;

// Set server to listen
app.listen(PORT, () => console.log(`Authentication server running on port ${PORT}`));

// Register a user and create profile
app.post('/register', async (req, res) => {
  // Get user input from request body
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const name = req.body.name;

  try {
    // Validate user input
    if (!(email && password && name)) {
      return res.status(400).send('Email, password and name inputs are required')
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('A user with that email account already exists');
    }

    // Hash the input password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in the database
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    })

    // Create profile in the database
    const newProfile = await Profile.create({
      user: newUser,
      name
    })

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken, 201);
  } catch (err) {
    console.log('REGISTER USER FAILED: ' + err.message);
    res.status(500).json({ message: 'Internal Server Error'});
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
      return res.status(400).send('Email and password input are required');
    }

    // Validate if user exists
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(400).send('Invalid email or password');
    }

    // Check if password matches
    if (!(await bcrypt.compare(password, currentUser.password))) {
      return res.status(400).send('Invalid email or password');
    }

    // User exists and password matches, create access/refresh token
    // Access token --> short lifetime
    // Refresh token --> long lifetime
    const accessToken = generateAccessToken(currentUser.id);
    const refreshToken = generateRefreshToken(currentUser.id);

    // Send tokens:
    // Access token as a regular response
    // Refresh token as a cookie
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken, 200);

  } catch (err) {
    console.log('LOGIN USER FAILED: ' + err.message);
    res.status(500).json({ message : 'Internal Server Error' });
  }
})

// Logout a user
app.post('/logout', auth, async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie('refreshtoken');
    return res.status(200).json({ message: 'You have logged out.'})
  } catch (err) {
    console.log('LOGOUT USER FAILED: ' + err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
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
    const user = await User.findById(payload.user.id);

    if (!user) {
      return res.json({ accessToken: '' });
    }

    // Token exist, create new refresh and access tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Send tokens:
    // Access token as a regular response
    // Refresh token as a cookie
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken, 200);

  } catch (err) {
    console.log('TOKEN REFRESHING FAILED: ' + err.message);
    res.status(500).json({ message : 'Internal Server Error' });
  }
})

// Deregister a user and delete profile
app.delete('/deregister', auth, async (req, res) => {
  try {
    await User.deleteOne({ id: req.user.id });
    await Profile.deleteOne({ user: req.user.id });
    res.status(200).json({ message: 'User has been deleted'});
  } catch (err) {
    console.log('DEREGISTERING USER FAILED: ' + err.message);
    res.status(500).json({ message : 'Internal Server Error' });
  }
})

// Testing a protected route
app.post('/protected', auth, async (req, res) => {
  try {
    if (req.user.id === null) {
      return res.status(401).json({ 
        message: 'You have to login to access this page.'
      });
    }

    res.status(200).json({ data: 'sample data'});
  } catch (err) {
    res.status(500).json({ message: err.message});
  }
})


