var express = require('express');
var router = express.Router();
var movieController = require('../controllers/MovieController')

/* GET users listing. */
router.get('/:name', movieController.getOne);
router.get('/', movieController.getAll);

router.post('/register',movieController.register);
router.put('/update', movieController.update);
router.delete('/delete',movieController.delete);

module.exports = router;
