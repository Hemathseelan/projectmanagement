function success(res, { message = 'Success', data = null, statusCode = 200, meta = null }) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

function error(res, { message = 'Something went wrong', statusCode = 500, errors = null }) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

module.exports = { success, error };
