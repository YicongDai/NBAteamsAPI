import chai from 'chai';
import chaiHttp from 'chai-http' ;
var server = null;
let expect = chai.expect;
import _ from 'lodash';
import things from 'chai-things'
chai.use( things);
chai.use(chaiHttp);

describe('Teams', function (){
    before(function(){
        delete require.cache[require.resolve('../../bin/www')];
        server = require('../../bin/www');
    });
    after(function (done) {
        server.close(done);
    });
    describe('GET api', function () {
        describe('GET /teams', () => {
            it('should return all the teams in an array', function (done) {
                chai.request(server)
                    .get('/teams')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(4);
                        let result = _.map(res.body, (teams) => {
                            return {name: teams.name, city: teams.city}
                        });
                        expect(result).to.include({name: "Los Angeles Lakers", city: "Los Angeles"});
                        expect(result).to.include({name: "Cleveland Cavaliers", city: "Cleveland"});
                        expect(result).to.include({name: "Los Angeles Cippers", city: "Los Angeles "});
                        expect(result).to.include({name: "Golden State Warriors", city: "Oakland"});
                        done();
                    });
            });
        });

        describe('GET /teams/:id', function () {
            describe('When id is valid', function () {
                it('should return the specific team', function (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function (err, res) {
                            chai.request(server)
                                .get('/teams/' + res.body[3]._id)
                                .end(function (err, res) {
                                    expect(res).to.have.status(200);
                                    expect(res.body).to.be.a('Object');
                                    expect(res.body).include({name: "Golden State Warriors", city: "Oakland"});
                                    done();
                                });
                        });
                });
            });
            describe('When id is invalid', function () {
                it('should return  a 404 and a message for invalid team id', function (done) {
                    chai.request(server)
                        .get('/teams/' + "aabbcc")
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Team NOT Found! Please check the right id');
                            done();
                        });
                });
            });
        });

        describe('GET /names/:name', () => {
            describe('When keyword is valid', function () {
                it('should return the specific team with fuzzy search', function (done) {
                    chai.request(server)
                        .get('/teams/name' + "/Los")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('array');
                            expect(res.body.length).to.equal(2);
                            let result = _.map(res.body, (teams) => {
                                return {name: teams.name}
                            });
                            expect(result).to.include({name: "Los Angeles Cippers"});
                            expect(result).to.include({name: "Los Angeles Lakers"});
                            done();
                        });
                });
            });
            describe('When keyword is invalid', function () {
                it('should return  a 404 and a message for invalid keyword', function (done) {
                    chai.request(server)
                        .get('/teams/name' + "/aabbcc")
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Teams Not Found!(invalid keyword)');
                            done();
                        });
                });
            });
        });

        describe('GET /:id/info', () => {
            it('should return the specific player related to player schema', function (done) {
                chai.request(server)
                    .get('/teams')
                    .end(function (err, res) {
                        chai.request(server)
                            .get('/teams/' + res.body[2]._id + "/info")
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.be.a('object');
                                expect(res.body).to.have.property("message", 'Team Successfully find player!');
                                expect(res.body).to.have.property("data");
                                expect(res.body.data).to.have.property("playerId");
                                expect(res.body.data.playerId).be.a('array');
                                expect(res.body.data.playerId[0]).include({name: "Avery Bradley"});
                                done();
                            });
                    });
            });
        });
    });

    describe('POST api', function () {
        describe('POST /teams', function () {
            it('should return confirmation message', function (done) {
                let team = {
                    name: "Houston Rockets",
                    city: "Houston",
                    zone: {name: "Center Division", location: "West"},
                    numPlayer: 20,
                    championships: 0,
                    rank: 1,
                    playerId: [
                        "5bce36630255713614faa895"
                    ]
                };
                chai.request(server)
                    .post('/teams')
                    .send(team)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Team Added Successfully!');
                        done();
                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/teams')
                    .end(function (err, res) {
                        let result = _.map(res.body, (team) => {
                            return {
                                name: team.name,
                                city: team.city
                            };
                        });
                        expect(result).to.include({name: 'Houston Rockets', city: "Houston"});
                        done();
                    });
            });  // end-after
        }); // end-describe
    });

    describe('PUT api',function(){
        describe('PUT /teams/:id/rank', () => {
            describe('When id is valid', function () {
                it('should return a message and the rank changed', function (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function (err, res) {
                            let rank = {rank: 111};
                            chai.request(server)
                                .put('/teams/' + res.body[4]._id + '/rank')
                                .send(rank)
                                .end(function (error, response) {
                                    expect(response).to.have.status(200);
                                    expect(response.body).to.be.a('object');
                                    expect(response.body).to.have.property('message').equal('Team Successfully ChangeRank!');
                                    done()
                                });
                        });
                });
                after(function (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function (err, res) {

                            expect(res.body[4].rank).equal(111);
                            done();
                        });
                });  // end-after
            }); // end-describe
            describe('When id is invalid', function () {
                it('should return a 404 and a message for invalid team id', function (done) {
                    let rank = {rank: 111};
                    chai.request(server)
                        .put('/teams/assad/rank')
                        .send(rank)
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Team NOT ChangeRank!');
                            done();
                        });
                });
            });
            // describe('When value is invalid', function () {
            //     it('should return a 404 and a message for invalid value', function (done) {
            //         chai.request(server)
            //             .get('/teams')
            //             .end(function (err, res) {
            //                 let rank = {rank: -1};
            //                 chai.request(server)
            //                     .put('/teams' + res.body[4]._id + '/rank')
            //                     .send(rank)
            //                     .end(function (err, res) {
            //                         expect(res).to.have.status(404);
            //                         expect(res.body).to.have.property('message', 'Team NOT ChangeRank!(invalid value for rank)');
            //                         done();
            //                     });
            //             });
            //     });
            // });
        });

        describe('PUT /teams/:id/numPlayer', () => {
            describe('When id is valid', function () {
                it('should return a message and the nunmPlayer changed', function (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function (err, res) {
                            let numPlayer = {numPlayer: 201};
                            chai.request(server)
                                .put('/teams/' + res.body[4]._id + '/numPlayer')
                                .send(numPlayer)
                                .end(function (error, response) {
                                    expect(response).to.have.status(200);
                                    expect(response.body).to.be.a('object');
                                    expect(response.body).to.have.property('message').equal('Team Successfully Change NumPlayer!');
                                    done()
                                });
                        });
                });
                after(function (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function (err, res) {

                            expect(res.body[4].numPlayer).equal(201);
                            done();
                        });
                });  // end-after
            }); // end-describe
        });

        describe('When id is invalid', function () {
            it('should return a 404 and a message for invalid team id', function (done) {
                let numPlayer={numPlayer:201};
                chai.request(server)
                    .put('/teams/assad/numPlayer')
                    .send(numPlayer)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message', 'Team NOT Change NumPlayer!');
                        done();
                    });
            });
        });
    });

    describe('DELETE api',function(){
        describe('delete /teams/:id',  function () {
            describe('When id is valid', function () {
                it('should return a message and delete a specific team', function (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function (err, res) {
                            chai.request(server)
                                .delete('/teams/' + res.body[4]._id)
                                .end(function (error, response) {
                                    expect(response).to.have.status(200);
                                    expect(response.body).to.have.property('message').equal('Team Successfully Deleted!');
                                    done();
                                });
                        });
                });
                after(function  (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function(err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('array');
                            let result = _.map(res.body, (teams) => {
                                return {name: teams.name, city: teams.city}
                            });
                            expect(result).to.not.include({name: 'Houston Rockets', city: "Houston"});
                            done();
                        });
                });  // end-after
            }); // end-describe
            describe('When id is invalid',function (){
                it('should return a 404 and a message for invalid team id', function(done) {
                    chai.request(server)
                        .delete('/teams/asfsaf')
                        .end(function(err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message','Team NOT DELETED!(invalid id)' ) ;
                            done();
                        });

                });
            });
        });
    });
});
