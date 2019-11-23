const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MovieSchema = Schema({
    name: String,
    film_genre: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    year: Number,
    gate_money: Number,
    rating: Number,
}, {
    timestamps: true
});

module.exports = mongoose.model("Movie", MovieSchema);