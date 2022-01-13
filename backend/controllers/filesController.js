const User = require('../models/User') //IMPORTAMOS LOS MODELOS PARA LA DB
const fs = require('fs')
const crypto = require('crypto')

const filesControllers = {

    uploadFile: async (req, res) => {

        const email = req.body.user

        const user = await User.findOne({ email })

        const { file } = req.files

        const name = file.name
        const id = crypto.randomBytes(10).toString('hex') + "." + name.split(".")[name.split(".").length - 1];
        const fileName = { id: id, name: name }

        let nombre = user.files.map(item => item.name)
        if (nombre.includes(name)) {

            return res.json({ success: false })
        }
        else {
            const ruta = `${__dirname}../../../frontend/public/files/${id}`

            user.files.push(fileName)
            await user.save()

            file.mv(ruta, err => {

                if (err) {
                    return res.json({ success: false })
                }
                res.json({ success: true })
            })
        }
    },

    deleteFile: async (req, res) => {

        const fileDelete = req.params.id
        const email = req.body.email
        const user = await User.findOne({ email })

        let data = user.files.filter(items => items.id !== fileDelete)

        user.files = data
        await user.save()

        fs.unlink(`${__dirname}../../../frontend/public/files/${fileDelete}`, err => {
            if (err) {
                return res.json({ success: false, err })
            }
            res.json({ success: true, mensaje: "Archivo Borrado!" })
        });




    },
    getFiles: async (req, res) => {
        const email = req.body.email
        console.log(req.body)
        const user = await User.findOne({ email })
            .then(response => {
                console.log(response)
                res.json({ success: true, response })
            })



    }

}

module.exports = filesControllers; 