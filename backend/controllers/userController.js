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
            res.redirect("http://localhost:3000/") //REDIRECCIONA AL USUARIO A UNA RUTA DEFINIDA
            //return  res.json({success:true, response:"Su email se ha verificado correctamente"})
        }
        else { res.json({ success: false, response: "Su email no se ha verificado" }) }
    },

    nuevoUsuario: async (req, res) => {

        let { firstName, lastName, email, password, from } = req.body.newUser
        try {
    
            const usuarioExiste = await User.findOne({ email }) //BUSCAR SI EL USUARIO YA EXISTE EN DB
   
            if (usuarioExiste) {
                if (usuarioExiste.from.indexOf(from) !== -1) { //VERIFICO SI EL USUARIO YA EXISTE Y SI LA NUEVA PETICION PROVIENE DE  CUENTA GOOGLE
                    res.json({ success: false, from:"signup", message: "Ya has realizado tu SignUp de esta forma por favor realiza SignIn" })
                } else {
                    const contraseñaHasheada = bcryptjs.hashSync(password, 10)
                    usuarioExiste.from.push(from)
                    usuarioExiste.password.push(contraseñaHasheada) 
                    if(from === "signup"){ 
                        await usuarioExiste.save()
                        await sendEmail(email, usuarioExiste.uniqueString) //LLAMA A LA FUNCION ENCARGADA DEL ENVIO DEL CORREO ELECTRONICO
    
                    res.json({
                        success: true, from:"signup", //RESPONDE CON EL TOKEN Y EL NUEVO USUARIO
                        message: "Te enviamos un email para validarlo, por favor verifica tu casilla para completar el signUp y agregarlo a tus metodos de SignIN "
                    }) 
                    
                    }else{
                    usuarioExiste.save()
                    
                    res.json({ success: true,
                               from:"signup", 
                               message: "Agregamos "+from+ " a tus medios para realizar signIn" })
                }// EN ESTE PUNTO SI EXITE RESPONDE FALSE
            }
            } else {
                //SI EL USUARIO NO ESXITE
               
                const contraseñaHasheada = bcryptjs.hashSync(password, 10) //LO CREA Y ENCRIPTA LA CONTRASEÑA
                // CREA UN NUEVO OBJETO DE PERSONAS CON SU USUARIO Y CONTRASEÑA (YA ENCRIPTADA)
                const nuevoUsuario = await new User({
                    firstName,
                    lastName,
                    email,
                    password:[contraseñaHasheada],
                    uniqueString:crypto.randomBytes(15).toString('hex'),
                    emailVerified:false,
                    from:[from],
                    isConected:false
                })
              
                //SE LO ASIGNA AL USUARIO NUEVO
                if (from !== "signup") { //SI LA PETICION PROVIENE DE CUENTA GOOGLE
                    await nuevoUsuario.save()
                    res.json({
                        success: true, 
                        from:"signup",
                        message: "Felicitaciones se ha creado tu usuario con " +from
                    }) // AGREGAMOS MENSAJE DE VERIFICACION
    
                } else {
                    await nuevoUsuario.save()
                    await sendEmail(email, nuevoUsuario.uniqueString) //LLAMA A LA FUNCION ENCARGADA DEL ENVIO DEL CORREO ELECTRONICO
    
                    res.json({
                        success: true, 
                        from:"sigup",
                        message: "Te enviamos un email para validarlo, por favor verifica tu casilla para completar el signUp "
                    }) // AGREGAMOS MENSAJE DE VERIFICACION
                }
            }
        } catch (error) {
            console.log(error)
            res.json({ success: false, message: "Algo a salido mal intentalo en unos minutos" }) //CAPTURA EL ERROR
        }
    
    
    },
    accederACuenta: async (req, res) => {

        const { email, password,  from } = req.body.logedUser
console.log(from)
        try {
            const usuarioExiste = await User.findOne({ email })


            if (!usuarioExiste) {// PRIMERO VERIFICA QUE EL USUARIO EXISTA
                res.json({ success: false, message: "Tu usuarios no a sido registrado realiza signIn" })

            } else {
                if (from !== "signin") { //SEGUNDO VERIFICA QUE EL MAIL FUE VERIFICADO
                    
                    let contraseñaCoincide =  usuarioExiste.password.filter(pass =>bcryptjs.compareSync(password, pass))
                    
                    if (contraseñaCoincide.length >0) { //TERERO VERIFICA CONTRASEÑA
                        const token = jwt.sign({ ...usuarioExiste }, process.env.SECRET_KEY)
                        console.log(token)
                        const userData = {
                                        firstName: usuarioExiste.firstName,
                                        lastName: usuarioExiste.lastName,
                                        email: usuarioExiste.email,
                                        }
                        usuarioExiste.isConected = true
                        await usuarioExiste.save()

                        res.json({ success: true, 
                                   from:from,
                                   response: { token, userData }, 
                                   message:"Bienvenido nuevamente "+userData.firstName,
                                 })

                    } else {
                        res.json({ success: false, 
                            from: from, 
                            message:"No has realizado el registro con "+from+"si quieres ingresar con este metodo debes hacer el signUp con " +from
                          })
                    }
                } else { 
                    if(usuarioExiste.emailVerified){
                        const token = jwt.sign({ ...usuarioExiste }, process.env.SECRET_KEY)
                        const userData = {
                            firstName: usuarioExiste.firstName,
                            lastName: usuarioExiste.lastName,
                            email: usuarioExiste.email,
                            }
                            console.log(token)
                        res.json({ success: true, 
                            from: from, 
                            response: { token, userData }, 
                            message:"Bienvenido nuevamente "+userData.firstName,
                          })
                    }else{
                        res.json({ success: false, 
                            from: from, 
                            message:"No has verificado tu email, por favor verifica ti casilla de emails para completar tu signUp"
                          }) 
                    }

                } //SI NO ESTA VERIFICADO
            }

        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Algo a salido mal intentalo en unos minutos" })
        }
    },

    cerraSesion: async (req, res) => {
        const email = req.body.closeuser
        const user = await User.findOne({ email })
        user.isConected = false // Pasamos isConected = false
        await user.save()
        res.json(console.log('sesion cerrada ' + email))
    },
    verificarToken:async(req,res)=>{
        const token = req.body.token
        res.json({})
    }
}


module.exports = userControllers;





