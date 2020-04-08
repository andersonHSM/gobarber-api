import * as Yup from 'yup';

import User from '../models/Users';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid user data.' });
    }

    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPassword, password } = req.body;

    const user = await User.findByPk(req.userId);

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when(`password`, (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'User validation has failed' });
    }

    if (email !== user.email) {
      const userWithGivenEmail = await User.findOne({ where: { email } });

      if (userWithGivenEmail) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (!oldPassword) {
      return res.status(400).json({ error: 'Old password not provided' });
    }

    if (!(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    if (oldPassword) {
      if (!password) {
        return res.status(401).json({ error: 'Please, inform a new password' });
      }
      if (password && password === oldPassword) {
        return res.status(400).json({
          error: 'Your new password can not be the same as the previous one',
        });
      }
    }

    const { id, name, provider, avatar_id } = await user.update(req.body);

    return res.json({ id, avatar_id, name, email, provider });
  }
}

export default new UserController();
