const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelTransaction = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    createDate: {
        type: Date,
        default: new Date().toISOString()
    },
    order: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantify: {
                type: Number,
                default: 0
            }
        }
    ]
}, {
    collection: 'transactions'
})

module.exports = mongoose.model('transactions', ModelTransaction);