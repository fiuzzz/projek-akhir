const express = require('express');
const app = express();

//Reqiure Routers
const UserRouter = require("./app/api/v1/users/router.js");
const AuthRouter = require("./app/api/v1/auth/router.js");

//Routers
const PeternApi = '/api/v1';
app.use(PeternApi, UserRouter);
app.use(AuthRouter);


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});