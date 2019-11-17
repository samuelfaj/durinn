#!/usr/bin/env node
import { Sequelize } from "sequelize";
import { ClassDeclaration, DeclarationVisibility, getVisibilityText, TypescriptParser } from "typescript-parser";


const { exec } = require("child_process");
const Config = require("./config/config");

const fs = require("fs");
const path = require("path");
const parser = new TypescriptParser();

if(!process.env.NODE_ENV || process.env.IS_OFFLINE){
	process.env.NODE_ENV = "development";
}

/**
 * Durin v 1.1
 * ---------------
 * This script is used as a global script to store variables
 */

const verbose = true;
const config = Config[process.env.NODE_ENV];

const Durinn: { [a: string]: any; sequelize: Sequelize, env: string} = {
	name: `Durinn Framework v.1.1`,
	description: `In this file you can store global variables as database configuration or global user object`,
	env: process.env.NODE_ENV,
	sequelize: new Sequelize(
		config["database"],
		config["username"],
		config["password"],
		{
			host: config["host"],
			dialect: config["dialect"],
			port: config["port"],
			pool: { max: 10 },
			// timezone: '-03:00',
			logging: verbose && (process.env.NODE_ENV != 'production'),
			define: {
				timestamps: true,
				paranoid: true,
			}
		}
	)
};

export default Durinn;

const Bin: { [a: string]: () => void } = {
	help: function() {
		console.log(" - Usage:");
		console.log(
			"\x1b[32m",
			"npx ts-node durinn dump-models",
			"\x1b[0m",
			"                 Convert database (config/config.json) into models on ./models folder"
		);
		// console.log(
		// 	"\x1b[32m",
		// 	"npx ts-node durinn ts-model",
		// 	"\x1b[31m[path | '*']\x1b[0m",
		// 	"\x1b[0m",
		// 	"  Convert Sequelize model rawAttributes into Typescript attributes"
		// );
		console.log(
			"\x1b[32m",
			"npx ts-node durinn generate_types",
			"\x1b[0m",
			"              Convert Sequelize models into types declaration accessible from the endpoint /types"
		);
		console.log(" - Sequelize:");
		console.log(
			"\x1b[32m",
			"npx sequelize migration:create",
			"\x1b[31m --name=<NAME>\x1b[0m",
			"\x1b[0m",
			"  Creates a migration"
		);
		console.log(
			"\x1b[32m",
			"npx sequelize seed:generate",
			"\x1b[31m    --name=<NAME>\x1b[0m",
			"\x1b[0m",
			"  Creates a seeder"
		);
		console.log("");
	},
	dump_models: async function() {
		console.log(" - Dumping database...");
		exec(
			`npx sequelize-auto -o "./.durinn/models" -d ${
				config["database"]
			} -h ${config["host"]} -u ${config["username"]} -p ${
				config["port"]
			} ${config["password"] ? " -x " + config["password"] : ""} -e ${
				config["dialect"]
			} -z`,
			(err: any, stdout: any, stderr: any) => {
				if (err) {
					return console.log("\x1b[31m%s\x1b[0m", err);
				}

				const base_model = fs.readFileSync(
					"./.durinn/base/ts-model.txt",
					"utf8"
				);
				const definitions = fs.readFileSync(
					"./.durinn/models/db.d.ts",
					"utf8"
				);

				fs.readdirSync("./.durinn/models").forEach((file: string) => {
					if (file != "db.d.ts" && file != "db.tables.ts") {
						const durinn_file = "./.durinn/models/" + file;
						const new_file = "./models/" + file;

						const MODEL_NAME = file
							.substr(0, file.length - 3)
							.replace(new RegExp("_", "g"), " ")
							.toLowerCase()
							.replace(
								/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
								function(s) {
									return s.toUpperCase();
								}
							)
							.replace(new RegExp(" ", "g"), "_");

						const durinn_content = fs.readFileSync(
							durinn_file,
							"utf8"
						);

						if (fs.existsSync(new_file)) {
							console.log(
								"\x1b[32m",
								file,
								"\x1b[31m",
								"File already exists"
							);
						} else {
							let content = base_model.replace(
								new RegExp("{{MODEL-NAME}}", "g"),
								MODEL_NAME
							);

							// GET INIT
							let firstvariable = `, \\{`;
							let secondvariable =
								`tableName\\: \\'` +
								file.substr(0, file.length - 3) +
								`\\'`;
							let pattern =
								firstvariable + "([\\s\\S]*?)" + secondvariable;

							// console.log(pattern,durinn_content);

							let regExString = new RegExp(pattern, "ig"); //set ig flag for global search and case insensitive

							let testRE = regExString.exec(durinn_content);
							if (testRE && testRE.length > 1) {
								//RegEx has found something and has more than one entry.
								content = content.replace(
									"{{MODEL-INIT}}",
									testRE[0].substr(2)
								);
							}

							// GET definitions
							firstvariable =
								file.substr(0, file.length - 3) + `Attribute {`;
							secondvariable = `}`;
							pattern =
								firstvariable + "([\\s\\S]*?)" + secondvariable;

							regExString = new RegExp(pattern, "ig"); //set ig flag for global search and case insensitive
							testRE = regExString.exec(definitions);

							if (testRE && testRE.length > 1) {
								//RegEx has found something and has more than one entry.
								let t =
									"  public " +
									testRE[0]
										.replace(
											new RegExp(";\n", "gm"),
											";\n  public "
										)
										.replace(
											new RegExp("([\\d\\w])(:)", "gm"),
											"$1!:"
										)
										.substr(firstvariable.length)
										.replace("}", "")
										.replace(
											new RegExp("\\?\\:", "gm"),
											"!:"
										)
										.trim();
								content = content.replace(
									"{{MODEL-INTERFACE}}",
									t.substr(0, t.length - 6).trim()
								);
							} else {
								content = content.replace(
									"{{MODEL-INTERFACE}}",
									""
								);
							}

							fs.writeFileSync(
								new_file,
								content.replace(
									new RegExp(
										"DataTypes\\.INTEGER\\(\\d*\\)",
										"gm"
									),
									"DataTypes.INTEGER()"
								)
							);

							let associations = fs.readFileSync('associations.ts').toString();

							associations = `import { ${MODEL_NAME}_Associations } from "${new_file.replace('.ts', '')}";\n` + associations;

							if(associations.indexOf(`${MODEL_NAME}_Associations()`) == -1){
								associations = associations.replace(
									'export default function() {',
									`export default function() {\n  ${MODEL_NAME}_Associations();`
								);

								fs.writeFileSync('associations.ts', associations);
							}

							exec(
								`npx prettier --write --tab-width 4 --use-tabs ${new_file}`,
								(err: any, stdout: any, stderr: any) => {
									console.log(
										"\x1b[32m",
										file,
										"\x1b[0m",
										"Created"
									);
								}
							);
						}
					}
				});
			}
		);
	},
	generate_types: async function(){
		fs.readdir(__dirname + '/models', async function (err: Error, files: string[]) {

			if(err){
				throw err;
			}

			let types = '';

			const show = { properties: true, methods: false };

			const genType = async function(filePath: string){

				const sequelizeTypes = [
					"HasManyAddAssociationMixin",
					"HasManyAddAssociationMixinOptions",
					"HasManyAddAssociationsMixin",
					"HasManyAddAssociationsMixinOptions",
					"HasManyCountAssociationsMixin",
					"HasManyCountAssociationsMixinOptions",
					"HasManyCreateAssociationMixin",
					"HasManyCreateAssociationMixinOptions",
					"HasManyGetAssociationsMixin",
					"HasManyGetAssociationsMixinOptions",
					"HasManyHasAssociationMixin",
					"HasManyHasAssociationMixinOptions",
					"HasManyHasAssociationsMixin",
					"HasManyHasAssociationsMixinOptions",
					"HasManyRemoveAssociationMixin",
					"HasManyRemoveAssociationMixinOptions",
					"HasManyRemoveAssociationsMixin",
					"HasManyRemoveAssociationsMixinOptions",
					"HasManySetAssociationsMixin",
					"HasManySetAssociationsMixinOptions",
					"HasOneCreateAssociationMixin",
					"HasOneCreateAssociationMixinOptions",
					"HasOneGetAssociationMixin",
					"HasOneGetAssociationMixinOptions",
					"HasOneSetAssociationMixin",
					"HasOneSetAssociationMixinOptions",
					"BelongsToCreateAssociationMixin",
					"BelongsToCreateAssociationMixinOptions",
					"BelongsToGetAssociationMixin",
					"BelongsToGetAssociationMixinOptions",
					"BelongsToManyAddAssociationMixin",
					"BelongsToManyAddAssociationMixinOptions",
					"BelongsToManyAddAssociationsMixin",
					"BelongsToManyAddAssociationsMixinOptions",
					"BelongsToManyCountAssociationsMixin",
					"BelongsToManyCountAssociationsMixinOptions",
					"BelongsToManyCreateAssociationMixin",
					"BelongsToManyCreateAssociationMixinOptions",
					"BelongsToManyGetAssociationsMixin",
					"BelongsToManyGetAssociationsMixinOptions",
					"BelongsToManyHasAssociationMixin",
					"BelongsToManyHasAssociationMixinOptions",
					"BelongsToManyHasAssociationsMixin",
					"BelongsToManyHasAssociationsMixinOptions",
					"BelongsToManyRemoveAssociationMixin",
					"BelongsToManyRemoveAssociationMixinOptions",
					"BelongsToManyRemoveAssociationsMixin",
					"BelongsToManyRemoveAssociationsMixinOptions",
					"BelongsToManySetAssociationsMixin",
					"BelongsToManySetAssociationsMixinOptions",
					"BelongsToSetAssociationMixin",
					"BelongsToSetAssociationMixinOptions"
				];

				const parsed = await parser.parseFile(filePath, "workspace root");
				const declaration: any = parsed.declarations[0];

				const className = declaration.name;

				const classMethods = declaration.methods;
				const publicMethods = classMethods
					.filter((method: any) => method.visibility === undefined || method.visibility > 1);

				let properties = [];

				for (let property of declaration.properties) {
					if (
						property.visibility === undefined ||
						property.visibility == DeclarationVisibility.Public &&
						property.type.indexOf("<") == -1 &&
						sequelizeTypes.indexOf(property.type) == -1 &&
						!property.isStatic
					) {
						const signal = property.isOptional ? "?:" : ":";
						const type = property.isStatic ? "static " : "";
						const visibility = getVisibilityText(property.visibility);
						properties.push(`${property.name}${signal} ${property.type}`);
					}
				}

				const methods = publicMethods.map((method: any) => {
					const signatureArray = method.parameters.map((param: any) => `${param.name}: ${param.type}`);

					const signature = signatureArray.join(", ");
					const name = `${method.name}`;
					const returnType = method.type || "{}";
					return `${name}(${signature}): ${returnType}`;
				});

				const response = `export type ${className} = {${properties.length == 0 || !show.properties ? "" : (properties.join(";\n    ") + ";")} ${methods.length == 0 || !show.methods ? "" : (methods.join(";\n    ") + ";")}}`;

				return response;
			}

			for(let file of files){
				if(path.extname(file) == '.ts'){
					types += await genType(__dirname + '/models/' + file) + "\n\n";
				}
			}

			fs.writeFileSync(__dirname + '/assets/types.ts', `export namespace Types{${types}}`);

			exec(
				`npx prettier --write --tab-width 4 --use-tabs ${__dirname + '/assets/types.ts'}`,
				(err: any, stdout: any, stderr: any) => {
					fs.rename(__dirname + '/assets/types.ts', __dirname + '/assets/types.txt', function(err: Error) {
						if ( err ){
							console.error('ERROR: ' + err);
						}else{
							console.log(
								"\x1b[32m",
								'Types',
								"\x1b[0m",
								"Created"
							);
						}
					});
				}
			);
		});
	}
};

if (
	process.argv.length &&
	process.argv[1].lastIndexOf("durinn") == process.argv[1].length - 6
) {
	const action: string = (process.argv[2] || "help").replace("-", "_");
	console.log("\x1b[36m%s\x1b[0m", "Durinn Framework");

	if (typeof Bin[action] == "function") {
		Bin[action]();
	} else {
		Bin.help();
	}
}
