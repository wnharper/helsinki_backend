require('dotenv').config()
const url = process.env.MONGODB_URI
const mongoose = require('mongoose')

mongoose.connect(url)
    .then(result => console.log('Connected to mongoDB'))
    .catch(error => console.log('error connecting to db', error.message))


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)