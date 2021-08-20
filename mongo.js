const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('I demand more arguments')
    process.exit(1)
}

//[0] node
//[1] mongo.js
//[2] password
//[3] name
//[4] number

const password = process.argv[2]
const name = process.argv[3]
const num = process.argv[4]

const url = `mongodb+srv://fullstack-hy:${password}@fs-cluster.qiy3y.mongodb.net/part3-db?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (typeof name === 'undefined' || typeof num === 'undefined') {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: name,
        number: num
    })

    person.save().then(res => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}