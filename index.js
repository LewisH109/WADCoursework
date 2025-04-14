const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const courseModel = require('./models/courseModel');
const userModel = require('./models/userModel');
const bcrpypt = require('bcrypt');

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
app.get('/index', (req, res) => {
    res.render('index', { title: 'Welcome to the Dance Booking System' });
});

//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});

//Route to display all courses
app.get('/courses', async (req, res) => {
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
app.post('./organiser/add-course', (req, res) => {
    const { name, duration, schedule, description, loaction, price } = req.body;
    const course = { name, duration, schedule, description, location, price };
    courseModel.addCourse(course, (err, newDoc) => {
        if (err) return res.status(500).send('Error adding course');
        res.redirect('/courses');
    });
});

//Registration (GET)
app.get('/register', (req, res) => {
    res.render('register', { title: 'Regisrer as Organiser'});
});

//Resistration (POST)
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    userModel.findUser(username, (err, user) => {
        if (user) return res.status(400).send('User already exists');
        userModel.createUser(username, password, (err) => {
            if (err) return res.status(500).send('Error creating user');
            res.redirect('/login');
        });
    });
});

//Login (GET)
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login as Organiser' });
});

//Login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    userModel.findUser(username, (err, user) => {
        if (!user) return res.status(400).send('User not found');
        bcrpypt.compare(password, user.password, (err, result) => {
            if (result) {
                req.session.user = user;
                res.redirect('/organiser/dashboard');
            } else {
                res.status(400).send('Invalid password');
            }
        });
    });
});

//Protected Organiser Dashnboard Route
app.get('/organiser/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('dashboard', { title: 'Organiser Dashboard', user: req.session.user });
});