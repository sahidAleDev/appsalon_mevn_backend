import { db } from "./config/db.js";
import colors from "colors"; 
import cors from "cors"; 
import dotenv from "dotenv"; 
import express from "express";
import servicesRoutes from "./routes/servicesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentsRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

//* Variables de entorno
dotenv.config() // Cargar las variables de entorno

//* Configurar la aplicacion 
const app = express()

//* Leer datos via body
app.use(express.json())

//* Conectar a DB
db()

//* Configurar CORS

const whiteList = [process.env.FRONTEND_URl, undefined]

const corsOptions = { 
  origin: function (origin, callback) {
    if(whiteList.includes(origin)){
      callback(null, true)
    } else {
      callback(new Error('Erro de CORS'))
    }
  }
}

app.use(cors(corsOptions))



//* Definir rutas
app.use('/api/services', servicesRoutes) 
app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/users', userRoutes)

//* Definir puerto

const PORT = process.env.PORT || 4000;

//* Iniciar el servidor
app.listen(PORT, () => {
  console.log(colors.blue(`El servidor esta funcionando en el puerto: `), colors.blue.bold(PORT));
})