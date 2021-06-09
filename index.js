const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({path: 'variables.env'});
//Helpers con algunas funcones

const helpers = require('./helpers')
const db = require('./config/db');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
db.sync()
    .then(() => console.log('Conectado el servidor DB'))
    .catch(error=> console.log(error)); 

const app = express();

//Donde cargar los archivos est<ticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//habilitar bodyParcer para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));


// Carpeta de vistas
app.set('views', path.join(__dirname, './views'));


//agregamos flash

app.use(flash());

app.use(cookieParser());

// sessiones nos permiten navegar entre distintas paginas sin volver a autnentcr
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//Pasar var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user};
    next();
});

// crear una app de express
app.use('/', routes());

//servidor y puerto
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});

require('./handlers/email');