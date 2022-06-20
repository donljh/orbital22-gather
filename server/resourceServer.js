const app = require('./app'); // App setup (connection to DB, etc.)
const PORT = process.env.RESOURCE_PORT || 5000;


// Set server to listen
app.listen(PORT, () => console.log(`Resource server running on port ${PORT}`));

app.use("/user", require('./routes/users'));
app.use("/profile", require('./routes/profiles'));
app.use("/task", require('./routes/tasks'));
app.use("/event", require('./routes/events'));
app.use("/group", require('./routes/groups'));
app.use("/invitation", require('./routes/invitations'));