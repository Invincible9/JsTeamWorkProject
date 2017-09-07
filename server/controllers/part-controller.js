const mongoose = require('mongoose')
const Part = mongoose.model('Part')

module.exports = {
    createAdPartGET: (req, res) => {
        res.render('parts/createAdPart')
    },

    createAdPartPOST: (req, res) => {
        let reqBody = req.body
        let partName = reqBody.name
        let partPrice = reqBody.price
        let partCondition = reqBody.condition
        let partAvailability = reqBody.availability
        let partPictureURL = reqBody.pictureURL
        let partLocation = reqBody.location
        let partDescription = reqBody.description
        let partAuthor = res.locals.currentUser.id

        Part
            .create({
                name: partName,
                price: partPrice,
                condition: partCondition,
                availability: partAvailability,
                pictureURL: partPictureURL,
                date: Date.now(),
                location: partLocation,
                author: partAuthor,
                description: partDescription
            })
           .then(partAdvert => {

            User
            .findById(partAuthor)
            .then(author => {
                author.partAds.push(partAdvert.id)
                author.save()
            })                

           })
        
        res.redirect('/')
    },

    listAllPartsGET: (req, res) => {
        Part
            .find({})
            .then(parts => {
                res.render('parts/listAllParts', {
                    parts: parts
                })
            })
    },

    getPartById: (req, res) => {
        let partId = req.params.id

        Part
            .findById(partId)
            .populate('author')
            .then(part => {
                res.render('parts/partDetail', {
                    part: part
                })
            })
    }
}
