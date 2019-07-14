import Router from "./base/router";
import {Request, Response, NextFunction} from "express";
import User from "../models/user";

const base = new Router();

base.get('/', function(req: Request, res: Response, next: NextFunction) {
    res.json(base.response.success())
});

base.authenticated.get('/', function(req: Request, res: Response, next: NextFunction, user: User) {
    res.json(base.response.success(user))
});

export default base.router;
