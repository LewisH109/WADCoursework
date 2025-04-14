const Datastore = require('gray-nedb');

class CourseModel {
    constructor(dbFilePath) {
        this.db = new Datastore({ filename: dbFilePath, autoload: true });
    }

    // Method to retrieve a course 
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

    //Add a new course
    addCourse(course, callback) {
        this.db.insert(course, callback);
    }
}

module.exports = new CourseModel('./data/course.db');