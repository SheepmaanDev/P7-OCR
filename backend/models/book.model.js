const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

//Création du modèle de livre pour la base de données
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: { type: String, required: true },
        grade: { type: Number, required: true }
    }],
    averageRating: { type: Number, required: true }
})
//Validation de l'unicité
bookSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Book', bookSchema)