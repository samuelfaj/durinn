import serverless = require('serverless-http');
import express, { NextFunction, Request, Response } from "express";

// Run associations
import associations from "./associations";
associations();

// app and middlewares
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const cors = require('cors');
app.use(cors());

// routes
import base from "./routes/base/router";
import index from "./routes/index";

app.use('/', index);

// Error-Handling Middleware
app.use(function (error: Error, req: Request, res: Response, next: NextFunction) {
	res.json(base.response.error(500, error.message, error.stack));
});

module.exports.handler = serverless(app);
