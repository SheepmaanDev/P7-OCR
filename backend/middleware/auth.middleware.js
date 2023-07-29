const jwt = require('jsonwebtoken')

require('dotenv').config()

//Vérification de l'authenticité du token
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1] //Stock le token d'authentification 
        const decodedToken = jwt.verify(token, process.env.TOKEN) //Stock le token décodé si il est valide
        const userId = decodedToken.userId //Stock le "userId" depuis le token décodé
        req.auth = { //Ajoute un nouvel objet "auth" qui contient le userId extrait du token
            userId: userId
        }
        next()
    } catch(err){
        res.status(403).json({ err })
    }
}