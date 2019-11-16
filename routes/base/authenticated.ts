import { NextFunction, Request, Response, Router } from "express";
import User from "../../models/user";

export class AuthError extends Error {
	public authentication_error: boolean = true;
}

/**
 * This functions controls users authentication.
 * @param req
 * @param res
 * @param next
 */
export default async function(req: Request, res: Response, next: NextFunction) {
	const authorization = req.headers.authorization;
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

	try{
		const user = await User.findOne({
			where: {
				username: username,
				password: password
			}
		});

		if(!user){
			const err: any = new AuthError('Not authorized!');
			return next(err);
		}


		req.app.set('user', user);
		res.locals.user = user;

		next();
	}catch (e) {
		const err: any = new AuthError('Not authorized!');
		return next(err);
	}
};
