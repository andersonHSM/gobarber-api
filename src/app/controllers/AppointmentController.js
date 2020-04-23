import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/Users';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      attributes: ['id', 'date'],
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_id is a provider
     */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    if (isProvider.id === req.userId) {
      return res
        .status(400)
        .json({ error: 'Provider can not create and appointment for himself' });
    }

    // Implementação pessoal (retornar depois)

    const appointmentDateObject = new Date(date);

    // const appointmentNextHourDateObject = new Date(
    //   appointmentDateObject.setHours(appointmentDateObject.getHours() + 1)
    // );

    const getNextHour = oldHour => {
      const hour = new Date(oldHour.getTime());
      const oneHourAfter = new Date(
        hour.setHours(hour.getHours().valueOf() + 1)
      );

      const oneMinutBefore = new Date(
        oneHourAfter.setMinutes(parseInt(oneHourAfter.getMinutes(), 10) - 1)
      );

      return oneMinutBefore;
    };

    const appointmentNextHourDateObject = getNextHour(appointmentDateObject);

    const getPreviousHour = oldHour => {
      const hour = new Date(oldHour.getTime());
      const oneHourBefore = new Date(
        hour.setHours(parseInt(hour.getHours(), 10) - 1)
      );

      const oneMinutAfter = new Date(
        oneHourBefore.setMinutes(+oneHourBefore.getMinutes() + 1)
      );

      return oneMinutAfter;
    };

    const appointmentPreviousHourDateObject = getPreviousHour(
      appointmentDateObject
    );

    const previousHourAppointment = await Appointment.findOne({
      where: {
        canceled_at: null,
        date: {
          [Op.between]: [
            appointmentPreviousHourDateObject,
            appointmentDateObject,
          ],
        },
        provider_id,
      },
    });

    const nextHourAppointment = await Appointment.findOne({
      where: {
        canceled_at: null,
        date: {
          [Op.between]: [appointmentDateObject, appointmentNextHourDateObject],
        },
        provider_id,
      },
    });

    const exactHourAppointment = await Appointment.findOne({
      where: {
        canceled_at: null,
        date: appointmentDateObject,
        provider_id,
      },
    });

    if (previousHourAppointment || exactHourAppointment) {
      return res.status(400).json({ error: 'Provider still in a appointment' });
    }

    if (nextHourAppointment) {
      return res
        .status(400)
        .json({ error: 'Provider will not be avaliable at this time' });
    }

    // /** validação das aulas */
    // /** Check for past dates */
    // const hourStart = startOfHour(parseISO(date));

    // if (isBefore(hourStart, new Date())) {
    //   return res
    //     .status(400)
    //     .json({ error: 'Dates prior today are not allowed' });
    // }

    // /** Check date availability */

    // const providerAppointmentAtInputedHour = await Appointment.findOne({
    //   where: { provider_id, canceled_at: null, date: hourStart },
    // });

    // if (providerAppointmentAtInputedHour) {
    //   return res
    //     .status(400)
    //     .json({ error: 'Appointment date is not avaliable' });
    // }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /**
     * Notify appointment provider
     */

    const { name } = await User.findByPk(req.userId);

    const formattedDate = format(
      appointmentDateObject,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
