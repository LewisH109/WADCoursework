const Datastore = require('gray-nedb');

class Coursemodel {
    constructor(dbFilePath) {
        this.db = new Datastore({ filename: dbFilePath, autoload: true });
    }

    getAllCourses() {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, courses) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(courses);
                }
            });
        });
    }

    
}