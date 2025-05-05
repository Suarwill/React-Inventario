const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Busca el token en el header 'Authorization: Bearer TOKEN'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token

  if (token == null) {
    // No hay token
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token inválido o expirado
      return res.status(403).json({ error: 'Acceso denegado: Token inválido' });
    }
    req.user = user; // Guarda la información del usuario decodificada (userId y username) en req.user
    next(); // Pasa al siguiente middleware o al controlador
  });
};

module.exports = authenticateToken;