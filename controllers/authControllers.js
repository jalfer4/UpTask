const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('Sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash: true
});

exports.usuarioAutenticado =(req, res, next) => {
    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    //Si no esta auntenticado, redirigir al cformulario
    return res.redirect('/iniciar-sesion');
}
// Cerrar sesion
exports.cerrarSesion = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

exports.enviarToken = async (req,res) =>{
    //Verificar que el usuario existe
    const usuario = await Usuarios.findOne({where: {email:  req.body.email}});

    // si el usuario no existe
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer');
    }

    //usuario existe
    //Crear token
    usuario.token = crypto.randomBytes(20).toString('hex');
    //Expiracion
    usuario.expiracion = Date.now() + 3600000

    // Almacenar cambios

    usuario.save();
    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    // enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Reestablecer contraseña',
        resetUrl,
        archivo: 'reestablecer-password'

    })

    req.flash('correcto', 'Se envio un mensaje a tu direccion de correo electronico');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async (req,res) =>{
    const usuario = await Usuarios.findOne({
    where: {
        token: req.params.token
    }
    }) ;

    //Si no encuentra el usuario

    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    //Formulario para generar el password
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer contraseña'   
    })
}

exports.actualizarPassword = async (req,res) =>{
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
        }) ;

        // Verificamos si el usiario existe
        if(!usuario){
            req.flash('error', 'No valido');
            res.redirect('/reestablecer');
        }
        // hashear el nuevo password
        usuario.token = null;
        usuario.expiracion = null;
        usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

        //Guardamos el nievo password
        await usuario.save();
        req.flash('correcto', 'Tu contraseña se ha modificado correctamente');
        res.redirect('/iniciar-sesion');

}