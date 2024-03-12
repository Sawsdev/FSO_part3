const mongoose = require('mongoose')


const url = process.env.MONGODB_URI
console.log('connecting to db')
mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log(result)
        console.log('connected to MongoDB Atlas')
    })
    .catch(error => {
        console.log('error connecting to MongoDB Atlas: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Minimun character length for name is 3, please verify'],
        required: true,
    },
    number: {
        type: String,
        minLength: [8, 'Minimum phone number length is 8 characters'],
        validate: {
            validator: function(v) {
                return /^(\d{2,}-\d{6,})/gi.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Phone number is required']
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)
