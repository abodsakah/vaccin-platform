![Digi vaccin](images/Github%20banner.png)
Digi vaccin is a project i am working on for my university where i have to be a digital vaccin pass.
![example workflow](https://github.com/abodsakah/vaccin-platform/actions/workflows/node.js.yml/badge.svg)
# Tech
- Nodejs: as a backend to the website
- React native: for making the mobile application
- express: as a server for nodejs
- Mysql: as a database
- ejs: as a view engine (may switch to svelte)
- Bcrypt: as encryption for the password
  
# How to use?
- First of all you need to install the npm depencises by running `npm i`
- After that you might need to change the port the app would run on. You can do that by changing in the `index.js`
```js
const port = process.env.PORT || 3500;
```
where the default is port `3500`'
- A importent thing you need to do is to set the database and the database login information. To do that you can run the setup file `sql/db.sql`.
- After setting up the database you have to setup the enviroment for the website to be able to know how to access the database.
To do so you have to create a `config/.env` file.
the file structre should be as so:
```
DB_HOST=[Database adress]
DB_LOGIN=[Database login]
DB_PASSWORD=[Database password]
DB_NAME=[Database name (if you didnt change it in the db.sql file it should be vaccin_app)]
DB_CHAR=utf8mb4
DB_MULTI=[true/false]
```
After that you can just create a test user in the `patient` table and the password is a bcrypt hash, you can use [this website to create the hash](https://bcrypt-generator.com/) the secrete is just a random string.
