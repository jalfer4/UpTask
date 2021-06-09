const Usuarios = require('../models/usuarios');
const enviarEmail = require('../handlers/email');

exports.CrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina : 'Crear cuenta en uptask'
    })
}

exports.formIniciarSesion = (req,res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina : 'Iniciar sesión en uptask',
        error
    })
}

exports.agregarCuenta = async (req, res) => { 
    // leer el valor del input
    const { email, password} = req.body
     
    try{
        // crear usuarios
        await Usuarios.create({
                email,
                password
    });

    //url de validar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    // objeto
    const usuario ={
        email
    }
    // enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Confirma tu cuenta Uptask',
        confirmarUrl,
        archivo: 'confirmar-cuenta'

    })

    // redirigir al usuario
    req.flash('correcto','Enviamos un correo, confirma tu cuenta');
    res.redirect(`/iniciar-sesion`); 
    }catch(error){
        req.flash('error',error.errors.map(error => error.message));
        res.render('crearCuenta', {
            nombrePagina : 'Crear cuenta en uptask',
            mensajes: req.flash(),
            email,
            password
        })
    }
      
     
} 

exports.restablecerPassword = (req, res) => { 
    res.render('reestablecer',{
        nombrePagina: 'Reestablecer tu contraseña'
    })
}

exports.confirmarCuenta = async(req, res) => { 
    const usuario = await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });
    // si no existe el usuario
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    usuario.save();
    
    req.flash('correcto','Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}