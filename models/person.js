const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  // eslint-disable-next-line
  .then(response => {
    console.log("Connected to MongoDB!")
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: Number,
    minlength: 8,
    required: true,
  },
})
personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model("Person", personSchema)