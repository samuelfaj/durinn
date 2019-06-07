export type DatabaseConfig = {
  "username": string;
  "password"?: string;
  "database": string;
  "host": string;
  "dialect": "mysql" | "mariadb" | "sqlite" | "postgres" | "mssql";
}

const config: {database: {[a: string]: DatabaseConfig}} = {
  database: {
    "development": {
      "username": "root",
      "password": undefined,
      "database": "agendas_com_br",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": undefined,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "root",
      "password": undefined,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }
};

export default config;