'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/router/index.js');

// Prepare the express app
const app = express();

function start() {
  app.listen(PORT, () => {
    console.log(`Server Up on ${PORT}`);
  });
}
// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = { server: app, start };