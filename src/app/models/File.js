import Sequelize, { Model } from 'sequelize';

class Files extends Model {
  static init(sequelize) {
    /* Chamada da inicialização
      da classe pai (Model);
     */

    super.init(
      {
        /* Passar as colunas da tabela
      que serão inseridas pelo usuário */
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Files;
