const sharp = require('sharp')
const fs = require('fs')

//Optimise les images en les redimensionnant et le convertissant puis supprime
//les images d'origines et enregistre la nouvelle 
const optimizedImg = async (req, res, next) => {
    try{
        await sharp(req.file.path) //Charge l'image
            .resize({ width: 350, height: 500 }) //Redimensionne
            .webp({ quality: 80 }) //Convertit en WebP avec une qualité de 80
            .toFile(`${req.file.path}.webp`) //Enregistre le fichier avec la nouvelle extension

        fs.unlink(req.file.path, (err) => { //Supprime l'image d'origine
                req.file.path = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                if (err){
                    (() => res.status(500).json({ err: 'Impossible de supprimer le fichier' }))
                }
            })
        next()
    } catch (err){
        err => res.status(500).json({ err })
    }

}

module.exports = optimizedImg