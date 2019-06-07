import Durinn from "../durinn";
import { Model, DataTypes, SaveOptions, InstanceUpdateOptions } from "sequelize";
import * as sequelize from "sequelize";

class Cadastros_Documentos extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cadastros_Documentos.init({
  id: {
    type: DataTypes.INTEGER(),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  data_registro: {
    type: DataTypes.DATE,
    allowNull: true,
    // defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  idcadastros: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    references: {
      model: 'cadastros',
      key: 'id'
    }
  },
  sta_id: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    references: {
      model: 'status',
      key: 'id'
    }
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  link: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  obs: {
    type: DataTypes.STRING(250),
    allowNull: true
  },
  upload: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    references: {
      model: 'tb_usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'cadastros_documentos',
  sequelize: Durinn.sequelize
});

export default Cadastros_Documentos;
