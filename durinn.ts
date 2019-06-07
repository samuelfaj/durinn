import { Sequelize } from "sequelize";
const config = require('./config/config');

/**
 * Durin v 1.0
 * ---------------
 * This script is used as a global script to store variables
 */

const Durinn: {[a:string]: any, sequelize: Sequelize} = {
  name: `Durinn Framework v.1.0`,
  description: `In this file you can store global variables as database configuration or global user object`,
  sequelize: new Sequelize(
    config[process.env.NODE_ENV || 'development']['database'],
    config[process.env.NODE_ENV || 'development']['username'],
    config[process.env.NODE_ENV || 'development']['password'],
    {
      host: config[process.env.NODE_ENV || 'development']['host'],
      dialect: config[process.env.NODE_ENV || 'development']['dialect'],
      pool: { max: 10 }
    }
  )
};

export default Durinn;