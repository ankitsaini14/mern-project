const Joi = require('joi');

const changeSchema = Joi.object({
    otp: Joi.string()
    .pattern(new RegExp('^[\d]{4}$'))
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=(.*[a-z])+)(?=(.*[\d])+)(?=(.*[\W])+)(?!.*\s).{8,}$')),
})


module.exports = changeSchema;