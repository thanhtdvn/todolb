# todolb
[Research] ứng dụng Web API viết trên nền tảng loopback

 ## Tạo App và ứng dụng ids/secrets từ các nền tảng

- [facebook](https://developers.facebook.com/apps)
- [google](https://console.developers.google.com/project)
- [twitter](https://apps.twitter.com/)

# Facebook
  ## 1  Tạo App và ứng dụng ids/secrets từ Facebook
  - Truy cập địa chỉ: [facebook](https://developers.facebook.com/apps)
  - Chọn My Apps, sau đó chọn 'new App'
  - Chọn  nền tảng sau [Website]
  - Chọn Danh mục ứng dụng.
  - Điền tên ứng dụng và địa chỉ Website Hoặc `localhost:[port#]` as your "Site URL".
  
        VD: localhost:3000
   ## 2  Tạo file providers.json
   - Sao chép providers.json.template từ providers.json
   - Cập nhật providers.json với thông tin sau.
   
        ``` 
        "facebook-login": {
          "clientID": "xxxxxxxxxxxxxxx",
          "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        }
        "facebook-link": {
          "clientID": "xxxxxxxxxxxxxxx",
          "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
        }
        ``` 
  
 ## 3  Chạy ứng dụng
 ```
$ node .
```

- Mở trình duyệt tại địa chỉ `http://localhost:3000`
- Click chọn  'Login with Facebook'.
