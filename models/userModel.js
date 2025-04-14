const Datastore = require('gray-nedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserModel {
    constructor() {
        this.db = new Datastore({ filename: 'users.db', autoload: true });
    }

    // Create a new user with hashed password
    createUser(username, password, callback) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return callback(err);
            this.db.insert({ username, password: hash }, callback);
        });
    }
    // Find a user by username
    findUser(username, callback) {
        this.db.find({ username }, (err, docs) => {
          if (err) return callback(err);
      
          // Check if docs is null or empty
          if (!docs || docs.length === 0) {
            return callback(null, null);
          }
      
          callback(null, docs[0]);
        });
      }
}

module.exports = new UserModel('./data/users.db');