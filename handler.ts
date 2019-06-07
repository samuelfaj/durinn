import serverless = require('serverless-http');
import express from "express";

// routes
import index from "./routes/index";

const app = express()
  .use('/', index);

module.exports.handler = serverless(app);