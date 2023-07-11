const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelUser = new Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
        default: ''
    },
    cart: [
        {
            product: {
                type: Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ]
}, {
    collection: 'users'
})

module.exports = mongoose.model('users', ModelUser);