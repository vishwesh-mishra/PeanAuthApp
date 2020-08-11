const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const users = require('./routes/users');
const passport = require('passport');
const config = require('./configurations/config');

const app = express();
const port = 3000;

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// CORS Middleware
app.use(cors());
// Body Parser Middleware
app.use(bodyParser.json());
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./configurations/passport')(passport);
// Index Route
app.get('/', (req, res) => {
    res.send('App get running')
});

// Invoking all routes
app.use('/users', users);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});