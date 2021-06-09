const Sequelize = require('sequelize');
const db = require('../config/db'); 
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs');
const Usuarios = db.define('usuarios',{
    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement:true
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate:{
            isEmail:{
                msg:'Se requiere un mail válido'
            }
        },
        unique:{
            args:true,
            msg:'Usuario ya registrado'
        },
        notEmpty:{
            nsg: 'Se requiere un correo electronico'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty:{
                nsg: 'Se requiere una contraseña'
            }
        }
    },
    activo:{
        type:Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
},
{
hooks:{
    beforeCreate(usuario){
        usuario.password = bcrypt.hashSync(usuario.password,bcrypt.genSaltSync(10));
    }
}
});

// Metodo personalizado

Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
