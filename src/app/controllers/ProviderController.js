import User from '../models/Users';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.status(200).json(providers);

    // Sem retornar os atributos,
    // filtragem na hora do retorno da requisão
    // return res.json(
    //   providers.map(({ id, name, email, avatar_id }) => {
    //     return { id, name, email, avatar_id };
    //   })
    // );
  }
}

export default new ProviderController();
