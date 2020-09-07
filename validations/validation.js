const Joi = require("@hapi/joi");

function validateSchema(requestBody) {
  const requestBodySchema = Joi.object().keys({
    id: Joi.number().required(),
    genre: Joi.string().required(),
  });

  const { error } = requestBodySchema.validate(requestBody);

  if (error) {
    return error.details[0].message;
  }
}

function validateDeleteSchema(requestBody) {
 const requestBodyDeleteSchema = Joi.object().keys({
    id: Joi.number().required(),
  });

  const { error } = requestBodyDeleteSchema.validate(requestBody);

  if (error) {
    return error.details[0].message;
  }
}

function validatePostSchema(requestBody) {
  const requestBodyPostSchema = Joi.object().keys({
    genre: Joi.string().required(),
  });
  const { error } = requestBodyPostSchema.validate(requestBody);
  if (error) {
    return error.details[0].message;
  }
}

module.exports = { validateSchema, validateDeleteSchema, validatePostSchema };
