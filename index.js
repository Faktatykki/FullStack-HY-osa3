const { response } = require('express')

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

morgan.token('req-body', req => JSON.stringify(req.body))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/', (req, res) => {
    res.send('<p> G\'day')
})

app.get('/info', (req, res) => {
    const amount = persons.length

    const date = new Date().toString()

    res.send(`<div>
    <p>Phonebook has info for ${amount} people<p>
    <p>${date}<p>
    <div>`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = persons.find(person => person.id === id)

    if (note) {
        persons = persons.filter(person => person.id !== id)
        res.status(200).end()
    } else {
        res.status(204).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server rumbling on port ${PORT}`)
})