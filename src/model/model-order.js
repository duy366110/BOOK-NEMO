const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelOrder = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user_email: {
        type: String,
        default: ''
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
})