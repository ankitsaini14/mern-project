const Joi = require('joi');
const { max } = require('./ChangePassword');

const loginSchema = Joi.object({
    email: Joi.string()
        .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "abcd")
        .required(),

    password: Joi.string()
        .regex(/^(?=.*?[A-Z])(?=(.*[a-z])+)(?=(.*[\d])+)(?=(.*[\W])+)(?!.*\s).{8,}$/, "A minimum 8 characters password contains a combination of uppercase and lowercase letter and number are required.")
        .trim()
        .min(8)
        .required(),
})

const validate = (body) => {
    return loginSchema.validate(body);
}

module.exports = validate;