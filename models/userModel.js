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
}