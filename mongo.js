const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument: node mongo.js <password>")
  process.exit(1)
}

const password = process.argv[2]

const dbName = "phonebook"
const url =
  `mongodb+srv://fullstack:${password}@cluster0.n70j8.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log("contact saved:", result)
    mongoose.connection.close()
  })
}
