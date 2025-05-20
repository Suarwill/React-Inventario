const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error al verificar token:', err.message);
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }

    req.user = decoded; // guarda { userId, username, iat, exp }
    next();
  });
};

module.exports = authenticateToken;
