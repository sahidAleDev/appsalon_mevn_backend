import User from '../models/User.js';
import { sendEmailVerification, sendEmailPasswordReset } from '../emails/authEmailService.js';
import { generateJWT, uniqueId } from '../utils/index.js';

const register = async (req, res) => { 

  const MIN_PASSWORD_LENGTH = 8

  if(Object.values(req.body).some(value => value === '')){
    const error = new Error('Todos los campos son obligatorios')
    return res.status(400).json({ msg: error.message })
  }

  const { email, password, name } = req.body
  const userExists = await User.findOne({ email })

  if(userExists){
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({ msg: error.message })
  }

  if(password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(`El password debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
    return res.status(400).json({ msg: error.message })
  }


  try {
    const user = new User(req.body)
    const result = await user.save()

    const { name, email , token } = result

    sendEmailVerification({ name, email, token })

    res.json({
      msg: 'El Usuario se creo correctamente, revisa tu email'
    
    })
  } catch (error) {
    console.log(error)
  }
}

const verifyAccount = async (req, res) => { 
  const { token } = req.params

  const user = await User.findOne({ token })

  if(!user){
    const error = new Error('Hubo un error, token no valido')
    return res.status(401).json({ msg: error.message })
  }

  //* Si el token es valido, activar la cuenta
  try {
    user.verified = true
    user.token = ''
    await user.save()
    res.json({ msg: 'Cuenta verificada correctamente' })
  } catch (error) {
    console.log(error)
  }
}

const login = async  (req, res) => { 
  const { email, password } = req.body

  //* Revisar que el usuario exista

  const user = await User.findOne({ email })

  if(!user){
    const error = new Error('El Usuario no existe')
    return res.status(401).json({ msg: error.message })
  }

  //* Revisar que el usuario confirmo su cuenta

  if(!user.verified){
    const error = new Error('Tu cuenta no ha sido confirmada aún')
    return res.status(401).json({ msg: error.message })
  }

  if(await user.checkPassword(password)){
    const token = generateJWT(user._id)
    res.json({
      token
    })
  } else {
    const error = new Error('El password es incorrecto')
    return res.status(401).json({ msg: error.message })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  //* Comprobar que el usuario existe
  const user = await User.findOne({ email })

  if(!user){
    const error = new Error('El Usuario no existe')
    return res.status(404).json({ msg: error.message })
  }

  try {
    user.token = uniqueId()
    const result = await user.save()

    sendEmailPasswordReset({
      name: result.name,
      email: result.email,
      token: result.token
    })

    res.json({
      msg: 'Hemos enviado un email con las instrucciones para recuperar tu password'
    })
  } catch (error) {
    
  }
}

const verifyPasswordToken = async (req, res) => { 
  const { token } = req.params

  const isValidToken = await User.findOne({ token })

  if(!isValidToken){
    const error = new Error('Hubo un error, Token no valido')
    return res.status(401).json({ msg: error.message })
  }

  res.json({ msg: 'Token valido' })

}

const updatePassword = async (req, res) => {
  const { password } = req.body
  const { token } = req.params

  const user = await User.findOne({ token })

  if(!user){
    const error = new Error('Hubo un error, Token no valido')
    return res.status(401).json({ msg: error.message })
  }

  try {
    user.token = ''
    user.password = password
    await user.save()
    res.json({ msg: 'Password modificado correctamente' })
  } catch (error) {
    
  }
}

const user = async (req, res) => { 
  const { user } = req 
  res.json(user)
}

const admin = async (req, res) => { 
  const { user } = req 

  if(!user.admin){
    const error = new Error('Acción no autorizada')
    return res.status(401).json({ msg: error.message })
  }


  res.json(user)
}

export {
  admin,
  forgotPassword,
  login,
  register,
  updatePassword,
  user,
  verifyAccount,
  verifyPasswordToken,
}