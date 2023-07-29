const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

require('dotenv').config()

//Requête pour créer un utilisateur
exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Hachage du mot de passe, 10 tours de chiffrements
    .then(hash => {
        const user = new User ({ //Création d'une nouvelle instance du modèle User
            email: req.body.email,
            password: hash
        })
        user.save() //Enregistre le nouvel utilisateur dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}
//Requête pour connecter l'utilisateur à son compte
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}) //Cherche l'utilisateur
    .then(user => {
        if (user === null){ //Si utilisateur inexistant 
            res.status(401).json({ message: 'Identifiant ou mot de passe incorrecte'})
        } else {
            bcrypt.compare(req.body.password, user.password) //Compare le mot de passe envoyé et celui stocké 
            .then(valid => {
                if (!valid){ //Si promesse non valide
                    res.status(401).json({ message: 'Identifiant ou mot de passe incorrecte'})
                } else {
                    res.status(200).json({ //Renvoi un objet JSON contenant l'identifiant du user et un token d'authentification 
                        userId: user._id,
                        token: jwt.sign( //Création du token grace à l'id + clé secrète
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '4h' } //Le token expire au bout de 4h
                        )
                    })
                }
            })
            .catch(err => res.status(500).json({ err }))
        }
    })
    .catch(err => res.status(400).json({ err }))
}