const express = require('express');
// const html = require('../public/index.html');

const app = express();

// Built in middleware
app.use(express.json());

// App routes
app.get('/', (req, res, next) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stardew Valley API</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,500;1,200&display=swap" rel="stylesheet">
  </head>
  <body
    style="
      font-family: 'Nunito', sans-serif;
      display: flex;
      flex-direction: column;
    ">
    <header 
      style=
        "
        background-image: url('https://stardewvalley.net/wp-content/uploads/2017/12/med_logo.png');
        background-repeat: no-repeat;
        background-position: center;
        min-height: 250px;
        height: 20vh;
        width: 100vw;
        justify-content: center;
        ">
        </header>
    <h1>A RESTful API for information on Stardew Valley.</h1>
    <div>
      <h3>Character Routes</h3>
    </div>
  </body>
  </html>`)
});
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
