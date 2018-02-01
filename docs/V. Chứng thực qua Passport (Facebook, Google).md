#### Cài đặt
Từ Terminal, chạy command sau để cài đặt `Passport` component và passport-facebook.

```js
npm install loopback-component-passport

npm install passport

npm install passport-facebook 

```
#### Cấu hình

##### Cấu hình providers.json

Cấu hình các xác thực qua các provider trong file `providers.json`

Cấu hình chứng thực qua Facebook

```json
{
    "facebook-login": {
        "provider": "facebook",
        "module": "passport-facebook",
        "profileFields": ["gender", "link", "locale", "name", "timezone",
          "verified", "email", "updated_time"],
        "clientID": "587837131552522",
        "clientSecret": "d17385b3c2c7e9511759629517154cb4",
        "callbackURL": "/auth/facebook/callback",
        "authPath": "/auth/facebook",
        "callbackPath": "/auth/facebook/callback",
        "successRedirect": "/auth/account",
        "failureRedirect": "/login",
        "scope": ["email"],
        "failureFlash": true
    }
}
```

trong đó:

- clientID và clientSecret là thông tin AppID và AppSecret của facebook app tương ứng mà bạn đăng ký dùng để xác thực qua facebook.
- profileFields là các trường thông tin cần lấy từ user's profile và phải được cho phép từ tài khoản facebook.
- scope là facebook scope yêu cầu tài khoản facebook cho phép được truy cập


Để đăng ký 1 facebook app từ `https://developers.facebook.com/apps`.
Trong phần setting của facebook-app, add website với url là url của loopback API `http://localhost:3000` và set `localhost` là domain của fb-app.


##### Models
Ta định nghĩa lại các Passport models và thiết lập quan hệ với model Account của ứng dụng.

Định nghĩa các models: 

AccountCredential kế thừa UserCredential 

``` json
{
  "name": "AccountCredential",
  "plural": "AccountCredentials",
  "base": "UserCredential",
  "properties": {},
  "validations": [],
  "relations": {
    "user": {
      "type": "belongsTo",
      "model": "Account",
      "foreignKey": "userId"
    }
  },
  "acls": [],
  "methods": []
}
```

AccountIdentity kế thừa UserIdentity
```json
{
  "name": "AccountIdentity",
  "plural": "AccountIdentities",
  "base": "UserIdentity",
  "properties": {},
  "validations": [],
  "relations": {
    "user": {
      "type": "belongsTo",
      "model": "Account",
      "foreignKey": "userId"
    }
  },
  "acls": [],
  "methods": []
}
```

3rdAccessToken kế thừa AccessToken
```json
{
  "name": "3rdAccessToken",
  "plural": "3rdAccessTokens",
  "base": "AccessToken",
  "properties": {},
  "validations": [],
  "relations": {
    "user": {
      "type": "belongsTo",
      "model": "Account",
      "foreignKey": "userId"
    }
  },
  "acls": [],
  "methods": []
}
```

Thêm các cấu hình cho các model này trong model-config.json

```json
  "3rdAccessToken": {
    "dataSource": "db",
    "public": false
  },
  "AccountCredential": {
    "dataSource": "db",
    "public": false
  },
  "AccountIdentity": {
    "dataSource": "db",
    "public": false
  }
```


Khai báo các models được sinh ra bởi `loopback-component-passport`  bằng cách thêm `../node_modules/loopback-component-passport/lib/models` vào trong mảng `sources`

##### Cài đặt logic xác thực qua passport cho ứng dụng


Ta cài đặt logic chứng thực qua passport trong file `server/server.js`

trong đó:

- khởi tạo 1 Passport Configurator

``` js
// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);
```

- Load các cấu hình passport provider từ file `providers.json`

``` js

// attempt to build the providers/passport config
var config = {};
try {
  config = require('../providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

```

- Khởi tạo passport
``` js
passportConfigurator.init();
```

- Cài đăt/ khái báo các model liên quan
``` js

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});
```

- Cấu hình passport strategies từ các thiệt lập cho các provider
``` js

for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}
```


Và đây là full-code của server.js

``` js

```

Ngoài ra ta cần cài đặt 1 số component khác:

`express-flash` để có thể hiện thị passport errors

`express-session`

`connect-ensure-login`

`cookie-parser`