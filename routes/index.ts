import Router from "./base/router";
import {Request, Response, NextFunction} from "express";
import User from "../models/user";
import Admin from "../models/admin";

const base = new Router();

base.get('/', function(req: Request, res: Response, next: NextFunction) {
    res.json(base.response.success())
});

base.user_authenticated.get('/', function(req: Request, res: Response, next: NextFunction, user: User) {
    res.json(base.response.success(user))
});

base.admin_authenticated.get('/', function(req: Request, res: Response, next: NextFunction, admin: Admin) {
    res.json(base.response.success(admin))
});

export default base.router;
