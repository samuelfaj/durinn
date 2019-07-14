import { NextFunction, Request, Response, Router } from "express";
import UserModel from "../../models/user";
import Durinn from "../../durinn";
import BaseRouter from "../base/router";

export namespace AuthenticatedRoute {
	export class User {
		constructor(private base: BaseRouter, public router: Router) {
		}

		private async login(authorization ?: string): Promise<UserModel | null>{
			const auth = (authorization || '').split(" ");
			const type = auth[0];

			let username = "";
			let password = "";

			switch (type.toLowerCase()) {
				case "basic":
					// Basic MToxNDIxOTk3
					const [first, ...rest] = new Buffer(auth[1], "base64")
						.toString()
						.split(":");

					username = first;
					password = rest.join(":");
					break;
			}

			return await UserModel.findOne({ where: {username: username, password: password} });
		}

		public get(path: string, _function: (req: Request, res: Response, next: NextFunction, user: UserModel) => any) {
			const self = this;

			let user = null;

			return this.base.get(path, async function(req: Request, res: Response, next: NextFunction) {
				user = await self.login(req.headers.authorization);

				if (!user) {
					return res.status(403).json(self.base.response.authentication_error());
				}else{
					Durinn.user = user;
					return _function(req, res, next, user);
				}
			});
		}

		public post(path: string, _function: (req: Request, res: Response, next: NextFunction, user: UserModel) => any) {
			const self = this;

			let user = null;

			return this.base.post(path, async function(req: Request, res: Response, next: NextFunction) {
				user = await self.login(req.headers.authorization);

				if (!user) {
					return res.status(403).json(self.base.response.authentication_error());
				}else{
					Durinn.user = user;
					return _function(req, res, next, user);
				}
			});
		}

		public put(path: string, _function: (req: Request, res: Response, next: NextFunction, user: UserModel) => any) {
			const self = this;

			let user = null;

			return this.base.put(path, async function(req: Request, res: Response, next: NextFunction) {
				user = await self.login(req.headers.authorization);

				if (!user) {
					return res.status(403).json(self.base.response.authentication_error());
				}else{
					Durinn.user = user;
					return _function(req, res, next, user);
				}
			});
		}

		public delete(path: string, _function: (req: Request, res: Response, next: NextFunction, user: UserModel) => any) {
			const self = this;

			let user = null;

			return this.base.delete(path, async function(req: Request, res: Response, next: NextFunction) {
				user = await self.login(req.headers.authorization);

				if (!user) {
					return res.status(403).json(self.base.response.authentication_error());
				}else{
					Durinn.user = user;
					return _function(req, res, next, user);
				}
			});
		}
	}
}
