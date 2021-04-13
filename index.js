require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const Person = require("./models/person")

app.use(express.static("build"))
app.use(express.json())

morgan.token("content", function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))



app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    const people = persons
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(persons => {
    response.json(persons)
  })
  // const id = Number(request.params.id)
  // const person = persons.find(p => p.id === id)
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
})

app.get("/info", (request, response) => {
  const requestDate = new Date()
  response.send(`<p>Phonebook has info for ${people.length} people</p>
    <p>${requestDate.toString()}</p>`)
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "required content missing"
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  person.save().then(savedContact => {
    response.json(savedContact)
  })
})

app.put("/api/persons/:id", (request, response, next) => {
  const contact = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error:"unrecognised url endpoint" })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})