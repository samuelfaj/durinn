import Router from "./base/router";
import {Request, Response, NextFunction} from "express";

const base = Router;

base.get('/', async function(req: Request, res: Response, next: NextFunction) {
    base.response.success("t");
});

base.get('/login', base.authenticated, function(req: Request, res: Response, next: NextFunction) {
    // req.app.get('user')
    // res.locals.user;
    base.response.success(res.locals.user, 'Durinn framework');
});

export default base;
