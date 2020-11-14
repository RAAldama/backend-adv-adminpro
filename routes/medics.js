//RUTA : /api/medics

const { Router } = require('express');
const { check } = require('express-validator');
const { getMedics, createMedic, updateMedic, deleteMedic } = require('../controllers/medics');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jws');

const router = Router();

router.get('/', getMedics);

router.post('/', [
    validateJWT,
    check('name', 'El nombre del médico es necesario').not().isEmpty(),
    check('hospital', 'El hospital debe de ser un formato válido').isMongoId(),
    validateFields
] , createMedic);

router.put('/:id', [
    validateJWT,
    check('name','El nombre del médico es necesario').not().isEmpty(),
    check('hospital','El hospital debe de ser un formato válido').isMongoId(),
    validateFields
], updateMedic);

router.delete('/:id', validateJWT, deleteMedic);

module.exports = router;