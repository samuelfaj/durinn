import { NextFunction, Request, Response, Router } from "express";
import * as express from "express";
import * as core from "express-serve-static-core";
import default_login_function from "./authenticated";
const translations = require("../../config/translations") || {};

interface DurinnRouter extends core.Router {
	authenticated: (login_function ?: any) => any;
	response: RouteResponse;
	translation: (string: string) => string;
}

const _durinnRouter = function (): DurinnRouter {
	const router = express.Router() as any;
	Object.setPrototypeOf(Router, _durinnRouter);

	router.authenticated = default_login_function;

	router.use(function (req: Request, res: Response, next: NextFunction) {

		Object.defineProperty(router, "response", {
			get: function () {
				return new RouteResponse(router, req, res, next);
			}
		});

		router.translation = function(string: string) {
			const key = string.toLowerCase();
			const language = req.headers.language as string || 'en-us';

			try{
				if(typeof translations[key] === "object"){
					if(typeof translations[key][language.toLowerCase()] === "string"){
						return translations[key][language.toLowerCase()];
					}
				}
			}catch (e) {
				console.error('Error in translation', e);
			}

			return string;
		};

		next();
	});

	return router;
};

export default _durinnRouter();

export class RouteResponse {
	constructor(private router: DurinnRouter, private req: Request, private res: Response, private next: NextFunction) {
	}

	public success(response: any = null, message ?: string, code = 200, res = true){
		const self = this;
		const obj = {
			code: code,
			error: false,
			error_stack: null,
			return: response,
			message: self.router.translation(typeof response == "string" && !message ? response: message || "operation successfully completed")
		};

		if(res && self.res) {
			self.res.json(obj);
		}

		return obj;
	}

	public error(code: number = 500, message: string, error_stack: any = null, res = true){
		const self = this;
		const obj = {
			code: code,
			error: true,
			return: null,
			error_stack: error_stack,
			message: self.router.translation(message)
		};

		if(res && self.res) {
			self.res.json(obj);
		}

		return obj;
	}

	public authentication_error(message = "You must be logged in", code: number = 403, error_stack: any = null, res = true){
		const self = this;
		const obj = {
			code: code,
			error: true,
			return: null,
			error_stack: error_stack,
			message: self.router.translation(message)
		};

		if(res && self.res) {
			self.res.json(obj);
		}

		return obj;
	}
}
