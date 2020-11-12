//RUTA : api/uploads

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { fileUpload, returnImage } = require('../controllers/uploads');
const { validateJWT } = require('../middlewares/validate-jws');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', [validateJWT], fileUpload);
router.get('/:type/:image', returnImage);

module.exports = router;