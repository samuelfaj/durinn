import Durinn from "../durinn";
import { Model, DataTypes, SaveOptions, InstanceUpdateOptions, HasManyGetAssociationsMixin } from "sequelize";
import Cadastros_Documentos from "./cadastros_documentos";

class Cadastros extends Model {
  // Update attributes automatically - npx ts-node durinn ts-model classes/cadastros.ts

  public getCadastros_Documentos!: HasManyGetAssociationsMixin<Cadastros_Documentos>; // Note the null assertions!
}

Cadastros.init({
  id: {
    type: DataTypes.INTEGER(),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  sta_id: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue: '1',
    references: {
      model: 'status',
      key: 'id'
    }
  },
  id_tipo_de_agenda: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    references: {
      model: 'tipos_de_agenda',
      key: 'id'
    }
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cpf_cnpj: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipo_cadastro: {
    type: DataTypes.INTEGER(),
    allowNull: true
  },
  li_e_aceito: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue: '0'
  },
  email_valido: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue: '0'
  },
  data_validacao_email: {
    type: DataTypes.DATE,
    allowNull: true
  },
  codigo_valida_email: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  created: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cep: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipo_endereco: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  endereco: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  numero: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  complemento: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado_id: {
    type: DataTypes.INTEGER(),
    allowNull: true
  },
  cidade_id: {
    type: DataTypes.INTEGER(),
    allowNull: true
  },
  foto: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cadastro_completo: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue: '0'
  },
  qtd_prof: {
    type: DataTypes.INTEGER(),
    allowNull: true
  },
  latitude: {
    type: "DOUBLE",
    allowNull: true
  },
  longitude: {
    type: "DOUBLE",
    allowNull: true
  },
  bairro: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  planosid: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue: '1',
    references: {
      model: 'planos_cadastros',
      key: 'id'
    }
  },
  vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  verifica_plano: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue: '1'
  },
  viva10: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dias_gratis: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue: '30'
  },
  financeiro_inicio_contrato: {
    type: DataTypes.DATE,
    allowNull: true
  },
  financeiro_meses_contrato: {
    type: DataTypes.INTEGER(),
    allowNull: true
  },
  financeiro_vencimento_fatura: {
    type: DataTypes.INTEGER(),
    allowNull: true
  },
  financeiro_primeiro_mes: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  financeiro_impostos: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  financeiro_valido_ate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  card_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  customer_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  boleto: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue: '0'
  }
}, {
  tableName: 'cadastros',
  sequelize: Durinn.sequelize
});

Cadastros.hasMany(Cadastros_Documentos,{
  foreignKey: 'idcadastros'
});

export default Cadastros;
