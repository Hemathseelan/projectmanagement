const { validationResult } = require('express-validator');
const { error } = require('../utils/response');

function validate(validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
    return error(res, { message: 'Validation failed', statusCode: 422, errors });
  };
}

module.exports = validate;
