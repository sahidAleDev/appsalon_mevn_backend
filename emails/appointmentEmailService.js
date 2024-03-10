import { createTransport } from '../config/nodemailer.js'

export async function sendEmailNewAppointment({ date, time }) {
  const trasporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  await trasporter.sendMail({
    from: 'AppSalon <citas@appsalon.com>',
    to: 'admin@appsalon.com',
    subject: 'AppSalon - Nueva Cita',
    text: 'AppSalon - Nueva Cita',
    html: `
      <p>Hola: Admin, tienes una nueva cita</p>
      <p>La cita será el día ${date} a las ${time} horas</p>
      
    `
  })
}

export async function sendEmailUpdateAppointment({ date, time }) {
  const trasporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  await trasporter.sendMail({
    from: 'AppSalon <citas@appsalon.com>',
    to: 'admin@appsalon.com',
    subject: 'AppSalon - Cita actualizada',
    text: 'AppSalon - Cita actualizada',
    html: `
      <p>Hola: Admin, un usuario ha modificado una cita</p>
      <p>La nueva cita será el día ${date} a las ${time} horas</p>
      
    `
  })
}

export async function sendEmailCancelAppointment({ date, time }) {
  const trasporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  await trasporter.sendMail({
    from: 'AppSalon <citas@appsalon.com>',
    to: 'admin@appsalon.com',
    subject: 'AppSalon - Cita cancelada',
    text: 'AppSalon - Cita cancelada',
    html: `
      <p>Hola: Admin, un usuario ha cancelado una cita</p>
      <p>La cita estaba programada para: ${date} a las ${time} horas</p>
      
    `
  })
}