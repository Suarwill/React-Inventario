const sanitizeInput = (req, res, next) => {
  const sanitize = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/['"`\\;]/g, '') // eliminar comillas, backslash, punto y coma
      .replace(/[<>]/g, '')     // eliminar etiquetas HTML
      .trim();
  };

  // Comprobaciones defensivas antes de acceder a propiedades
  if (req.body && req.body.username) req.body.username = sanitize(req.body.username);
  if (req.body && req.body.password) req.body.password = sanitize(req.body.password);
  
  if (req.query && req.query.username) req.query.username = sanitize(req.query.username);
  
  if (req.params && req.params.username) req.params.username = sanitize(req.params.username);

  next();
};

module.exports = sanitizeInput;
