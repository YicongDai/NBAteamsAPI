let mongoose = require('mongoose');

let TeamSchema = new mongoose.Schema({
        name: String,
        city: String,
        zone:{name:String,location:String},
        numPlayer: Number,
        championships:Number,
        rank:Number,
        playerId: [{type: mongoose.Schema.Types.ObjectId, ref: 'players'}],
    },{ versionKey:false},

    { collection: 'teams' });

module.exports = mongoose.model('teams', TeamSchema );