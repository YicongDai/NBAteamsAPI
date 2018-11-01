var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



const teams = require("./routes/teams");
const players = require("./routes/players");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// Our Custom Donation Web App Routes
//teams
app.get('/teams', teams.findAll);

app.get('/teams/:id', teams.findOne);
app.get('/teams/name/:name',teams.findOneByName);

app.get('/teams/:id/info',teams.findAllInformation);
app.post('/teams',teams.addTeam);

app.put('/teams/:id/rank', teams.changeRank);
app.put('/teams/:id/numPlayer', teams.changeNumPlayer);
app.put('/teams/:id/playerId',teams.changePlayerId);
app.delete('/teams/:id', teams.deleteTeam);
//players
app.get('/players', players.findAll);
app.get('/players/:name', players.findOne);
app.get('/players/name/:name',players.findOneByName);
app.get('/players/position/:position',players.findOneByPosition);
app.get('/players/:id/info',players.findTeamInformation);
app.post('/players',players.addPlayer);

app.put('/players/:id/salary', players.changeSalary);
app.put('/players/:id/teamId',players.changeTeamId);
app.delete('/players/:id', players.deletePlayer);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
