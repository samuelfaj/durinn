import Durinn from "../durinn";
import { Model, DataTypes, SaveOptions, InstanceUpdateOptions } from "sequelize";

class Actions extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Actions.init({
  id: {
    type: DataTypes.INTEGER(),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'actions',
  sequelize: Durinn.sequelize
});

Actions.beforeUpdate(action => {
  // An example of hook
  if(action.id == 1){ throw new Error("Cannot edit action 1"); }
});

export default Actions;
