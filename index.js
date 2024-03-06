const express = require('express')
const app = express()
app.use(express.json())

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

app.get('/', (request, response) => {
    response.status(200).send("<h1>Welcome to persons phonebook</h1>")
})

app.get('/api/persons', (request, response) => {
    response.status(200).json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const {id} = request.params
    const person = persons.find((p) => p.id === Number(id))
    if(!person)
    {
        response.status(404).json({message: `the ${id} person has not been found on the phonebook`})
    }
    response.status(200).json(person)
})

const generateRandomId = ()  => {
    return Math.floor(Math.random() * 800000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.number || !body.name) {
        response.status(406).json({error: "name and number are required"}).end()
        
    }

    const person = persons.find((p) => p.name.toLowerCase().includes(body.name.toLowerCase()))
    if (person) {
        response.status(409).json({error: "name must be unique"}).end()
    }
    const newPerson = {
        id: generateRandomId(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(newPerson)
    response.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const {id} = request.params
    const person = persons.find((p) => p.id === Number(id)) 
    if(!person)
    {
        response.status(404).json({message: `the ${id} person has not been found on the phonebook`})
    }
     persons = persons.filter((p) => p.id !== Number(id))
    
     response.status(204).json({message:`Person ${id} has been removed`})
})

app.get('/api/info', (request, response) => {
    
    const peopleCount = persons.length
    const currentDate = new Date().toString()

    response.status(200).send(`<p>Phonebook has info for ${peopleCount} people</p>
    <p>${currentDate}</p>`)
})


const PORT = 3001
app.listen(PORT)
console.log(`Persons server runing on ${PORT}`);