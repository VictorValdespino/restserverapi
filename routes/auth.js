const { Router } = require('express'); 
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router(); 

router.post('/login', [
    check('correo','Correo es NECESARIO').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

router.post('/google', [
    check('id_token','ID TOKEN DE GOOGLE ES NECESARIO').not().isEmpty(),
    validarCampos
],googleSignIn);

module.exports = router;