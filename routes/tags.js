// routes/tags.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los tags
router.get('/', (req, res) => {
  db.query('SELECT * FROM tags', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener tags' });
    res.json(results);
  });
});

// Agregar un tag (alta)
router.post('/', (req, res) => {
  const { tag } = req.body;
  if (!tag) return res.status(400).json({ error: 'El campo tag es requerido' });
  db.query('INSERT INTO tags (tag) VALUES (?)', [tag], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al insertar tag' });
    res.json({ id: result.insertId, tag });
  });
});

// Actualizar un tag (modificación)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { tag } = req.body;
  if (!tag) return res.status(400).json({ error: 'El campo tag es requerido' });
  db.query('UPDATE tags SET tag = ? WHERE id = ?', [tag, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar tag' });
    res.json({ id, tag });
  });
});

// Eliminar un tag (baja)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tags WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar tag' });
    res.json({ id, message: 'Tag eliminado' });
  });
});

module.exports = router;
// routes/tags.js
// Este archivo define las rutas para manejar los tags RFID en la base de datos.