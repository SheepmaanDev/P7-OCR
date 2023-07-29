const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

//Donne la destination de l'image et remplace les espaces par "_"
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') //Spécifie le dossier de destination des fichiers images
    },
    filename: (req, file, callback) => { //Génération du nom du fichier
        const bookObject = JSON.parse(req.body.book) //Conversion de la chaîne de caractère en objet JS
        const title = bookObject.title
        const name = title.split(' ').join('_') //Remplace les espaces par "_"
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + '_' + Date.now() + extension) //Spécifie le nom du fichier
    }
})

module.exports = multer({ storage }).single('image')