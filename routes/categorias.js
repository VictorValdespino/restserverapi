const { Router } = require('express'); 
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, updateCategory, deleteCategory } = require('../controllers/categorias');
const { existeCategoriaPorID } = require('../helpers/db-validators');

const {validarJWT, validarCampos, tieneRole} = require('../middleware')

const router = Router(); 

//Obtener categotias
router.get('/',obtenerCategorias);

//categoria por ID
//middleware personalizado para validar id
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorID),
    validarCampos
],obtenerCategoria);

//Crear categoria - privado - cualquier persona con un token valido

router.post('/',[ 
    validarJWT,
    check('nombre','El nombre es obligatirio').not().isEmpty(),
    validarCampos
],crearCategoria);

//Actualizar - privado - cualquier persona con un token valido

router.put('/:id',[
    validarJWT,
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorID),
    check('nombre','El nombre es obligatirio').not().isEmpty(),
    validarCampos
],updateCategory);


//Borrar categoria - admin
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorID),
    validarCampos
],deleteCategory)


module.exports = router;