const express = require("express");
const cors = require("cors");
require("dotenv").config();
const passport = require('passport')
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const cookie = require('cookie-parser')

app.use(cors({
  origin: process.env.BASE_URL,
  methods: ['POST', 'GET', 'DELETE', 'PUT'],
  credentials: true
}))
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret:'myKey',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./Routes/routes'))

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(4000, () => {
      console.log(`Server started on port 4000`);
    });
  })
