const app = require('./app'); // App setup (connection to DB, etc.)
const PORT = process.env.RESOURCE_PORT || 5000;


// Set server to listen
app.listen(PORT, () => console.log(`Resource server running on port ${PORT}`));

app.use("/user", require('./routes/users'));
