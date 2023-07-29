const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')
const multer = require('../middleware/multer-config.middleware')
const sharp = require('../middleware/sharp-config.middleware')

const bookCtrl = require('../controllers/book.controller')

//Création des routes avec association des fonctions du contrôleur et des middlewares 
router.get('/', bookCtrl.getAllBook)
router.get('/bestrating', bookCtrl.getBestBook)
router.get('/:id', bookCtrl.getOneBook)
router.post('/:id/rating', auth, bookCtrl.rateBook)
router.post('/', auth, multer, sharp, bookCtrl.createBook)
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router