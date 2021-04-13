require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const Person = require("./models/person")

app.use(express.static("build"))
app.use(express.json())

// eslint-disable-next-line
morgan.token("content", function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    response.status(400).send({ error:"bad id format" })
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/info", (request, response) => {
  Person.find({}).then(persons => {
    const people = persons
    const requestDate = new Date()
    response.send(`<p>Phonebook has info for ${people.length} people</p>
      <p>${requestDate.toString()}</p>`)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  // eslint-disable-next-line
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const contact = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true, context: "query" })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error:"unrecognised url endpoint" })
}
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})