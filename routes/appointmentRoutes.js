import authMiddleware from '../middleware/authMiddleware.js'
import express from 'express'
import { 
  createAppointment, 
  deleteAppointment,
  getAppointmentsByDate, 
  getAppointmentsById,
  updateAppointment, 
} from '../controllers/appointmentController.js'


const router = express.Router()

router.route('/')
  .post(authMiddleware,createAppointment)
  .get(authMiddleware, getAppointmentsByDate)

router.route('/:id')
  .get(authMiddleware, getAppointmentsById)
  .put(authMiddleware, updateAppointment)
  .delete(authMiddleware, deleteAppointment)


export default router