const slug = require('slug');
const Tareas = require('../models/Tareas');
const Proyectos = require('../models/Proyectos'); 

exports.agregarTarea = async(req, res) => { 
    const proyecto = await Proyectos.findOne({where:{url: req.params.url}});
    // leer el valor del input
    const {tarea} = req.body;
    // Estado 0 = incompleto y con Id de proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar en base de datos
    const resultado = await Tareas.create({tarea,estado,proyectoId});

    if(!resultado){

        return next();
    }
    // rediccionar
    res.redirect(`/proyectos/${req.params.url}`);

     
} 

exports.cambiarEstadoTarea = async (req,res) => {
    const { id }  = req.params;

    const tarea = await Tareas.findOne({where: { id }});

    // Cambiar estado
    let estado = 0;

    if(tarea.estado === estado){
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req,res, next) => {
    const { id } = req.params;

    //Eliminar tarea

    const resultado = await Tareas.destroy({where : { id }});

    if(!resultado) return next();

    res.status(200).send("Tarea eliminada correctamente");
}


