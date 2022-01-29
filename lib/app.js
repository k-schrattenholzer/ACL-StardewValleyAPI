const express = require('express');
const path = require('path');
const cors = require('cors')

const app = express();

// Built in middleware
app.use(express.json());
app.use(cors())

// App routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/characters', require('./controllers/characters.js'));
app.use('/api/v1/seeds', require('./controllers/seeds.js'));
app.use('/api/v1/artifacts', require('./controllers/artifacts.js'));
app.use('/api/v1/forageables', require('./controllers/forageables.js'));
app.use('/api/v1/weapons', require('./controllers/weapons.js'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
