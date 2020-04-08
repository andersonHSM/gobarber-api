import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    /* Chamada da inicialização
      da classe pai (Model);
     */

    super.init(
      {
        /* Passar as colunas da tabela
      que serão inseridas pelo usuário */
        date: Sequelize.STRING,
        canceled_at: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
