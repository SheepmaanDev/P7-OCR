const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('./middleware/cors.middleware')
const userRoutes = require('./routes/user.routes')
const bookRoutes = require('./routes/book.routes')

const app = express()

require('dotenv').config()
//Connection à la base de données
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.ajujwk7.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))

//Middleware pour gérer les autorisations CORS
app.use(cors)
//Middleware pour analyser le corps des requêtes au format JSON
app.use(express.json())
//Routages
app.use('/api/auth', userRoutes)
app.use('/api/books', bookRoutes)
//Middleware pour servir des fichiers statiques à partir du dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app