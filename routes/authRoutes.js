import express from "express";
import { 
  admin,
  forgotPassword,
  login, 
  register, 
  updatePassword,
  user, 
  verifyAccount,
  verifyPasswordToken,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas de autenticación y registro de usuarios
router.post('/register', register)
router.get('/verify/:token', verifyAccount)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)

router.route('/forgot-password/:token')
  .get(verifyPasswordToken)
  .post(updatePassword)

//* Area privada - Requiere un JWT
router.get('/user', authMiddleware, user)
router.get('/admin', authMiddleware, admin)


export default router;