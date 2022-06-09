const Joi = require('joi');

const forgotSchema = Joi.object({
    email: Joi.string()
    .pattern(new RegExp('^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'))
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
})

module.exports = forgotSchema;