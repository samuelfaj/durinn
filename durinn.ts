import { Sequelize } from "sequelize";
import Actions from "./models/actions";
import config from "./config/config";

/**
 * Durin v 1.0
 * ---------------
 * This script is used as a global script to store variables
 */

const Durinn: {[a:string]: any, sequelize: Sequelize} = {
  name: `Durinn Framework v.1.0`,
  description: `In this file you can store global variables as database configuration or global user object`,
  sequelize: new Sequelize(
    config.database[process.env.NODE_ENV || 'production']['database'],
    config.database[process.env.NODE_ENV || 'production']['username'],
    config.database[process.env.NODE_ENV || 'production']['password'],
    {
      host: config.database[process.env.NODE_ENV || 'production']['host'],
      dialect: config.database[process.env.NODE_ENV || 'production']['dialect'],
      pool: { max: 10 }
    }
  )
};

export default Durinn;