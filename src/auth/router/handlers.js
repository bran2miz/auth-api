'use strict';

const { users } = require('../models/index.js');

// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
//IMPORTANT: MUST HAVE TWO TERMINALS RUNNING
async function handleSignup(req, res, next) {
  try {
     // save to my database
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    console.error(e);
    next(e);
  }
}


// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
async function handleSignin(req, res, next) {
  try {
    const user = {
      user: req.user,
      token: req.user.token,
    };
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
}


// using thunder client us the /users route and in Bearers copy and paste token to that text box. Make sure to switch to a GET request
async function handleGetUsers(req, res, next) {
  try {
    const userRecords = await users.findAll({});
    const list = userRecords.map((user) => user.username);
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

function handleSecret(req, res, next) {
  res.status(200).send('Welcome to the secret area!');
}

module.exports = {
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret,
};