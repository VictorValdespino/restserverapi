const validaRoles = require('../middleware/validar-roles');
const validaCampos = require('../middleware/validar-campos');
const validarJWT= require('../middleware/validar-jwt');
const validarArchivo = require('../middleware/validar-archivo');


module.exports = {
    
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo


}