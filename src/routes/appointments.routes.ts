import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);

  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;

    const parsedDate = startOfHour(parseISO(date));

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
      provider_id,
      date: parsedDate,
    });

    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;
