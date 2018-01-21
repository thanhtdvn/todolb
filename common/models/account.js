'use strict';


var config = require('../../server/config.json');
var path = require('path');
var senderAddress = "noreply@loopback.com"; //Replace this address with your actual address
module.exports = function(Account) {
    //send verification email after registration
    Account.afterRemote('create', function(context, acc, next) {
    var options = {
      type: 'email',
      to: acc.email,
      from: senderAddress,
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify-view.ejs'),
      redirect: '/verified',
      user: acc
    };

    acc.verify(options, function(err, response) {
      if (err) {
        Account.deleteById(acc.id);
        return next(err);
      }
      context.res.render('response-view', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  //send password reset link when requested
  Account.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
        info.accessToken.id + '">here</a> to reset your password';

      Account.app.models.Email.send({
      to: info.email,
      from: senderAddress,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

  //render UI page after password reset
  Account.afterRemote('setPassword', function(context, acc, next) {
    context.res.render('response-view', {
      title: 'Password reset success',
      content: 'Your password has been reset successfully',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });
};
