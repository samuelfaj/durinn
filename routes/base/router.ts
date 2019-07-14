import { NextFunction, Request, Response, Router } from "express";
import * as express from "express";
import {AuthenticatedRoute} from "./authenticated";

export default class BaseRouter {
	public static get response(){
		return new RouteResponse();
	}

	public router: Router;

	constructor() {
		this.router = express.Router();
	}

	public get response(){
		return new RouteResponse();
	}

	public get authenticated() {
		return new AuthenticatedRoute.User(this, this.router);
	}

	public get(path: string, _function: (req: Request, res: Response, next: NextFunction) => any) {
		return this.router.get(path, function(req: Request, res: Response, next: NextFunction) {
			return _function(req, res, next);
		});
	}

	public post(path: string, _function: (req: Request, res: Response, next: NextFunction) => any) {
		return this.router.post(path, function(req: Request, res: Response, next: NextFunction) {
			return _function(req, res, next);
		});
	}

	public put(path: string, _function: (req: Request, res: Response, next: NextFunction) => any) {
		return this.router.put(path, function(req: Request, res: Response, next: NextFunction) {
			return _function(req, res, next);
		});
	}

	public delete(path: string, _function: (req: Request, res: Response, next: NextFunction) => any) {
		return this.router.delete(path, function(req: Request, res: Response, next: NextFunction) {
			return _function(req, res, next);
		});
	}
}


class RouteResponse {
	public success(response: any = null, message = null, code = 200){
		return {
			code: code,
			error: false,
			error_stack: null,
			return: response,
			message: typeof response === "string" ? response : message || 'Ação realizada com sucesso!'
		}
	}

	public error(code: number = 500, message: string, error_stack: any = null){
		return {
			code: code,
			error: true,
			return: null,
			error_stack: error_stack,
			message: message
		}
	}

	public authentication_error(message = 'Você precisa estar logado no sistema', code: number = 403, error_stack: any = null){
		return {
			code: code,
			error: true,
			return: null,
			error_stack: error_stack,
			message: message
		}
	}
}
