'use strict';

const debug = require('debug');
const debugInfo = debug('module: info');
setInterval(() =>{
  debugInfo('some information.');
}, 1000);
const debugError = debug('module: error');
setInterval(()=>{
  debugError('some error.');
}, 1000);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var GITHUB_CRIENT_ID = 'a4735e69133409be4121';
var GITHUB_CRIENT_SECRET = 'da2d183ae5e304f51d843b64305cafd7b80601fd';

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(pbj, done){
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: GITHUB_CRIENT_ID,
  clientSecret: GITHUB_CRIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/github/callback'
},
  function(accessToken, refreshToken, profile, done){
    process.nextTick(function(){
      return done(null, profile);
    });
  }
));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var photosRouter = require('./routes/photos');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: '502b2cce3be97c34', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photos', photosRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email']}),
  function(req,res){

  });

app.get('/auth/github/callback',
  passport.authenticate('github',{ failureRedirect: '/login'}),
    function(req,res){
      res.redirect('/');
    });
app.get('/login', function(req,res){
  res.render('login');
});

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

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
