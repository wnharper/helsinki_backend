const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



// middleware
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('reqBody', (req, res) => { 
    console.log(req.body);
    return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

// app.get('/', (request, response) => {
//     response.send('<h1>Hello</h1>')
// })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    newPerson = request.body
    persons = persons.concat(newPerson)
    response.send(console.log(persons))
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({error: 'no name provided'})
    }

    if (!person.number) {
        return response.status(400).json({error: 'no number provided'})
    }

    if (persons.find(p => p.number === person.number)) {
        return response.status(400).json({error: 'number already exists in phonebook'})
    }

    person.id = Math.max(...persons.map(p => p.id)) + 1

    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const pid = Number(request.params.id)
    const res = persons.find(p => p.id === pid)

    if (res) {
        return response.json(res)
    } 
    return response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(p => p.id !== id)
    console.log(persons)
    response.status(204).send(console.log(persons))
})

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`)

})

const unknownEndPoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndPoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})