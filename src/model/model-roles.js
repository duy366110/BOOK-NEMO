const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelRole = new Schema({
    name: {
        type: String,
        default: ''
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