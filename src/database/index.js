/* Conexão com o banco */
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import Appointment from '../app/models/Appointment';
import User from '../app/models/Users';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.initPostgres();
    this.mongo();
  }

  initPostgres() {
    this.connection = new Sequelize(databaseConfig);

    models.forEach(model => model.init(this.connection));

    models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose
      .connect('mongodb://mongo:27017/gobarber', {
        useNewUrlParser: true,
      })
      .then(res => console.log(res.connections))
      .catch(err => console.log(err, 'oiooi'));
  }
}

export default new Database();
