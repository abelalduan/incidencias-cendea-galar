const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let incidents = [];
let nextId = 1;

// Cargar datos
try {
  if (fs.existsSync('incidents.json')) {
    const data = fs.readFileSync('incidents.json', 'utf8');
    incidents = JSON.parse(data);
    nextId = Math.max(...incidents.map(i => i.id || 0), 0) + 1;
  }
} catch (e) {
  console.log('Iniciando con base de datos vacía');
}

function saveData() {
  fs.writeFileSync('incidents.json', JSON.stringify(incidents, null, 2));
}

// Rutas HTML
app.get('/', (req, res) => {
  res.send('<h1>API de Incidencias - Cendea de Galar</h1><p><a href="/app">App Móvil</a> | <a href="/admin">Dashboard</a></p>');
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', incidents: incidents.length });
});

// API GET - Obtener todas las incidencias
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

// API POST - Crear nueva incidencia
app.post('/api/incidents', (req, res) => {
  const incident = req.body;
  incident.id = nextId++;
  incident.createdAt = new Date().toISOString();
  incidents.push(incident);
  saveData();
  res.status(201).json(incident);
});

// API PUT - Actualizar incidencia
app.put('/api/incidents/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = incidents.findIndex(i => i.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  
  incidents[index] = { ...incidents[index], ...req.body };
  incidents[index].updatedAt = new Date().toISOString();
  saveData();
  res.json(incidents[index]);
});

// API DELETE - Eliminar incidencia
app.delete('/api/incidents/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = incidents.findIndex(i => i.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  
  const deleted = incidents.splice(index, 1);
  saveData();
  res.json(deleted[0]);
});

// API Stats
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

// API CSV Export
app.get('/api/export/csv', (req, res) => {
  let csv = 'ID,Fecha,Observaciones,Urgencia,Estado,Latitud,Longitud\n';
  incidents.forEach(incident => {
    const fecha = new Date(incident.date).toLocaleString('es-ES');
    const obs = (incident.observations || '').replace(/,/g, ';');
    csv += `${incident.id},"${fecha}","${obs}","${incident.urgency}","${incident.execution}",${incident.latitude},${incident.longitude}\n`;
  });
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=incidencias.csv');
  res.send(csv);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 SERVIDOR ACTIVO EN PUERTO ${PORT}`);
  console.log(`📱 App Móvil: http://localhost:${PORT}/app`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/admin`);
  console.log(`📡 API: http://localhost:${PORT}/api\n`);
});
