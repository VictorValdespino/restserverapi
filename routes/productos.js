const { Router } = require('express'); 
const { check } = require('express-validator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productos');
const { existeProductoPorID, existeCategoriaPorID } = require('../helpers/db-validators');



const {validarJWT, validarCampos, tieneRole, esAdminRole} = require('../middleware')

const router = Router(); 

//Obtener categotias
router.get('/',getProducts);

//categoria por ID
//middleware personalizado para validar id
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos
],getProduct);

//Crear categoria - privado - cualquier persona con un token valido

router.post('/',[ 
    validarJWT,
    check('nombre','El nombre es obligatirio').not().isEmpty(),
    check('categoria','No es un id correcto').isMongoId(),
    check('categoria').custom(existeCategoriaPorID),
    validarCampos
],createProduct);

//Actualizar - privado - cualquier persona con un token valido

router.put('/:id',[
    validarJWT,
    //check('categoria','No es un id correcto').isMongoId(),
    check('id').custom(existeProductoPorID),    
    validarCampos
],updateProduct);


//Borrar categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos
],deleteProduct)


module.exports = router;