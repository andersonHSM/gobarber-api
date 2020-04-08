import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    /* Chamada da inicialização
      da classe pai (Model);
     */
    super.init(
      {
        /* Passar as colunas da tabela
      que serão inseridas pelo usuário */
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // permite realizar ações em hooks da aplicação
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });

    return this;
  }

  // static associate(models) {
  //   this.belongsTo(models.Files, { foreignKey: 'avatar_id' });
  // }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.associate = models =>
  User.belongsTo(models.Files, { foreignKey: 'avatar_id' });

export default User;
