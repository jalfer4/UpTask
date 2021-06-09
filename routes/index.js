// JavaScript source code
const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check'); 
const proyectosController = require('../controllers/proyectoControllers.js');
const tareasController = require('../controllers/tareasControllers.js');
const usuariosController = require('../controllers/usuariosControllers.js');
const authController = require('../controllers/authControllers');

module.exports = function() {

    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
     ); 

    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.nuevoProyecto
        ); 
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.insertarNuevoProyecto
    );

    //Listar Proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );
    
    //Actualizar proyecto
    router.get('/proyectos/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.editarProyecto
    );

    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.ActualizarProyecto
    );

    //Eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    //Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    //Actualizar tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

     //Eliminar tarea
     router.delete('/tareas/:id',   
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

     //Crear cuenta
     router.get('/crear-cuenta', usuariosController.CrearCuenta);

     //Insertar Cuenta
     router.post('/crear-cuenta', usuariosController.agregarCuenta);
     //confirmar tu cuenta
     router.get('/confirmar/:correo',usuariosController.confirmarCuenta); 
     //Iniciar sesión
     router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
     router.post('/iniciar-sesion', authController.autenticarUsuario);
     //Cerrar session
     router.get('/cerrar-sesion',authController.cerrarSesion);
    //Restablecer contraseña
     router.get('/reestablecer', usuariosController.restablecerPassword);
     router.post('/reestablecer', authController.enviarToken);
     router.get('/reestablecer/:token', authController.validarToken);
     router.post('/reestablecer/:token', authController.actualizarPassword);
    return router;
}