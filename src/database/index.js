/* Conexão com o banco */
import Sequelize from 'sequelize';

import User from '../app/models/Users';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.forEach(model => model.init(this.connection));

    models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
