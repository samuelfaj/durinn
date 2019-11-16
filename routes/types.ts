import Router from "./base/router";
import {Request, Response, NextFunction} from "express";

const base = Router;
const fs = require("fs");

base.get('/types', async function(req: Request, res: Response, next: NextFunction) {
	res.contentType('text/plain').send(fs.readFileSync(__dirname + '/../assets/types.txt').toString());
});

export default base;
