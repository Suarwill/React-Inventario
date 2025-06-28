const { cargarMermas } = require('../services/envio.service');

const cargarMerma = async (req, res) => {
  const mermas = req.body;
  const token = req.user;

  if (!Array.isArray(mermas) || mermas.length === 0) {
    return res.status(400).json({ error: 'Datos de mermas no válidos' });
  }

  try {
    const result = await cargarMermas(mermas, token);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al cargar las mermas:', error);
    res.status(500).json({ error: 'Error al cargar las mermas' });
  }
};

module.exports = {
  cargarMerma
};