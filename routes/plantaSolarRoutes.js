const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Inicializa Firebase Admin SDK (asegúrate de que el archivo JSON de tu clave de servicio esté correctamente configurado)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Rutas para la planta solar

// Obtener todos los datos de la planta solar
router.get('/', async (req, res) => {
  try {
    const db = admin.database();
    const ref = db.ref('planta_solar');
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva planta solar
router.post('/', async (req, res) => {
  try {
    const db = admin.database();
    const ref = db.ref('planta_solar/lecturas');
    const newPlantaSolarRef = ref.push();
    await newPlantaSolarRef.set(req.body);
    res.status(201).json({ message: 'Planta solar creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una planta solar existente
router.put('/:lecturaId', async (req, res) => {
  try {
    const { lecturaId } = req.params;
    const db = admin.database();
    const ref = db.ref(`planta_solar/lecturas/${lecturaId}`);
    await ref.update(req.body);
    res.json({ message: 'Planta solar actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una planta solar
router.delete('/:lecturaId', async (req, res) => {
  try {
    const { lecturaId } = req.params;
    const db = admin.database();
    const ref = db.ref(`planta_solar/lecturas/${lecturaId}`);
    await ref.remove();
    res.json({ message: 'Planta solar eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
