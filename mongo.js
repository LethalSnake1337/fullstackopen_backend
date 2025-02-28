const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://blackmen401:${password}@cluster0.i8crp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (name === undefined && number === undefined) {
    Phonebook.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(phonebook => {
            console.log(phonebook)
        })
        mongoose.connection.close()
    })
    return
}

const phonebook = new Phonebook({
    name: name,
    number: number,
})

phonebook.save().then(result => {
    console.log('phonebook saved!')
    mongoose.connection.close()
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })