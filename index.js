require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

const errorHandlingMiddleware = (error, request, response, next) => {
    console.error(error.message)

    if( error.name === 'CastError')
    {
        response.status(400).send({ error: 'Malformatted id' })
    }
    else if( error.name === 'ValidationError' )
    {
        response.status(400).json({ error: error.message })
    }

    next(error)
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.status(200).json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const { id } = request.params
    Person.findById(id)
        .then(person => {
            if(!person)
            {
                response.status(404).json({ message: `the ${id} person has not been found on the phonebook` })
            }
            response.status(200).json(person)

        })
        .catch(error => next(error))

})

// const generateRandomId = ()  => {
//     return Math.floor(Math.random() * 800000)
// }

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.number || !body.name) {
        response.status(406).json({ error: 'name and number are required' }).end()

    }

    // const person = persons.find((p) => p.name.toLowerCase().includes(body.name.toLowerCase()))
    // if (person) {
    //     response.status(409).json({error: "name must be unique"}).end()
    // }
    // const newPerson = {
    //     id: generateRandomId(),
    //     name: body.name,
    //     number: body.number,
    // }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(createdPerson => {

            response.status(201).json(createdPerson)
        })
        .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    const { id } = request.params
    Person.findByIdAndDelete(id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const { id } = request.params
    const { name, number } = request.body
    const person = {
        name,
        number
    }
    Person.findByIdAndUpdate(
        id,
        person,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {

            response.json(updatedPerson)
        })
        .catch(error => next(error))

})

app.get('/api/info', (request, response) => {
    Person.find({}).then(persons => {

        const peopleCount = persons.length
        const currentDate = new Date().toString()
        response.status(200).send(`<p>Phonebook has info for ${peopleCount} people</p>
        <p>${currentDate}</p>`)
    })

})


app.use(errorHandlingMiddleware)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Persons server runing on ${PORT}`)