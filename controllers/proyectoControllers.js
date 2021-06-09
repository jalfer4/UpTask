const slug = require('slug');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {

    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    res.render('index', {
    nombrePagina:'Proyectos',
    proyectos
    });
} 

exports.nuevoProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});
    res.render('nuevo-proyecto', {
        nombrePagina: 'Nuevo protecto',
        proyectos
    });
} 

exports.insertarNuevoProyecto = async(req, res) => {
//enviar datos de formulario nuevo proyecto
//console.log(req.body);
    
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({'texto':'Se requiere un nombre'})
    }

    // si hay errores
    if (errores.length > 0) {
        res.render('nuevo-proyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        })
    }
    else {
        const usuarioId = res.locals.usuario.id
        const proyecto = await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');

    }

} 

exports.proyectoPorUrl = async (req,res,next) => {

    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where: { usuarioId  }});
    const proyectoPromise =   Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
      
    // Consultar tareas del proeycto actual
    const tareas = await Tareas.findAll({
        where:{ proyectoId : proyecto.id} 
    });
     
    //console.log(tareas);
    
    if(!proyecto) return next();

    //Render a la vista
    res.render('tareas',{
        nombrePagina:'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.editarProyecto = async(req,res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectosPromise =  Proyectos.findAll({where: { usuarioId  }});
    const proyectoPromise =   Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
    res.render('nuevo-proyecto',{
        nombrePagina:'editar proyecto',
        proyecto,
        proyectos
     });

}

exports.ActualizarProyecto = async(req, res) => {
    //enviar datos de formulario nuevo proyecto
    //console.log(req.body);
        const usuarioId = res.locals.usuario.id
        const proyectos = await Proyectos.findAll({where: { usuarioId  }});
        const { nombre } = req.body;
        let errores = [];
    
        if (!nombre) {
            errores.push({'texto':'Se requiere un nombre'})
        }
    
        // si hay errores
        if (errores.length > 0) {
            res.render('nuevo-proyecto', {
                nombrePagina: 'Nuevo proyecto',
                errores,
                proyectos
            })
        }
        else {
    //insertar datos a DB
            //Proyectos.create({ nombre })
            //    .then(() => console.log('Insertado'))
            //    .catch(error=> console.log(error));
            //const url = slug(nombre).toLowerCase();
            await Proyectos.update(
                { nombre },
                { where: {id: req.params.id}}
                );
            res.redirect('/');
    
        }
    
    } 

exports.eliminarProyecto = async(req,res,next) =>{
const {urlProyecto} = req.query;
const resultado = await Proyectos.destroy({where: {url:urlProyecto}});
if(!resultado){
    return next();
}

res.status(200).send('Proyecto eliminado correctamente');
}