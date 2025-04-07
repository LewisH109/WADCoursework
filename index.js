const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const session = require('express-session');

const app = express();

//Setting up the Mustache templating
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Session managment