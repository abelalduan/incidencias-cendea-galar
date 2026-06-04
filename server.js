const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// ⭐ SERVIR ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'public')));

// Variables para almacenar datos
let incidents = [];
let nextId = 1;

// Cargar datos
try {
  if (fs.existsSync('incidents.json')) {
    incidents = JSON.parse(fs.readFileSync('incidents.json', 'utf8'));
    nextId = Math.max(...incidents.map(i => i.id), 0) + 1;
  }
} catch (e) {
  console.log('Iniciando con base de datos vacía');
}

function saveData() {
  fs.writeFileSync('incidents.json', JSON.stringify(incidents, null, 2));
}

// ===== RUTAS HTML =====

app.get('/', (req, res) => {
  res.send(`
    <html><head><title>Incidencias</title></head>
    <body style="font-family:Arial; padding:2rem">
      <h1>✅ Servidor funcionando</h1>
      <a href="/app" style="display:inline-block; padding:10px 20px; background:blue; color:white; text-decoration:none; margin:10px 0">📱 App</a>
      <a href="/admin" style="display:inline-block; padding:10px 20px; background:green; color:white; text-decoration:none; margin:10px 0">📊 Admin</a>
    </body></html>
  `);
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ===== API - INCIDENCIAS =====

app.get('/api/incidents', (req, res) => {
  res.json(incidents.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

app.post('/api/incidents', (req, res) => {
  const incident = {
    id: nextId++,
    date: new Date().toISOString(),
    ...req.body,
    latitude: parseFloat(req.body.latitude),
    longitude: parseFloat(req.body.longitude)
  };
  incidents.push(incident);
  saveData();
  res.status(201).json(incident);
});

app.put('/api/incidents/:id', (req, res) => {
  const incident = incidents.find(i => i.id === parseInt(req.params.id));
  if (!incident) return res.status(404).json({ error: 'No encontrado' });
  Object.assign(incident, req.body);
  incident.updatedAt = new Date().toISOString();
  saveData();
  res.json(incident);
});

app.delete('/api/incidents/:id', (req, res) => {
  const index = incidents.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });
  const deleted = incidents.splice(index, 1);
  saveData();
  res.json(deleted[0]);
});

app.get('/api/stats', (req, res) => {
  res.json({
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
  });
});

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', incidents: incidents.length });
});

// ===== INICIAR SERVIDOR (SOLO UNA VEZ) =====

app.listen(PORT, () => {
  console.log(`\n🚀 SERVIDOR ACTIVO`);
  console.log(`📱 App Móvil: http://localhost:${PORT}/app`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🏠 Principal: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api\n`);
});