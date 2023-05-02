const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    url: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Profile', profileSchema)