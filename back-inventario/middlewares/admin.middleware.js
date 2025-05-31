const isAdmin = (req, res, next) => {
  // Se asume que authenticateToken ya se ejecutó y puso req.user
  if (req.user.username === 'ADMIN') {
    next(); // El usuario es admin, continuar
  } else {
    res.status(403).json({ error: 'Acceso denegado: Requiere permisos de administrador' });
  }
};

module.exports = isAdmin;