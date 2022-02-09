const Role = require('../models/role');
const Usuario = require('../models/usuarios')




const esRolValido = async(rol='') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol){
        throw new Error(`El rol ${rol} no es valido` )
    }
}

 //verificar si el correo existe

const emailExiste = async(correo = '') => {
    
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error(`El email -- ${correo} -- ya existe` )
    }
};

const existeUsuarioPorID = async( id ) => {
    
    const existeID = await Usuario.findById( id );
    if(!existeID){
        throw new Error(`El id -- ${correo} -- no existe` )
    }
};

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorID
}