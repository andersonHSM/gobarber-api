import Sequelize, { Model } from 'sequelize';

class File extends Model {
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
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:8000/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
