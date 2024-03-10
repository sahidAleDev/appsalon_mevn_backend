import { createTransport } from '../config/nodemailer.js'

export async function sendEmailVerification({ name, email, token }) {
  const trasporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  await trasporter.sendMail({
    from: 'AppSalon <cuentas@appsalon.com>',
    to: email,
    subject: 'AppSalon - Confirma tu cuenta',
    text: 'AppSalon - Confirma tu cuenta',
    html: `
      <p>Hola ${name}, confirma tu cuenta en AppSalon</p>
      <p>Tu cuenta esta casi lista, solo debes confirmarla en el siguiente enlace</p>
      <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar Cuenta</a>
      <p>Si tu no creaste esta cuenta, puedes ingnorar este mensaje</p>
    `
  })

}

export async function sendEmailPasswordReset({ name, email, token }) {
  const trasporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  await trasporter.sendMail({
    from: 'AppSalon <cuentas@appsalon.com>',
    to: email,
    subject: 'AppSalon - Restablece tu password',
    text: 'AppSalon - Restablece tu password',
    html: `
      <p>Hola ${name}, has solicitdado restablecer tu password</p>
      <p>Sigue el siguiente enlace para generar un nuevo password</p>
      <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Reestablecer password</a>
      <p>Si tu no solicitaste esto, puedes ingnorar este mensaje</p>
    `
  })
}