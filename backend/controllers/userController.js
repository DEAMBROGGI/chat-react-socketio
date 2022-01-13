const User = require('../models/User') //IMPORTAMOS LOS MODELOS PARA LA DB
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer') //NPM NODEMAILER
const crypto = require('crypto')        //NPM CRYPTO


/*const randomString =  ()=>{
    const len = 8;
    let ranStr = "";
    for(let i = 0;i<len; i++){
        const ch = Math.floor((Math.random()*10)+1)
        ranStr += ch
    }
    return ranStr;
};*/

//
const sendEmail = async (email, uniqueString) => { //FUNCION ENCARGADA DE ENVIAR EL EMAIL

    const transporter = nodemailer.createTransport({ //DEFINIMOS EL TRASPORTE UTILIZANDO NODEMAILER
        host: 'smtp.gmail.com',         //DEFINIMOS LO PARAMETROS NECESARIOS
        port: 465,
        secure: true,
        auth: {
            user: "useremailverifyMindHub@gmail.com",    //DEFINIMOS LOS DATOS DE AUTORIZACION DE NUESTRO PROVEEDOR DE
            pass: "mindhub2021"                          //COREO ELECTRONICO, CONFIGURAR CUAENTAS PARA PERMIR EL USO DE APPS
        }                                               //CONFIGURACIONES DE GMAIL
    })

    // EN ESTA SECCION LOS PARAMETROS DEL MAIL 
    let sender = "useremailverifyMindHub@gmail.com"
    let mailOptions = {
        from: sender,    //DE QUIEN
        to: email,       //A QUIEN
        subject: "Verificacion de email usuario ", //EL ASUNTO Y EN HTML EL TEMPLATE PARA EL CUERPO DE EMAIL Y EL LINK DE VERIFICACION
        html: `Presiona <a href=http://localhost:5000/api/verify/${uniqueString}>aqui</a> para confirma tu email. Gracias`
    };
    await transporter.sendMail(mailOptions, function (error, response) { //SE REALIZA EL ENVIO
        if (error) { console.log(error) }
        else {
            console.log("Mensaje enviado")

        }
    })
};

const userControllers = {

    verifyEmail: async (req, res) => {

        const { uniqueString } = req.params; //EXTRAE EL EL STRING UNICO DEL LINK

        const user = await User.findOne({ uniqueString: uniqueString }) //BUSCA AL USUARIO CORRESPONDIENTE AL LINK
        if (user) {
            user.emailVerified = true //COLOCA EL CAMPO emailVerified en true
            await user.save()
            res.redirect("http://localhost:3001/") //REDIRECCIONA AL USUARIO A UNA RUTA DEFINIDA
            //return  res.json({success:true, response:"Su email se ha verificado correctamente"})
        }
        else { res.json({ success: false, response: "Su email no se ha verificado" }) }
    },

    nuevoUsuario: async (req, res) => {

        let { firstName, lastName, email, password, google, isConected } = req.body.newUser
        console.log(google)
        try {

            const usuarioExiste = await User.findOne({ email }) //BUSCAR SI EL USUARIO YA EXISTE EN DB

            if (usuarioExiste) {
                if (google) { //VERIFICO SI EL USUARIO YA EXISTE Y SI LA NUEVA PETICION PROVIENE DE  CUENTA GOOGLE
                    const contraseñaHasheada = bcryptjs.hashSync(password, 10) //ENCRITAMOS LA CONTRASEÑA
                    usuarioExiste.password = contraseñaHasheada;
                    usuarioExiste.emailVerified = true //ESTABLEZCO LA NO VERIFICACION DEL EMAIL
                    usuarioExiste.google = true
                    usuarioExiste.isConected = false
                    usuarioExiste.save()//GUARDO EL USUARIO EN DB
                    res.json({ success: true, message: "Actualizamos tu signIn para que lo puedas realizar con Google" })
                } else {
                    res.json({ success: false, response: "El nombre de usuario ya esta en uso" })
                }// EN ESTE PUNTO SI EXITE RESPONDE FALSE

            } else {
                //SI EL USUARIO NO ESXITE

                var uniqueString = crypto.randomBytes(15).toString('hex'); //SE GENERA UNA RANDOM STRING

                let emailVerified = false //CREAMOS LA VERIFICACION DE USUARIO

                const contraseñaHasheada = bcryptjs.hashSync(password, 10) //LO CREA Y ENCRIPTA LA CONTRASEÑA

                // CREA UN NUEVO OBJETO DE PERSONAS CON SU USUARIO Y CONTRASEÑA (YA ENCRIPTADA)
                const nuevoUsuario = new User({
                    firstName,
                    lastName,
                    email,
                    password: contraseñaHasheada, //CONTRASEÑA YA ENCRIPTADA
                    uniqueString, //RANDON STRING
                    emailVerified, //BOLEANO DE VERIFICACION
                    google,         //BOLEANO DE CUENTA GOOGLE
                    isConected
                })

                const token = await jwt.sign({ ...nuevoUsuario }, process.env.SECRET_KEY) // CREA UN TOKEN 
                //SE LO ASIGNA AL USUARIO NUEVO
                if (google) { //SI LA PETICION PROVIENE DE CUENTA GOOGLE
                    nuevoUsuario.emailVerified = true; //DOY MAIL POR VERIFICADO
                    nuevoUsuario.google = true
                    nuevoUsuario.isConected = false //MARCO COMO CUENTA GOOGLE
                    await nuevoUsuario.save()
                    res.json({
                        success: true, response: { token, nuevoUsuario }, //RESPONDE CON EL TOKEN Y EL NUEVO USUARIO
                        message: "Felicitaciones se ha creado tu usuario con Google"
                    }) // AGREGAMOS MENSAJE DE VERIFICACION

                } else {//SI NO PROVIENE DE CUENTA GOOGLE
                    emailVerified = false //ESTABLEZCO VERIFICACION COMO FALSE
                    nuevoUsuario.google = false
                    nuevoUsuario.isConected = false
                    await nuevoUsuario.save()
                    await sendEmail(email, uniqueString) //LLAMA A LA FUNCION ENCARGADA DEL ENVIO DEL CORREO ELECTRONICO

                    res.json({
                        success: true, response: { token, nuevoUsuario }, //RESPONDE CON EL TOKEN Y EL NUEVO USUARIO
                        message: "Te enviamos un email para validarlo, por favor verifica tu casilla para completar el signUp "
                    }) // AGREGAMOS MENSAJE DE VERIFICACION
                }
            }
        } catch (error) {
            console.log(error)
            res.json({ success: false, response: null, error: error }) //CAPTURA EL ERROR
        }


    },
    accederACuenta: async (req, res) => {

        const { email, password, google, } = req.body.logedUser

        try {
            const usuarioExiste = await User.findOne({ email })


            if (!usuarioExiste) {// PRIMERO VERIFICA QUE EL USUARIO EXISTA
                res.json({ success: false, error: "El usuario y/o contraseña incorrectos" })

            } else {
                if (usuarioExiste.emailVerified) { //SEGUNDO VERIFICA QUE EL MAIL FUE VERIFICADO
                    let contraseñaCoincide = bcryptjs.compareSync(password, usuarioExiste.password)

                    if (contraseñaCoincide) { //TERERO VERIFICA CONTRASEÑA
                        const token = jwt.sign({ ...usuarioExiste }, process.env.SECRET_KEY)
                        userData = {
                            firstName: usuarioExiste.firstName,
                            lastName: usuarioExiste.lastName,
                            email: usuarioExiste.email,


                        }
                        usuarioExiste.isConected = true // Pasamos isConected = true
                        await usuarioExiste.save()

                        res.json({ success: true, response: { token, userData }, error: null })


                    } else {
                        if (!usuarioExiste.google && google) {
                            return res.json({ success: false, error: "No te registraste con Google, por favor has el SigUp con tu cuenta Google, si quieres acceder con ella" })
                        }
                        if (usuarioExiste.google && !google) {
                            return res.json({ success: false, error: "Te registraste con Google, por favor has el SigIN con tu cuenta Google, si quieres acceder con ella" })
                        }

                        else {
                            return res.json({ success: false, error: "El usuario y/o contraseña incorrectos" })
                        }

                    }
                } else { res.json({ success: false, error: 'Hola verifica tu email para validarlo' }) } //SI NO ESTA VERIFICADO
            }

        } catch (error) {
            console.log(error);
            res.json({ success: false, response: null, error: error })
        }
    },

    cerraSesion: async (req, res) => {
        const email = req.body.closeuser
        const user = await User.findOne({ email })
        user.isConected = false // Pasamos isConected = false
        await user.save()
        res.json(console.log('sesion cerrada ' + email))
    }

}

module.exports = userControllers;