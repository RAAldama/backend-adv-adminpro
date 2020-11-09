//RUTA : /api/users

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jws');

const router = Router();

router.get('/', validateJWT , getUsers);

router.post('/', [ 
    check('name', 'El nombre es obligatorio').not().isEmpty(), 
    check('password', 'La contraseña es obligatoria').not().isEmpty(), 
    check('email', 'El correo es obligatorio').isEmail(), 
    validateFields
] ,createUser);

router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),  
    check('email', 'El correo es obligatorio').isEmail(), 
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validateFields 
], updateUser);

router.delete('/:id', validateJWT, deleteUser);

module.exports = router;