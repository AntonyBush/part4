const config = require('./utils/config');
const logger = require('./utils/logger');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => logger.info('DB Running...'))
  .catch((error) => logger.error(error));

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;