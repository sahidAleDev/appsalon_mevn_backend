import Appointment from '../models/Appointment.js';
import { parse,  formatISO, startOfDay, endOfDay, isValid } from 'date-fns'
import { handleNotFoundError, validateObjectId, formatDate } from '../utils/index.js';
import { sendEmailNewAppointment, sendEmailUpdateAppointment, sendEmailCancelAppointment } from '../emails/appointmentEmailService.js';

const createAppointment = async (req, res) => { 
  const appointment = req.body
  appointment.user = req.user._id
  
  try {
    const newAppointment = new Appointment(appointment)
    const result = await newAppointment.save()
    
    await sendEmailNewAppointment({
      date: formatDate(result.date),
      time: result.time
    })

    res.json({
      msg: 'Tu reservación se realizó correctamente'
    })


  } catch (error) {
    console.log(error);
  }
}

const getAppointmentsByDate = async (req, res) => {
  const { date } = req.query;
  const newDate = parse(date, 'dd/MM/yyyy', new Date())

  if(!isValid(newDate)) {
    const error = new Error('Fecha no valida');
    return res.status(400).json({ 
      message: error.message
    });
  }


  const isoDate = formatISO(newDate) 

  const appointments = await Appointment.find({ date: { 
    $gte: startOfDay(new Date(isoDate)), 
    $lte: endOfDay(new Date(isoDate)) 
  }}).select('time') 

  res.json(appointments)
}

const getAppointmentsById = async (req, res) => {

  const { id } = req.params;

  //* Validar por ObjectId

  if(validateObjectId(id,res)) return;

  const appointment = await Appointment.findById(id).populate('services') 

  //* Validar que exista
  if(!appointment) {
    return handleNotFoundError('La Cita no existe', res)
  }

  //* Validar que el usuario sea el mismo que creo la cita
  console.log(appointment.user);
  console.log(req.user._id);

  if(appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para ver esta cita');
    return res.status(403).json({ message: error.message });
  }

  //* Si todo esta bien, retornamos la cita
  res.json(appointment)
}

const updateAppointment = async (req, res) => { 
  const { id } = req.params;

  if(validateObjectId(id, res)) return;

  const appointment = await Appointment.findById(id).populate('services') 
  if(!appointment) {
    return handleNotFoundError('La Cita no existe', res)
  }

  if(appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para ver esta cita');
    return res.status(403).json({ message: error.message });
  } 

  const { date, time, totalAmount, services } = req.body;
  appointment.date = date;
  appointment.time = time;
  appointment.totalAmount = totalAmount;
  appointment.services = services;

  try {
    const result = await appointment.save();
    await sendEmailUpdateAppointment({
      date: formatDate(result.date),
      time: result.time
    })
    res.json({
      msg: 'Cita actualizada correctamente'
    })
  } catch (error) {
    
  }
}

const deleteAppointment = async (req, res) => { 
  const { id } = req.params;

  if(validateObjectId(id, res)) return;

  const appointment = await Appointment.findById(id).populate('services') 
  if(!appointment) {
    return handleNotFoundError('La Cita no existe', res)
  }

  if(appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para ver esta cita');
    return res.status(403).json({ message: error.message });
  } 

  try {
    await appointment.deleteOne();

    await sendEmailCancelAppointment({
      date: formatDate(appointment.date),
      time: appointment.time
    })

    res.json({
      msg: 'Cita cancelada exitosamente'
    })
  } catch (error) {
    console.log(error);
  }
}

export {
  createAppointment,
  deleteAppointment,
  getAppointmentsByDate,
  getAppointmentsById,
  updateAppointment,
}