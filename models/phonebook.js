const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    }
    )
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    })

const isValidPhoneNumber = (phoneNumber) => {
    var pattern = /^\d{2,3}-\d+$/
    return pattern.test(phoneNumber)
}

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        required: true
    },
    number: {
        type: String,
        minLength: [8, 'Too short number'],
        required: true,
        validate: [isValidPhoneNumber, 'Not a valid phone number'],
      },
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)