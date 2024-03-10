import mongoose from 'mongoose'

/*
  * Schema
  - Es la estructura de la colección de datos
*/

const servicesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Elimina los espacios en blanco al inicio y al final
  },
  price: {
    type: Number,
    required: true,
    trim: true 
  },
})

const Services = mongoose.model('Services', servicesSchema)
export default Services