const joi = require('joi')

const validator = (req, res, next) => {
    const schema = joi.object({
        firstName: joi.string().max(20).min(3).trim().pattern(new RegExp('[a-zA-Z]')).required().messages({
            'string.min':'El NOMBRE debe contener mas de 3 caracteres'
        }),
        lastName: joi.string().max(20).min(3).trim().pattern(new RegExp('[a-zA-Z]')).required().messages({
            'string.min':'El APELLIDO debe contener mas de 3 caracteres'
        }),
        email: joi.string().email({ minDomainSegments: 2 }).required().messages({
            'string.email':'Formato incorrecto de email'
        }),
        password: joi.string().required().trim().min(8).max(30).messages({
            'string.min':'El password debe contener minimo 8 caracteres'
        }),
        
        from:joi.string()
    })

    const validation = schema.validate(req.body.newUser, {abortEarly:false})
       console.log(req.body.newUser)
    if (validation.error) {
        
        return res.json({success: false, message:validation.error.details})
    }
    
    next()
    
    
}

module.exports = validator