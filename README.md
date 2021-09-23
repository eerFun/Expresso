# Hiro
This project created in demand of *Hiro Negar* interview progress, but it can be used as an starter template for **Express** framework.

## Prerequisite
1. Make sure to install [nodejs-lts](https://nodejs.org/en/download/) `v14.x+` on your system.
2. Make sure to install [MongoDB](https://docs.mongodb.com/manual/installation/) `v3.6+` on your system.
3. Clone this project and run this command in the project directory:
```
$ npm install
```
## How To Use
This project is only served locally on `http://localhost:3000` till now. So, to start project use:
```
$ npm start
```

At first, a `superadmin` account will be created. Thus, it is possible to login on the first attempt by:
```
name: super admin
password: 123456
```

> *__Notice 1:__ It is possible to change superadmin `password` from `/config/config.js`.*
>
> *__Notice 2:__ Postman collection exported file is available in the project directory.*

## Todo List
- [ ] Add specific message for validators
- [ ] Add automatic test
- [ ] Add documentation framework for auto generating API docs