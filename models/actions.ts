import Durinn from "../durinn";
import { Model, DataTypes } from 'sequelize';

class Actions extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public descricao!: string | null; // for nullable fields

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
  sequelize: Durinn.sequelize, // this bit is important
});

export default Actions;
