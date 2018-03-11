'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = module.exports = loopback();

// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//app.use(loopback.token());

/**
 * Flash messages for passport
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
var flash      = require('express-flash');



// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);


// attempt to build the providers/passport config
var config = {};
try {
  config = require('../providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;
});


// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true,
}));

// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.TrdAccessToken
}));

app.middleware('session:before', cookieParser('secure-cookie-key'));
app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));

// We need flash messages to see passport errors
app.use(flash());

passportConfigurator.init();


var x = app.models();
passportConfigurator.setupModels({
  userModel: app.models.Account,
  userIdentityModel: app.models.AccountIdentity,
  userCredentialModel: app.models.AccountCredential
});

for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


app.get('/', function(req, res, next) {
  res.render('index-view', {user:
    req.user,
    url: req.url,
  });
});

app.get('/auth/account', ensureLoggedIn('/login'), function(req, res, next) {
  res.redirect(301,'http://localhost:8080/#authcallback?uId='+req.user.id+'&accessToken=' + req.accessToken.id+'&v=1111');
  // res.render('login-profile-view', {
  //   user: req.user,
  //   url: req.url,
  //   accessToken: req.accessToken
  // });
});

app.get('/local', function(req, res, next) {
  res.render('local-view', {
    user: req.user,
    url: req.url,
  });
});

app.get('/ldap', function(req, res, next) {
  res.render('pages/ldap', {
    user: req.user,
    url: req.url,
  });
});

app.get('/signup', function(req, res, next) {
  res.render('signup-view', {
    user: req.user,
    url: req.url,
  });
});

app.post('/signup', function(req, res, next) {
  var User = app.models.Account;

  var newUser = {};
  newUser.email = req.body.email.toLowerCase();
  newUser.username = req.body.username.trim();
  newUser.password = req.body.password;

  User.create(newUser, function(err, user) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    } else {
      // Passport exposes a login() function on req (also aliased as logIn())
      // that can be used to establish a login session. This function is
      // primarily used when users sign up, during which req.login() can
      // be invoked to log in the newly registered user.
      req.login(user, function(err) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        return res.redirect('/auth/account');
      });
    }
  });
});

app.get('/login', function(req, res, next) {
  res.render('login-view', {
    user: req.user,
    url: req.url,
  });
});

app.get('/auth/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

/// start the server if `$ node server.js`
if (require.main === module)
app.start();
