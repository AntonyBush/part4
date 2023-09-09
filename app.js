const config = require('./utils/config');
const logger = require('./utils/logger');
const express = require('express');
const app = express();
const cors = require('cors');
require('express-async-errors');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => logger.info('DB Running...'))
  .catch((error) => logger.error(error));

app.use(cors());
app.use(express.json());

app.use('/api/blogs', middleware.tokenExtractor, middleware.userExtractor ,blogsRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
