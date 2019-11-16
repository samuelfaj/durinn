import Router, { RequestFilter } from "./base/router";
import User from "../models/user";
import SQL_Restful from "./base/restful.sql";
import { NextFunction, Request, Response } from "express";
import base from "./base/router";

/**
 * Restful class creates
 * ---------------------------------------
 * GET - http://localhost:3000/user/search
 * POST - http://localhost:3000/user
 * ---------------------------------------
 * GET - http://localhost:3000/user/1
 * PUT - http://localhost:3000/user/1
 * DELETE - http://localhost:3000/user/1
 * ---------------------------------------
 */

class UserRestful extends SQL_Restful{
	constructor(){
		super(Router, User);
		this.router.use(`/${this.endpoint}/`, this.custom);
	}

	// Example of creating a custom method.
	async custom(req: Request, res: Response, next: NextFunction){
		console.log('An example of custom function')
		next();
	}


	// Example of overriding a restful method.
	async delete(req: Request, res: Response, next: NextFunction){
		base.response.error(500, 'You cannot delete users');
	}
}

export default (new UserRestful()).export;
