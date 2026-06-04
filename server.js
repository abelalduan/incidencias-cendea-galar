const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS mejorado
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Simular base de datos en memoria (cambiar por MongoDB en producción)
let incidents = [];
let nextId = 1;

// Cargar datos al iniciar
function loadData() {
  try {
    if (fs.existsSync('incidents.json')) {
      const data = fs.readFileSync('incidents.json', 'utf8');
      incidents = JSON.parse(data);
      nextId = Math.max(...incidents.map(i => i.id), 0) + 1;
    }
  } catch (e) {
    console.log('No previous data found, starting fresh');
  }
}

// Guardar datos
function saveData() {
  fs.writeFileSync('incidents.json', JSON.stringify(incidents, null, 2));
}

// Cargar datos al iniciar
loadData();

// ===== ENDPOINTS DE LA API =====

// GET: Obtener todas las incidencias
app.get('/api/incidents', (req, res) => {
  const { urgency, execution, search } = req.query;
  let filtered = [...incidents];
  
  if (urgency) filtered = filtered.filter(i => i.urgency === urgency);
  if (execution) filtered = filtered.filter(i => i.execution === execution);
  if (search) {
    filtered = filtered.filter(i => 
      i.observations.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// GET: Obtener una incidencia específica
app.get('/api/incidents/:id', (req, res) => {
  const incident = incidents.find(i => i.id === parseInt(req.params.id));
  if (!incident) return res.status(404).json({ error: 'Incidencia no encontrada' });
  res.json(incident);
});

// POST: Crear nueva incidencia
app.post('/api/incidents', (req, res) => {
  const { photo, latitude, longitude, observations, urgency, execution } = req.body;
  
  if (!photo || !latitude || !longitude || !urgency || !execution) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  
  const incident = {
    id: nextId++,
    date: new Date().toISOString(),
    photo,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    observations,
    urgency,
    execution,
    synced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  incidents.push(incident);
  saveData();
  res.status(201).json(incident);
});

// PUT: Actualizar incidencia
app.put('/api/incidents/:id', (req, res) => {
  const incident = incidents.find(i => i.id === parseInt(req.params.id));
  if (!incident) return res.status(404).json({ error: 'Incidencia no encontrada' });
  
  const { observations, urgency, execution } = req.body;
  if (observations !== undefined) incident.observations = observations;
  if (urgency !== undefined) incident.urgency = urgency;
  if (execution !== undefined) incident.execution = execution;
  incident.updatedAt = new Date().toISOString();
  
  saveData();
  res.json(incident);
});

// DELETE: Eliminar incidencia
app.delete('/api/incidents/:id', (req, res) => {
  const index = incidents.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Incidencia no encontrada' });
  
  const deleted = incidents.splice(index, 1);
  saveData();
  res.json(deleted[0]);
});

// GET: Estadísticas
app.get('/api/stats', (req, res) => {
  const stats = {
    total: incidents.length,
    byUrgency: {
      baja: incidents.filter(i => i.urgency === 'baja').length,
      media: incidents.filter(i => i.urgency === 'media').length,
      alta: incidents.filter(i => i.urgency === 'alta').length
    },
    byExecution: {
      pendiente: incidents.filter(i => i.execution === 'pendiente').length,
      en_progreso: incidents.filter(i => i.execution === 'en_progreso').length,
      completada: incidents.filter(i => i.execution === 'completada').length,
      rechazada: incidents.filter(i => i.execution === 'rechazada').length
    }
  };
  res.json(stats);
});

// GET: Datos para CSV
app.get('/api/export/csv', (req, res) => {
  const headers = ['ID', 'Fecha', 'Urgencia', 'Estado', 'Observaciones', 'Latitud', 'Longitud'];
  const rows = incidents.map(i => [
    i.id,
    new Date(i.date).toLocaleString('es-ES'),
    i.urgency,
    i.execution,
    `"${i.observations.replace(/"/g, '""')}"`,
    i.latitude,
    i.longitude
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=incidencias.csv');
  res.send(csv);
});

// GET: Datos para geolocalización (JSON)
app.get('/api/export/locations', (req, res) => {
  const locations = incidents.map(i => ({
    id: i.id,
    lat: i.latitude,
    lng: i.longitude,
    urgency: i.urgency,
    execution: i.execution,
    observations: i.observations,
    date: i.date
  }));
  res.json(locations);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), incidentsCount: incidents.length });
});

// Servir archivos estáticos
app.use(express.static('public'));

// Rutas específicas para HTML
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Sistema de Incidencias</title>
        <style>
          body { font-family: Arial; padding: 2rem; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
          h1 { color: #185FA5; }
          a { display: inline-block; margin: 10px 0; padding: 10px 20px; background: #185FA5; color: white; text-decoration: none; border-radius: 6px; cursor: pointer; }
          a:hover { background: #0C447C; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Sistema de Incidencias</h1>
          <p>Selecciona dónde quieres ir:</p>
          <a href="/app">📱 App Móvil (Inspectores)</a>
          <a href="/admin">📊 Dashboard (Administrador)</a>
        </div>
      </body>
    </html>
  `);
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor de incidencias corriendo en http://localhost:${PORT}`);
  console.log(`📱 App Móvil: http://localhost:${PORT}/app`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/admin`);
  console.log(`📡 API: http://localhost:${PORT}/api\n`);
});
