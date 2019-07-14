import serverless = require('serverless-http');
import express, { NextFunction, Request, Response } from "express";

// routes
import base from "./routes/base/router";
import index from "./routes/index";

// app
const app = express();

app.use('/', index);

// Error-Handling Middleware
app.use(function (error: Error, req: Request, res: Response, next: NextFunction) {
	res.json(base.response.error(500, error.message, error.stack));
});

module.exports.handler = serverless(app);
