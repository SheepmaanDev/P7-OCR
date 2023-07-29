const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

//Création du modèle d'utilisateur pour la base de données
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})
//Validation de l'unicité
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)