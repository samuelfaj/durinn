import Durinn from "../durinn";
import { Model, DataTypes } from "sequelize";
import sequelize from "sequelize";

class Admin extends Model {
	public id!: number;
	public register_date!: Date;
	public name!: string;
	public cpf!: string;
	public password!: string;
}

Admin.init(
	{
		id: {
			type: DataTypes.INTEGER(),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		register_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		cpf: {
			type: DataTypes.STRING(14),
			allowNull: true,
			unique: true
		},
		password: {
			type: DataTypes.STRING(50),
			allowNull: true
		}
	},
	{
		tableName: "admin",
		sequelize: Durinn.sequelize
	}
);

export default Admin;
