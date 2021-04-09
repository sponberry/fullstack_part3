const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.static("build"))
app.use(express.json())

morgan.token("content", function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Wonderwoman",
    "number": "38492331",
    "id": 8
  }
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get("/info", (request, response) => {
  const requestDate = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${requestDate.toString()}</p>`)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "required content missing"
    })
  }
  persons.map(p => {
    if (p.name.toLowerCase() === body.name.toLowerCase()){
      return response.status(400).json({
        error: "contact with that name already exists"
      })
    }
  })

  const person = {
    "name": body.name,
    "number": body.number,
    "id": Math.round(Math.random()*1000)
  }

  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error:"unrecognised url endpoint" })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})