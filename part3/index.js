require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


// middleware
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('reqBody', (req, res) => { 
    console.log(req.body);
    return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => response.json(result))

})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const updated = request.body
    Person.findByIdAndUpdate(id, {number: updated.number}, {new: true}).then(result => response.json(result))
    .catch (error => next(error))
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({error: 'no name provided'})
    }

    if (!person.number) {
        return response.status(400).json({error: 'no number provided'})
    }

    Person.exists({number: person.number}).then(exists => {

        if (!exists) {
            const newPerson = new Person( {
                name: person.name,
                number: person.number
            })
        
            newPerson.save().then(result => response.json(result))
        } else {
            return response.status(400).json({error: 'number already exists in phonebook'})
        }
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(result => response.json(result))
    .catch (error => next(error))    
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id).then(result => response.status(204).send(console.log(result)))
})

app.get('/info', (request, response) => {
    Person.countDocuments({}).then(result => response.send(`<div>Phonebook has info for ${result} people</div><div>${new Date()}</div>`))
    

})

// handle unknown requests
const unknownEndPoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndPoint)

// handle error
const errorHandler = (error, request, response, next) => {
    console.error(error)

    if (error.name === 'CastError') {
      return response.status(400).send({error: 'malformed id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})