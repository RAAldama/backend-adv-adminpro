//RUTA : api/all

const { Router } = require('express');
const { getAll, getDocumentsCollection } = require('../controllers/search');
const { validateJWT } = require('../middlewares/validate-jws');

const router = Router();

router.get('/:search', [validateJWT], getAll);
router.get('/collection/:table/:search', [validateJWT], getDocumentsCollection);


module.exports = router;