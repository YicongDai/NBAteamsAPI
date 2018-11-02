var Teams = require('../models/teams');

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var mongodbUri ='mongodb://YicongDai:dycwjh123@ds249372.mlab.com:49372/nbateamdb';
mongoose.connect(mongodbUri,{useNewUrlParser:true});
// mongoose.connect('mongodb://localhost:27017/NBAteamdb',{useNewUrlParser:true});

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

//find all teams
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    Teams.find(function(err, teams){
        if (err)
            res.send(err);

        res.send(JSON.stringify(teams,null,5));
    });
};

//find a team
router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    Teams.findOne({"_id": req.params.id}, function (err, team) {
        if (err) {
            res.status(404);
            res.json({message: 'Team NOT Found! Please check the right id', errmsg: err})
        }
        else
            res.send(JSON.stringify(team, null, 5));

    });
};

//fuzzy search
router.findOneByName= (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var keyword = req.params.name;

    var _filter={
        $or: [

            {name: {$regex: keyword, $options: '$i'}},

        ]
    }
    var count = 0
   Teams.countDocuments(_filter, function (err, doc) {
        if (err) {
            res.json({errmsg: err});
        } else {
            count = doc
        }
    })

  Teams.find(_filter).limit(10)
        .sort({'_id': -1})
        .exec(function (err, teams) {
            if (err||teams.length==0) {
                res.status(404);
                res.json({message:"Teams Not Found!(invalid keyword)",errmsg: err});
            } else {
                res.send(JSON.stringify(teams,null,5));
            }

        });
};

//add a team
router.addTeam = (req, res) => {


    res.setHeader('Content-Type', 'application/json');

    var team = new Teams();

    team.name =  req.body.name;
    team.city=req.body.city;
    team.zone={name:req.body.zone.name,location:req.body.zone.location};
    team.numPlayer =req.body.numPlayer;
    team.championships=req.body.championships;
    team.rank=req.body.rank;
    team.playerId=req.body.playerId;


   team.save(function(err) {
        if (err){
            res.status(404)
            res.json({ message: 'Team NOT Added!', errmsg : err } );// return a suitable error message
        }

        else
            res.json({ message: 'Team Added Successfully!',data:team});// return a suitable success message
    });
};

//find all the players' information related to a team
router.findAllInformation = (req, res) => {

        res.setHeader('Content-Type', 'application/json');
      Teams.findOne({"_id": req.params.id}).populate({path:'playerId',select: 'name age height weight nationality position salary joinTime  -_id'}).exec(function (err, teams) {
          if (err)
              res.send(err);

          else

              res.json({ message: 'Team Successfully find player!',data:teams})
              // res.send(JSON.stringify(teams,null,5));
    })
    //     Teams.aggregate([
    //         {
    //             $lookup: {
    //                 from: "players",
    //                 localField: "_id",
    //                 foreignField: "playerId",
    //                 as: "playersInfo"
    //             }
    //
    //         }
    //     ]).allowDiskUse(true)
    //
    //         .exec((err, teams) => {
    //
    //             if (err) {
    //                 res.json({message:"Teams Not Found!",errmsg: err});
    //             }
    //             else {
    //
    //                 for(var i=0;i<teams.teamId.length();i++){
    //                     a +=teams.teamId[i].name;
    //                     a+=" ."
    //                 }
    //                 res.send(JSON.stringify(a,null,5));
    //             }
    //
    //         })
};

//change the number of players
router.changeNumPlayer = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // Teams.findById(req.params.id/*id from request parameters*/, function (err, team) {
    //     if (err)
    //         res.json({message: 'Team NOT Found!', errmsg: err});
    //     else {
    //         if (team != null) {
    Teams.findByIdAndUpdate({"_id": req.params.id}, {$set:{numPlayer: req.body.numPlayer}}, function (err) {
        if (err){
            res.status(404);
            res.json({message: 'Team NOT Change NumPlayer!', errmsg: err});
        }

        else
            res.json({message: 'Team Successfully Change NumPlayer!'});
    });

    //         else
    //             res.json({message: 'Team NOT Found! Please check the right id'});
    //     }
    // });
};

//change the team rank
router.changeRank = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Teams.findByIdAndUpdate({"_id": req.params.id}, {$set:{"rank": req.body.rank}}, function (err,team) {
        if (err){
            res.status(404);
            res.json({message: 'Team NOT ChangeRank!', errmsg: err});
        }

        else
            res.json({message: 'Team Successfully ChangeRank!'});
    });
};

//change playerId
router.changePlayerId = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // Teams.findById(req.params.id/*id from request parameters*/, function (err, team) {
    //     if (err)
    //         res.json({message: 'Team NOT Found!', errmsg: err});
    //     else {
    //         if (team != null) {
    Teams.findByIdAndUpdate({"_id": req.params.id}, {$set:{playerId: req.body.playerId}}, function (err) {
        if (err)

            res.json({message: 'Team NOT Change playerId!', errmsg: err});
        else
            res.json({message: 'Team Successfully Change playerId!'});
    });

    //         else
    //             res.json({message: 'Team NOT Found! Please check the right id'});
    //     }
    // });

};

//delete a team
router.deleteTeam= (req, res) => {

        Teams.findByIdAndRemove(req.params.id, function (err,teams) {
            if (err||teams==null) {
                res.status(404);
                res.json({message: 'Team NOT DELETED!(invalid id)', errmsg: err})
            }
            else
                    res.json({message: 'Team Successfully Deleted!',data:teams});




        });
    };
module.exports = router;