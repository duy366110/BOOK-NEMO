const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelRole = new Schema({
    name: {
        type: String,
        default: ''
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
}, {
    collection: 'roles'
})

module.exports = mongoose.model('roles', ModelRole);