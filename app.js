var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var hbs = require('hbs');
var fs = require('fs');

var routes = require('./routes/index');
var iecs = require('./routes/iecs');
var owls = require('./routes/owls');
var sched = require('./routes/sched');
var findowl = require('./routes/findowl');
var admin= require('./routes/admin');

var app = express();

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine','hbs');
app.set('views', __dirname+"/views");
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
    secret: 'I need a seret and I jus5t misspelled it so@ it should$ be betTer?',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/iec', iecs);
app.use('/owls',owls);
app.use('/owl',owls);
app.use('/schedule',sched);
app.use('/find-an-owl',findowl);
app.use('/findanowl',findowl);
app.use('/admin',admin);


var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CampusOwl');



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var handles = {message: err.message,
      error: err,};
      if (err.status == 404){
        handles.e404 = true;
      } 
    res.render('error', handles);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var handles = {
    message: err.message,
    error: {}
  };
  if (err.status == 404){
        handles.e404 = true;
      } 
  res.render('error',handles);
});

  
module.exports = app;
