//RUTA : /api/hospitals

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitals, createHospial, updateHospital, deleteHospital } = require('../controllers/hospitals');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jws');

const router = Router();

router.get('/', getHospitals);

router.post('/', [
    validateJWT,
    check('name','El nombre del hospital es necesario').not().isEmpty(),
    validateFields
] , createHospial);

router.put('/:id', [
    validateJWT,
    check('name','El nombre del hospital es necesario').not().isEmpty(),
    validateFields
], updateHospital);

router.delete('/:id', validateJWT, deleteHospital);

module.exports = router;