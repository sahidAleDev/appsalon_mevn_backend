import { db } from '../config/db.js';
import colors from 'colors'
import dotenv from "dotenv"; 
import Services from '../models/Services.js';
import { services } from './beautyServices.js';

//* Variables de entorno
dotenv.config() // Cargar las variables de entorno

await db()

async function seedBD() {
  try {
    await Services.insertMany(services);
    console.log(colors.green.bold('Se agregaron los datos correctamente'));
    process.exit(0)
  } catch (error) {
    console.error('Error importing data', error);
    process.exit(1);
  }
}

async function clearDb() {
  try {
    await Services.deleteMany();
    console.log(colors.red.bold('Se eliminaron los datos correctamente'));
    process.exit(0)
  } catch (error) {
    console.error('Error importing data', error);
    process.exit(1);
  }
}

if (process.argv[2] === '--import') {
  seedBD();
} else {
  clearDb();
}