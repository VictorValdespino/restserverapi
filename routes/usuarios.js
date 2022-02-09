/**
 * Configurar utas
 */
const { Router } = require('express'); 
const { check } = require('express-validator');

const { usuariosGet,
      usuariosPut,
      usuariosPost,
      usuariosDelete } = require('../controllers/usuarios');

const { esRolValido,
     emailExiste, 
     existeUsuarioPorID} = require('../helpers/db-validators');

const { validarCampos } = require('../middleware/validar-campos');


const router = Router(); 

router.get('/', usuariosGet);

router.put('/:id', [
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPut );

router.post('/', [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','la contraseña es obligatoria y mas de seis caracteres').isLength({ min:6 }),
    check('correo').custom(emailExiste),
    //validacion desde base de datos
    //error personalizado
    check('rol').custom( esRolValido ),
    //check('rol','no es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    validarCampos
],usuariosPost);

router.delete('/:id', [
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    validarCampos
] ,usuariosDelete);

module.exports = router;




