'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const userSchema = (sequelizeDatabase, DataTypes) => {
  const model = sequelizeDatabase.define('User', {
    username: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    token: {
      // this will happen anytime someon GETS this user model
      type: DataTypes.VIRTUAL,
      get() {
        // looks like this because of the documentation payload {username: 'foo'} and SECRET is secret key
        return jwt.sign({ username: this.username }, SECRET);
      }
    },
  });

  model.beforeCreate(async (user) => {
    // they are creating a new account
    let encryptedPW = await bcrypt.hash(user.password, 10);
    user.password = encryptedPW;
  });

  // Basic AUTH: Validating strings (username, password)
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ username });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }
    throw new Error('Invalid User');
  };

  // Bearer AUTH: Validating a token
  model.authenticateBearer = async (token) => {
    //special method - like a prototype method added to a class
    try {
       // payload is whatever body of data that we are passing around (here are the goods)

      // payload secret
      // this should give us {username: theoreticalUser}
      const payload = jwt.verify(token, SECRET);
      // variable payload is an instance where it deconstructs the payload from the token

      // if it is a real user - we will consider that authenticated or valid and send the user back aka is the user in the database

      //use model to reference the model being used eventually?
      // user finds the username based on the payload and the token
    
      // look through the database for the user and assuming we have one
      const user = await model.findOne({
        where: { username: payload.username },
      });
      // we send it back with the return
      return user;
      // if not they will get null back OR an error
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return model;
};

module.exports = userSchema;