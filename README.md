# Assignment 2 - Web API - Automated development process.

Name: Yicong Dai

## Overview.
This project can help users to view the basic information of NBA teams and players,which related with each other, and realize the functions to add, delete, update and query operations and sophisticated API target for these models.In addition it has deployed to github. And it finally uses mocha, chai and git to write test cases(included boundary tests) and do API testing for these functions in the mlab database.What is more,it uses continuous integration test on the Travis CI platform..


## API endpoints.
teams：
 + GET /teams - Get all teams.
 + GET /teams/:id - Get a specific team by id
 + GET /teams/name/:name - Get teams which meet the conditions by fuzzy search for name.
 + GET /teams/:id/info - Get player information related to a specific team.
 + POST /teams - Add a new team.
 + PUT /teams/:id/rank - Update the rank of a specific team.
 + PUT /teams/:id/numPlayer - Update the numPlayer of a specific team.
 + DELETE /teams/:id - Delete a specific team by id

players：
 + GET /players - Get all players.
 + GET /players/:name - Get a specific player by name
 + GET /players/name/:name - Get players which meet the conditions by fuzzy search for name.
 + GET /players/position/:position - Get players which meet the conditions by fuzzy search for position.
 + GET /players/:id/info - Get team information related to a specific player.
 + POST /players - Add a new players.
 + PUT /players/:id/salary - Update the salary of a specific players.
 + DELETE /players /:id - Delete a specific players by id

## Continuous Integration and Test results.

. . . URL of the Travis build page for web API

https://travis-ci.org/YicongDai/NBAteamsAPI


. . . URL of published test coverage results on Coveralls

https://coveralls.io/github/YicongDai/NBAteamsAPI




## Extra features.
The project realize build automation(NPM SCRIPTS),continuous integration tested and be published on Coveralls. It used some testing principles:(1) The silent principle; (2) Make expectations about the target state (if relevant) as well as the target result/return value; (3) Normal, Boundary (if relevant) and Error (if relevant) cases; (4) Test case isolation and some nested describe blocks.
