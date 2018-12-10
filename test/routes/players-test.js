import chai from 'chai';
import chaiHttp from 'chai-http' ;
var server = null ;
let expect = chai.expect;
import _ from 'lodash';
import things from 'chai-things'
chai.use( things);
chai.use(chaiHttp);

describe('Players', function () {
    before(function(){
        delete require.cache[require.resolve('../../bin/www')];
        server = require('../../bin/www');
    });
    after(function (done) {
        server.close(done);
    });
    describe('GET api', function () {
        describe('GET /players', () => {
            it('should return all the players in an array', function (done) {
                chai.request(server)
                    .get('/players')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(5);
                        let results = _.map(res.body, (players) => {
                            return {name: players.name}
                        });
                        expect(results).to.include({name: "Stephen Curry"});
                        expect(results).to.include({name: "Kevin Durant"});
                        expect(results).to.include({name: "Avery Bradley"});
                        expect(results).to.include({name: "LeBorn James"});
                        expect(results).to.include({name: "Kevin Love"});
                        done();
                    });
            });
        });

        describe('GET /players/:name', () => {
            describe('When name is valid', function () {
                it('should return the specific player', function (done) {
                    chai.request(server)
                        .get('/players')
                        .end(function (err, res) {
                            chai.request(server)
                                .get('/players/' + res.body[0].name)
                                .end(function (err, res) {
                                    expect(res).to.have.status(200);
                                    expect(res.body).to.be.a('Object');
                                    expect(res.body).include({name: "Stephen Curry"});
                                    done();
                                });
                        });
                });
            });
            describe('When name is invalid', function () {
                it('should return  a 404 and a message for invalid player name', function (done) {
                    chai.request(server)
                        .get('/players' + "/aabbcc")
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Player NOT Found! Please check the right name');
                            done();
                        });
                });
            });
        });

        describe('GET /names/:name', () => {
            describe('When keyword is valid', function () {
                it('should return the specific player with fuzzy search', function (done) {
                    chai.request(server)
                        .get('/players')
                        .end(function (err, res) {
                            chai.request(server)
                                .get('/players/name' + "/s")
                                .end(function (err, res) {
                                    expect(res).to.have.status(200);
                                    expect(res.body).to.be.a('array');
                                    expect(res.body.length).to.equal(2);
                                    let result = _.map(res.body, (teams) => {
                                        return {name: teams.name}
                                    });
                                    expect(result).include({name: "LeBorn James"});
                                    expect(result).include({name: "Stephen Curry"});

                                    done();
                                });
                        });
                });
            });
            describe('When keyword is invalid', function () {
                it('should return  a 404 and a message for invalid keyword', function (done) {
                    chai.request(server)
                        .get('/players/name' + "/aabbcc")
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Players Not Found!(Invalid keyword)');
                            done();
                        });
                });
            });
        });


        describe('GET /position/:position', () => {
            describe('When keyword is valid', function () {
                it('should return the specific player with fuzzy search', function (done) {
                    chai.request(server)
                        .get('/players')
                        .end(function (err, res) {
                            chai.request(server)
                                .get('/players/position' + "/sf")
                                .end(function (err, res) {
                                    expect(res).to.have.status(200);
                                    expect(res.body).to.be.a('array');
                                    expect(res.body.length).to.equal(2);
                                    let result = _.map(res.body, (teams) => {
                                        return {name: teams.name}
                                    });
                                    expect(result).include({name: "LeBorn James"});
                                    expect(result).include({name: "Kevin Durant"});

                                    done();
                                });
                        });
                });
            });
            describe('When keyword is invalid', function () {
                it('should return  a 404 and a message for invalid keyword', function (done) {
                    chai.request(server)
                        .get('/players/name' + "/aabbcc")
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Players Not Found!(Invalid keyword)');
                            done();
                        });
                });
            });
        });


        describe('GET /:id/info', () => {
            it('should return the specific player related to player schema', function (done) {
                chai.request(server)
                    .get('/players')
                    .end(function (err, res) {
                        chai.request(server)
                            .get('/players/' + res.body[0]._id + "/info")
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.be.a('object');
                                expect(res.body).to.have.property("message").equal('Player Successfully find team!');

                                expect(res.body).to.have.property("data");

                                expect(res.body.data).to.have.property("teamId");
                                expect(res.body.data.teamId).be.a('Object');

                                expect(res.body.data.teamId).include({name: "Golden State Warriors"});

                                done();

                            });
                    });
            });
        });
    });

    describe('POST api', function () {
        describe('POST /players', function () {
            it('should return confirmation message', function (done) {
                let player = {
                    name: "Klay Thompson",
                    age: 28,
                    height: 201,
                    weight: 98,
                    nationality: "USA",
                    position: "PG/SG",
                    teamId: "5bd0e6547a18b008fca9f57d",
                    salary: 1899,
                    joinTime: "2011"

                };
                chai.request(server)
                    .post('/players')
                    .send(player)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Player Added Successfully!');
                        done();
                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/players')
                    .end(function (err, res) {
                        let result = _.map(res.body, (player) => {
                            return {
                                name: player.name,
                            };
                        });
                        expect(result).to.include({name: 'Klay Thompson'});
                        done();
                    });
            });  // end-after
        }); // end-describe

    });

    describe('PUT api',function() {
        describe('PUT /players/:id/salary', () => {
            describe('When id is valid', function () {
                it('should return a message and the salary changed', function (done) {
                    chai.request(server)
                        .get('/players')
                        .end(function (err, res) {
                            let salary = {salary: 111};
                            chai.request(server)
                                .put('/players/' + res.body[5]._id + '/salary')
                                .send(salary)
                                .end(function (error, response) {
                                    expect(response).to.have.status(200);
                                    expect(response.body).to.be.a('object');
                                    expect(response.body).to.have.property('message').equal('Player Successfully Change salary!');
                                    done()
                                });
                        });
                });
                after(function (done) {
                    chai.request(server)
                        .get('/players')
                        .end(function (err, res) {

                            expect(res.body[5].salary).equal(111);
                            done();
                        });
                });  // end-after
            }); // end-describe
        });
    });

    describe('DELETE api',function(){
        describe('delete /players/:id',  function () {
            describe('When id is valid', () => {
                it('should delete a specific player', function(done) {
                    chai.request(server)
                        .get('/players')
                        .end(function (err, res) {
                            chai.request(server)
                                .delete('/players/' + res.body[5]._id)
                                .end(function (error, response) {
                                    expect(response).to.have.status(200);

                                    expect(response.body).to.be.a('object');
                                    expect(response.body).to.have.property('message').equal('Player Successfully Deleted!');
                                    done();
                                });
                        });
                });
                after(function  (done) {
                    chai.request(server)
                        .get('/players')
                        .end(function(err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('array');
                            let result = _.map(res.body, (players) => {
                                return {name: players.name}
                            });
                            expect(result).to.not.include({name: 'Klay Thompson'});
                            done();
                        });
                });  // end-after
            }); // end-describe
            describe('When id is invalid',function () {
                it('should return a 404 and a message for invalid player id', function (done) {
                    chai.request(server)
                        .delete('/players/asfsaf')
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Player NOT DELETED!(invalid id)');
                            done();
                        });
                });
            });
        });
    });
});
