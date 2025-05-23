const pool = require('../db/pool');

//Se debe recibir token, para la validacion previamente.

const addDeposito = async (req, res) => {
  const { usuarioId, fecha, voucher, monto, comentario } = req.body; // Cambiado a usuarioId
  try {
    // Verificar si el usuario existe
    const idInt = parseInt(usuarioId, 10);
    if (isNaN(idInt)) {
      return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    // Obtener username y sector del usuario
    const { rows: userResult } = await pool.query(
      'SELECT username, sector FROM usuarios WHERE id = $1',
      [idInt]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const username = userResult[0].username;

    // Insertar el nuevo depósito
    const result = await pool.query(
      'INSERT INTO depositos (usuario, fecha, voucher, monto, comentario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, fecha, voucher, monto, comentario]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar el depósito:', error);
    res.status(500).json({ error: 'Error al agregar el depósito' });
  }
};

const getDeposito = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({ error: 'Debe proporcionar un ID de usuario' });
    }

    const idInt = parseInt(id, 10);
    if (isNaN(idInt)) {
      return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    // Obtener username y sector del usuario
    const { rows: userData } = await pool.query(
      'SELECT username, sector FROM usuarios WHERE id = $1',
      [idInt]
    );

    if (userData.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { username, sector } = userData[0];

    // Buscar depósitos por username (VARCHAR) en tabla depositos
    const { rows: userDeposits } = await pool.query(
      'SELECT * FROM depositos WHERE usuario = $1 ORDER BY fecha DESC LIMIT 20',
      [username]
    );

    if (userDeposits.length > 0) {
      return res.status(200).json(userDeposits);
    }

    // Si no tiene depósitos, buscar en el sector (excluyendo al usuario actual)
    const { rows: sectorDeposits } = await pool.query(
      `SELECT * FROM depositos 
       WHERE usuario IN (
         SELECT username FROM usuarios 
         WHERE sector = $1 AND id != $2
       )
       ORDER BY fecha DESC
       LIMIT 20`,
      [sector, idInt]
    );

    res.status(200).json(sectorDeposits);
  } catch (error) {
    console.error('Error al obtener el depósito:', error);
    res.status(500).json({ error: 'Error al obtener el depósito' });
  }
};

const updateDeposito = async (req, res) => {
  const { id } = req.params; // ID del depósito
  const { usuarioId, fecha, monto, comentario } = req.body; // Cambiado a usuarioId
  try {
    // Verificar si el depósito existe
    const { rows: depositoResult } = await pool.query('SELECT * FROM depositos WHERE id = $1', [id]);
    if (depositoResult.length === 0) {
      return res.status(404).json({ error: 'Depósito no encontrado' });
    }

    // Verificar si el usuario existe
    const idInt = parseInt(usuarioId, 10);
    if (isNaN(idInt)) {
      return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    console.log('ID recibido:', idInt);

    // Obtener username del usuario
    const { rows: userResult } = await pool.query(
      'SELECT username FROM usuarios WHERE id = $1',
      [idInt]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const username = userResult[0].username;

    // Actualizar el depósito
    const updatedResult = await pool.query(
      'UPDATE depositos SET usuario = $1, fecha = $2, monto = $3, comentario = $4 WHERE id = $5 RETURNING *',
      [username, fecha, monto, comentario, id]
    );
    res.status(200).json(updatedResult.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el depósito:', error);
    res.status(500).json({ error: 'Error al actualizar el depósito' });
  }
};

const deleteDeposito = async (req, res) => {
  const { id } = req.params; // ID del depósito
  const { usuarioId } = req.body; // Cambiado a usuarioId
  try {
    // Verificar si el depósito existe
    const { rows: depositoResult } = await pool.query('SELECT * FROM depositos WHERE id = $1', [id]);
    if (depositoResult.length === 0) {
      return res.status(404).json({ error: 'Depósito no encontrado' });
    }

    // Verificar si el usuario existe
    // Verificar si el usuario existe
    const idInt = parseInt(usuarioId, 10);
    if (isNaN(idInt)) {
      return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    console.log('ID recibido:', idInt);

    // Obtener username del usuario
    const { rows: userResult } = await pool.query(
      'SELECT username FROM usuarios WHERE id = $1',
      [idInt]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar el depósito
    await pool.query('DELETE FROM depositos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el depósito:', error);
    res.status(500).json({ error: 'Error al eliminar el depósito' });
  }
};

module.exports = {
  addDeposito,
  getDeposito,
  updateDeposito,
  deleteDeposito,
};