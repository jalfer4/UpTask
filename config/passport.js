const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos a autenthicar.

const Usuarios = require('../models/Usuarios');

// Local strategy - login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        //por defecto usuario y password
        {    
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email,password, done) => {
            try{
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                })
                // usuario existe passdw incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message : 'Credenciales no validas'
                
                    })
                }
                //El email existe, y el passwprd correcto
                return done(null, usuario);
            }catch(error){
                return done(null,false,{
                message : 'Credenciales no validas'
                })
            }
        }
    )  
    
);

// Serializar el usuario

passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})
//desserializar el usuario

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

module.exports = passport;