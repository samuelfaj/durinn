import Durinn from "../durinn";
import { Model, DataTypes } from "sequelize";
import sequelize from "sequelize";

class User extends Model {
	public id!: number;
	public register_date!: Date;
	public name!: string;
	public username!: string;
	public password!: string;
}

User.init(
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
			type: DataTypes.STRING(100),
			allowNull: true,
			unique: true
		},
		username: {
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
		tableName: "user",
		sequelize: Durinn.sequelize
	}
);

export default User;

export function User_Associations(){
	/** Declare in ../associations.ts */
	// Example
	// User.belongsTo(Company);
}
