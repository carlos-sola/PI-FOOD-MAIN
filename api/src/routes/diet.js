const { Router } = require('express');
const dietController = require ('../controllers/diet');

const router = Router();

router.get('/',dietController.getAll);


module.exports = router;