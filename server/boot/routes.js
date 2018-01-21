// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var dsConfig = require('../datasources.json');
var path = require('path');

module.exports = function(app) {
  var Account = app.models.account;


  //verified
  app.get('/verified', function(req, res) {
    res.render('verified-view');
  });

  //show password reset form
  app.get('/reset-password', function(req, res, next) {
      console.log(req);
    if (!req.accessToken) return res.sendStatus(401);
    res.render('password-reset-view', {
      redirectUrl: '/api/accounts/reset-password?access_token='+
        req.accessToken.id
    });
  });
};
