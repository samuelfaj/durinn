import Router, { DurinnRouter, RequestFilter } from "./router";
import { NextFunction, Request, Response } from "express";
import Sequelize from "sequelize";
import base from "./router";

export default class Restful {
	protected MODEL_NAME: string;

	constructor(readonly router: DurinnRouter, readonly MODEL: any, protected endpoint: string = ''){
		const self = this;

		this.MODEL_NAME = self.MODEL.name.toLowerCase();

		if(!self.endpoint){
			self.endpoint = self.MODEL_NAME;
		}

		this.router.use(`/${this.endpoint}/`, function(req: Request, res: Response, next: NextFunction) {
			res.locals.self = self;
			next();
		});
	}

	get export(){
		this.init();
		return this.router;
	}

	public init(){
		this.router.use(`/${this.endpoint}/`, this.use);
		this.router.use(`/${this.endpoint}/search/:offset?/:limit?`, this.search);
		this.router.post(`/${this.endpoint}/`, this.post);

		this.router.use(`/${this.endpoint}/:id`, this.user_id);
		this.router.get(`/${this.endpoint}/:id`, this.get);
		this.router.put(`/${this.endpoint}/:id`, this.put);
		this.router.delete(`/${this.endpoint}/:id`, this.delete);

		return this;
	}

	public async use(req: Request, res: Response, next: NextFunction){
		let filters: {[column: string]: {where: any, like: any}} = {};

		if(Object.keys(req.query).length == 0){
			return next();
		}

		try{
			for(let name of Object.keys(req.query)){
				const obj: RequestFilter = JSON.parse(req.query[name] || '{}');
				const where: any = {};

				if('where' in obj){
					for(let item in obj.where){
						if(typeof obj.where[item] === 'object'){
							const keys: any = Object.keys(obj.where[item]);
							const values = Object.values(obj.where[item]);
							// @ts-ignore
							where[item] = {[Sequelize.Op[keys[0]]]: values[0]};
						}else{
							if(typeof obj.where[item] === "string"){
								if(obj.where[item]){
									where[item] = obj.where[item];
								}
							}else{
								where[item] = obj.where[item];
							}
						}
					}
				}

				if('like' in obj) {
					for (let item in obj.like) {
						where[item] = { [Sequelize.Op.like]: '%' + obj.like[item] + '%' };
					}
				}

				filters[name] = where;
			}

		}catch (e) {
			next(e);
		}


		req.app.set('filters', filters);
		res.locals.filters = filters;

		next();
	}

	public async search(req: Request, res: Response, next: NextFunction){
		const self = res.locals.self;
		const filters = req.app.get('filters');
		const limit = parseInt(req.params.limit) || 50;
		const model = await self.MODEL.findAndCountAll({
			where: filters[self.MODEL_NAME] || undefined,
			limit: limit < 50 ? limit : 50,
			offset: parseInt(req.params.offset) || 0,
		});
		base.response.success(model);
	}

	public async post(req: Request, res: Response, next: NextFunction){
		const self = res.locals.self;
		const model = await self.MODEL.create(req.body);
		base.response.success(model);
	};

	public async user_id(req: Request, res: Response, next: NextFunction){
		const self = res.locals.self;
		const model = await self.MODEL.findByPk(req.params.id);

		if(!model){
			base.response.error(404, "Not Found");
		}

		req.app.set('model', model);
		res.locals.model = model;

		next();
	}

	public async get(req: Request, res: Response, next: NextFunction){
		const model = req.app.get('model');
		base.response.success(model);
	};

	public async put(req: Request, res: Response, next: NextFunction){
		const model = req.app.get('model');
		await model.update(req.body);
		base.response.success(model);
	}

	public async delete(req: Request, res: Response, next: NextFunction){
		const model = req.app.get('model');
		await model.destroy(req.body);
		base.response.success(model);
	}
}
