const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection String (con contraseña URL-encoded)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://abelalduan_db_user:%40Renovara2026@cluster0.jqriigt.mongodb.net/incidencias?retryWrites=true&w=majority';

// Conectar a MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✓ Conectado a MongoDB'))
.catch(err => console.error('✗ Error MongoDB:', err));

// Schema de incidencia
const incidentSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    photo: String,
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    observations: String,
    urgency: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
    execution: { type: String, enum: ['pendiente', 'en_progreso', 'completada', 'rechazada'], default: 'pendiente' },
    synced: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Incident = mongoose.model('Incident', incidentSchema);

// Rutas API

// GET: obtener todas las incidencias
app.get('/api/incidents', async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 });
        res.json(incidents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: crear nueva incidencia
app.post('/api/incidents', async (req, res) => {
    try {
        const lastIncident = await Incident.findOne().sort({ id: -1 });
        const newId = (lastIncident?.id || 0) + 1;

        const incident = new Incident({
            id: newId,
            ...req.body,
            synced: true
        });

        await incident.save();
        res.status(201).json(incident);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT: actualizar incidencia
app.put('/api/incidents/:id', async (req, res) => {
    try {
        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            { ...req.body, synced: true },
            { new: true }
        );
        res.json(incident);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE: eliminar incidencia
app.delete('/api/incidents/:id', async (req, res) => {
    try {
        await Incident.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET: estadísticas
app.get('/api/stats', async (req, res) => {
    try {
        const total = await Incident.countDocuments();
        const byUrgency = await Incident.aggregate([
            { $group: { _id: '$urgency', count: { $sum: 1 } } }
        ]);
        const byExecution = await Incident.aggregate([
            { $group: { _id: '$execution', count: { $sum: 1 } } }
        ]);

        res.json({ total, byUrgency, byExecution });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: exportar CSV
app.get('/api/export/csv', async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 });
        
        const headers = 'ID,Fecha,Ubicación (Lat),Ubicación (Lng),Descripción,Urgencia,Estado\n';
        const rows = incidents.map(inc => 
            `${inc.id},"${new Date(inc.createdAt).toLocaleString('es-ES')}",${inc.latitude},${inc.longitude},"${inc.observations || ''}",${inc.urgency},${inc.execution}`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="incidencias.csv"');
        res.send(headers + rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Rutas HTML
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Servidor escuchando en puerto ${PORT}`);
    console.log(`📱 App móvil: http://localhost:${PORT}/app`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/admin`);
});
