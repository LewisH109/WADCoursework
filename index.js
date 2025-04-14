const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const courseModel = require('./models/courseModel');

const app = express();

//Setting up the Mustache templating
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Session managment
app.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
}))

//Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to the Dance Booking System' });
});

//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});

//Route to display all courses
app,get('/courses', async (req, res) => {
    try {
        const courses = await courseModel.getAllCourses();
        res.render('courses', {title: 'Available Dance Courses', courses});
    } catch (err) {
        res.status(500).send('Error retrieving courses');
    }
});

//Route for the organisers to view and add course form
app.get('/organiser/add-course', (req, res) => {
    res.render('add-course', { title: 'Add a New Course' });
});

//Handle Course Creation
