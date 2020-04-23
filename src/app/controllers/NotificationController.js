import Notification from '../schemas/Notification';

import User from '../models/Users';

class NotificationController {
  async index(req, res) {
    const providerUser = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!providerUser) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json({ notifications });
  }
}

export default new NotificationController();
