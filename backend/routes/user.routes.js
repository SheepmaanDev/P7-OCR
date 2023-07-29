const express = require('express')
const userCtrl = require('../controllers/user.controller')
const router = express.Router()

//Création des routes avec association des fonctions du contrôleur
router.post('/signup', userCtrl.signUp)
router.post('/login', userCtrl.login)

module.exports = router