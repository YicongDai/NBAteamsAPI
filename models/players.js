let mongoose = require('mongoose');

let PlayerSchema = new mongoose.Schema({
    name: String,
    age: Number,
    height: Number,
    weight: Number,
    nationality: String,
    position: String,
    teamId: {type: mongoose.Schema.Types.ObjectId, ref: 'teams'},
    salary: Number,
    joinTime: String

    },
    { versionKey:false},
    { collection: 'players' });

module.exports = mongoose.model('players', PlayerSchema );