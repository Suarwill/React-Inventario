const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 100, // Máximo de 100 solicitudes por IP
    message: 'Demasiadas solicitudes desde esta IP, por favor inténtelo más tarde.',
});

module.exports = limiter;