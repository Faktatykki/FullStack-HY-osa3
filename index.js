const { response } = require('express')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('req-body', req => JSON.stringify(req.body))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-532523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

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
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
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

    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }

    const name = persons.find(person => person.name === body.name)

    if (name) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }

    const personObject = {
        id: generateRandomId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(personObject)

    res.json(personObject)
})

const generateRandomId = () => {
    const rndNum = Math.floor((Math.random() * 100000) + 1)
    return rndNum
}

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server rumbling on port ${PORT}`)
})
