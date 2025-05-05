const sanitizeInput = (req, res, next) => {
    const sanitize = (str) => {
      if (typeof str !== 'string') return str;
      return str
        .replace(/['"`\\;]/, '')     // quitar comillas, backslash y punto y coma
        .replace(/[<>]/, '')         // quitar tags HTML (prevención XSS básica)
        .trim();
    };
  
    // Revisa y limpia campos comunes
    if (req.body.username) req.body.username = sanitize(req.body.username);
    if (req.body.password) req.body.password = sanitize(req.body.password);
    if (req.query.username) req.query.username = sanitize(req.query.username);
    if (req.params.username) req.params.username = sanitize(req.params.username);
  
    next();
  };
  
  module.exports = sanitizeInput;  