let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'))
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Teams', function (){
      describe('GET /teams', () => {
            it('should return all the teams in an array', function (done) {
                chai.request(server)
                    .get('/teams')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(4);
                        let result = _.map(res.body, (teams) => {
                            return { name: teams.name ,city:teams.city}
                        });
                        expect(result).to.include({name: "Los Angeles Lakers", city: "Los Angeles"});
                        expect(result).to.include({name: "Cleveland Cavaliers", city: "Cleveland"});
                        expect(result).to.include({name: "Los Angeles Cippers", city: "Los Angeles "});
                        expect(result).to.include({name: "Golden State Warriors", city: "Oakland"});
                        done();
                    });
            });
        });

    describe('GET /teams/:id', function(){
        describe('When id is valid',function () {
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
        describe('When id is invalid',function () {
            it('should return  a 404 and a message for invalid team id', function (done) {
                chai.request(server)
                    .get('/teams/' + "aabbcc")
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Team NOT Found! Please check the right id' ) ;
                        done();
                    });
            });
        });
    });

    describe('GET /names/:name', () => {
        describe('When keyword is valid',function () {
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
        describe('When keywprd is invalid',function () {
            it('should return  a 404 and a message for invalid keyword', function (done) {
                chai.request(server)
                    .get('/teams/name' + "/aabbcc")
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Teams Not Found!(invalid keyword)' ) ;
                        done();
                    });
            });
        });
    })

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
                            expect(res.body).to.have.property("message",'Team Successfully find player!');
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