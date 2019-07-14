#!/usr/bin/env node
import { Sequelize } from "sequelize";

const { exec } = require("child_process");
const Config = require("./config/config");
const fs = require("fs");

/**
 * Durin v 1.0
 * ---------------
 * This script is used as a global script to store variables
 */

const config = Config[process.env.NODE_ENV || "development"];

const Durinn: { [a: string]: any; sequelize: Sequelize} = {
	name: `Durinn Framework v.1.0`,
	description: `In this file you can store global variables as database configuration or global user object`,
	sequelize: new Sequelize(
		config["database"],
		config["username"],
		config["password"],
		{
			host: config["host"],
			dialect: config["dialect"],
			port: config["port"],
			pool: { max: 10 },
			define: {
				timestamps: false,
				// underscored: true,
				// paranoid: true,
				// createdAt: "register_date",
				// updatedAt: "update_date",
				// deletedAt: "delete_date",
				// defaultScope: {
				// 	attributes: {
				// 		exclude: ["createdAt", "updatedAt"]
				// 	}
				// }
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
			"            Convert database (config/config.json) into models on ./models folder"
		);
		console.log(
			"\x1b[32m",
			"npx ts-node durinn ts-model",
			"\x1b[31m[path | '*']\x1b[0m",
			"\x1b[0m",
			"  Convert Sequelize model rawAttributes into Typescript attributes"
		);
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
