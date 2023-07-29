const fs = require('fs')

const Book = require('../models/book.model')

//Requête pour récupérer tous les livres
exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json( books )) //Retourne un array avec tous les livres
    .catch(err => res.status(400).json({ err }))
}
//Requête pour récupérer les 3 livres les mieux notés
exports.getBestBook = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3) //Récupère tous les livres, les classes par ordre décroissant, garde les 3 premiers
    .then(books => res.status(200).json( books )) //Renvoi un array des 3 livres les mieux notés
    .catch(err => res.status(400).json({ err }))
}
//Requête pour récupérer un livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json( book )) //Renvoi le livre avec l'id fournit
    .catch((err) => res.status(400).json({ err }))
}
//Requête pour ajouter une note à un livre
exports.rateBook = (req, res, next) => {
    const user = req.body.userId
    Book.findOne({ _id: req.params.id }) 
    .then(book => {
        if (book.ratings.find(rating => rating.userId === user)) { //Contrôle si l'utilisateur à déjà noté le livre
            res.status(401).json({ message: 'Livre déjà noté'})
        } else {
            const newRating = { //Création d'un nouvel objet pour la  nouvelle note
                userId: user,
                grade: req.body.rating,
            }
            const updatedRatings = [ //Création d'un nouvel array contenant les notes existantes + la nouvelle
                ...book.ratings,
                newRating
            ]
            const calcAverageRating = (ratings) => {
                const sum = ratings.reduce((total, rate) => total + rate.grade, 0) //Itère l'array "ratings" et additionne toutes les notes 
                const average = sum / ratings.length //Calcul de la moyenne des notes
                return parseFloat(average.toFixed(2)) //Conversion de la valeur en nombre à virgule
            }
            const updateAverageRating = calcAverageRating(updatedRatings)
            Book.findOneAndUpdate(
                {_id: req.params.id, 'ratings.userId': { $ne: user }}, //Recherche du document à mettre à jour selon les conditions, $ne = not equal
                { $push: { ratings: newRating }, averageRating: updateAverageRating }, //Ajout la nouvelle notation et met à jour la note moyenne
                { new: true } //Retourne le document mis à jour
            )
            .then(updatedBook => res.status(201).json( updatedBook ))
            .catch(err => res.status(401).json({ err }))
        }
    })
    .catch(err => res.status(401).json({ err }))
}
//Requête pour ajouter un livre à la base de données
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book) //Conversion de la chaîne de caractère en objet JS
    delete bookObject._id
    delete bookObject._userId
    const book = new Book ({ //Création d'une nouvelle instance du modèle Book
        ...bookObject, //Copie de propriété de bookObject
        userId: req.auth.userId, //Définit le userId
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`, //Définit le chemin de l'image
        averageRating: bookObject.ratings[0].grade //Définit la note du livre
    })
    book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(err => res.status(500).json({ err }))
}
//Requête pour modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? { //Verification si nouveau fichier image
        ...JSON.parse(req.body.book), //Conversion de la chaîne de caractère en objet JS, si true
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp` //Définit le chemin de l'image, si true
    } : { ...req.body } //Récupération des infos du livre, si false
    delete bookObject._userId
    Book.findOne({ _id: req.params.id })
    .then((book) => { //Si promesse résolue
        if (!book || !book.userId == req.auth.userId) { //Vérifie si aucun document n'a été trouvé ou si l'identifiant de l'utilisateur du livre est différent de l'identifiant de l'utilisateur authentifié
            res.status(401).json({ message: 'Non autorisé' }) 
        } else { //Si l'utilisateur est autorisé
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id }) //Met à jour le livre avec les nouvelles infos du livre
            .then(() => res.status(200).json({ message: 'Livre modifié' }))
            .catch(err => res.status(401).json({ err }))
        }
    })
    .catch(err => res.status(400).json({ err }))
}
//Requête pour supprimer un livre de la base de données
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then( book => {
        if (!book || !book.userId == req.auth.userId){ //Vérifie si aucun document n'a été trouvé ou si l'identifiant de l'utilisateur du livre est différent de l'identifiant de l'utilisateur authentifié
            res.status(401).json({ message: 'Non autorisé' })
        } else { //Si l'utilisateur est autorisé
            const filename = book.imageUrl.split('/images/')[1] //Stock le nom de l'image
            fs.unlink(`images/${filename}`, () => { //Supprime le fichier image
                Book.deleteOne({ _id: req.params.id }) //Supprime le document de la base de données
                .then(() => res.status(200).json({ message: 'Livre supprimé' }))
                .catch(err => res.status(401).json({ err }))
            })
        }
    })
    .catch(err => res.status(500).json({ err }))
}