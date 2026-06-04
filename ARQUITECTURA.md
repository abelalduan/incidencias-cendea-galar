# 🏗️ Arquitectura del Sistema de Incidencias

## 📋 Descripción General

Sistema full-stack para captura y gestión de incidencias de campo con:
- **Frontend móvil**: PWA (Progressive Web App) con sincronización offline
- **Backend**: API REST con Node.js/Express
- **Admin**: Dashboard interactivo con mapas y exportación
- **Base de datos**: JSON (desarrollo) o MongoDB (producción)

---

## 🔧 Componentes Técnicos

### 1. Backend (server.js)

**Tecnología**: Express.js

**Responsabilidades**:
- Servir API REST
- Almacenar incidencias (JSON o MongoDB)
- Generar reportes (CSV, estadísticas)
- Manejo de CORS para acceso móvil

**Endpoints clave**:
```
GET    /api/incidents              # Listar todas las incidencias
POST   /api/incidents              # Crear nueva incidencia
PUT    /api/incidents/:id          # Actualizar incidencia
DELETE /api/incidents/:id          # Eliminar incidencia
GET    /api/stats                  # Obtener estadísticas
GET    /api/export/csv             # Exportar CSV
GET    /api/export/locations       # Obtener coordenadas GeoJSON
GET    /api/health                 # Verificar estado del servidor
```

**Almacenamiento**:
- Desarrollo: `incidents.json` (archivo local)
- Producción: MongoDB Atlas (gratuito)

---

### 2. App Móvil (app-movil.html)

**Tecnología**: HTML5 + JavaScript vanilla + IndexedDB

**Características**:
- Captura de foto con cámara del dispositivo
- Obtención de ubicación GPS en tiempo real
- Almacenamiento local con IndexedDB
- Sincronización automática cuando hay conexión
- Funciona 100% offline
- Instalable como app nativa

**Flujo de datos**:
```
Usuario Captura Foto → Se comprime en Base64
                    ↓
Usuario autoriza GPS → Se obtienen coordenadas
                    ↓
Completa formulario → Se guardan en IndexedDB (local)
                    ↓
¿Hay conexión? → SÍ: Se envía al servidor
              → NO: Se guarda como "pendiente"
                    ↓
Sincronización automática cuando vuelve la conexión
```

**Base de datos local (IndexedDB)**:
```javascript
{
  localId: 1,           // ID local único
  serverId: 123,        // ID en servidor (después de sincronizar)
  date: "2024-01-15T...",
  photo: "data:image/jpeg;base64,...",
  latitude: 42.8125,
  longitude: -1.6458,
  observations: "Daño en estructura",
  urgency: "alta",      // baja | media | alta
  execution: "pendiente", // pendiente | en_progreso | completada | rechazada
  synced: true          // true si está en el servidor
}
```

---

### 3. Dashboard Administrativo (admin-dashboard.html)

**Tecnología**: HTML5 + Leaflet.js + html2pdf + JavaScript

**Características**:

#### Vista Tabla
- Tabla editable en línea (click para editar)
- Columnas: ID, Fecha, Foto, Observaciones, Urgencia, Estado, Ubicación
- Filtros por urgencia y estado
- Búsqueda de texto
- Botones de eliminar

#### Vista Mapa
- Mapa interactivo con Leaflet (OpenStreetMap)
- Marcadores de color según urgencia:
  - 🟢 Verde = Baja
  - 🟠 Naranja = Media  
  - 🔴 Rojo = Alta
- PopUp con detalles al click
- Auto-zoom al área de incidencias

#### Exportación
- **CSV**: Compatible con Excel/Sheets
- **PDF**: Tabla formateada para impresión

#### Estadísticas
- Contador total
- Distribución por urgencia
- Estado de ejecución

---

## 🔄 Flujo de Sincronización

```
APP MÓVIL (Offline-first)          SERVIDOR (Backend)
    ↓                                    ↓
Captura + IndexedDB             → ¿Hay conexión?
    ↓
SÍ: POST /api/incidents          ← Recibe POST
    ↓                                    ↓
    ← 201 Created + ID servidor         Guarda en DB
    ↓                                    ↓
Actualiza localId=serverId       ← Responde JSON
    ↓
Marca como synced=true
    
NO: Guardar como synced=false
    ↓
⏳ En espera de conexión
    ↓
Cuando vuelve conexión → Retry automático
```

---

## 📊 Modelos de Datos

### Incidencia (Incident)
```javascript
{
  id: 123,                    // Número único (servidor)
  date: "2024-01-15T10:30:00Z", // ISO 8601 timestamp
  photo: "data:image/jpeg;base64,...", // Base64 encoded
  latitude: 42.8125,          // Coordenada GPS
  longitude: -1.6458,         // Coordenada GPS
  observations: "Descripción...", // Campo libre
  urgency: "alta",            // Enum: baja|media|alta
  execution: "pendiente",     // Enum: pendiente|en_progreso|completada|rechazada
  synced: true,               // Boolean
  createdAt: "2024-01-15T10:30:00Z", // Servidor
  updatedAt: "2024-01-15T11:00:00Z"  // Servidor
}
```

### Estadísticas (Stats)
```javascript
{
  total: 45,
  byUrgency: {
    baja: 20,
    media: 15,
    alta: 10
  },
  byExecution: {
    pendiente: 10,
    en_progreso: 15,
    completada: 18,
    rechazada: 2
  }
}
```

---

## 🔐 Seguridad (Roadmap)

### Actual (Desarrollo)
- ✅ CORS habilitado para desarrollo
- ✅ Validación básica en servidor
- ✅ Almacenamiento local seguro (IndexedDB)

### Producción (TODO)
- [ ] Autenticación JWT
- [ ] OAuth2 / OpenID Connect
- [ ] HTTPS / SSL
- [ ] Rate limiting
- [ ] Input validation avanzada
- [ ] Encriptación de datos sensibles
- [ ] Auditoría de cambios
- [ ] RBAC (Role-Based Access Control)

---

## 🚀 Instalación y Despliegue

### Local (Desarrollo)
```bash
git clone <repo>
cd incidencias-app
npm install
npm start
```

### Docker
```bash
docker build -t incidencias-app .
docker run -p 5000:5000 incidencias-app
```

### Heroku
```bash
heroku create incidencias-app
git push heroku main
heroku open
```

### VPS (DigitalOcean, etc.)
```bash
# SSH al servidor
# Instalar Node.js
# Clonar repositorio
# npm install
# npm start (o usar PM2)
```

---

## 📈 Escalabilidad

### Fase 1 (Actual)
- JSON almacenamiento local
- 1 servidor Node.js
- Hasta ~1000 incidencias

### Fase 2 (Recomendado)
- MongoDB Atlas (gratuito)
- 1 servidor Node.js en Heroku/Railway
- Hasta ~10,000 incidencias

### Fase 3 (Producción)
- MongoDB en cluster
- Load balancer
- 2+ servidores Node.js
- CDN para fotos
- Caché Redis

---

## 🔌 Integraciones Futuras

### Con drones (IA)
```javascript
// Captura automática de incidencias desde drones
POST /api/incidents/drone
{
  photo: "...",
  latitude: 42.8125,
  longitude: -1.6458,
  droneId: "DJI-001",
  timestamp: "2024-01-15T10:30:00Z",
  analysis: { type: "crack", severity: 0.85 }
}
```

### Con procesamiento de imágenes
```javascript
// Análisis automático de fotos
POST /api/incidents/:id/analyze
Response:
{
  objects_detected: ["grieta", "oxidación"],
  severity_score: 0.8,
  recommended_action: "Reparación urgente"
}
```

### Con notificaciones
```javascript
// Push notifications a equipos
POST /api/notifications
{
  recipients: ["admin@company.com"],
  subject: "Incidencia crítica detectada",
  urgency: "alta"
}
```

---

## 🧪 Testing

### Unit Tests (Jest)
```bash
npm test
```

### API Tests (Postman collection)
```
Importar: postman-collection.json
Ejecutar: newman run postman-collection.json
```

---

## 📝 Logging y Monitoreo

### Logs actuales
- Console.log en desarrollo
- Archivo incidents.json como auditoria

### Logs producción (TODO)
```javascript
// Winston para logging
const logger = require('winston');
logger.info('Incident created', { id: 123, urgency: 'alta' });
```

---

## ⚡ Performance

### Optimizaciones actuales
- ✅ Compresión de imágenes (JPEG)
- ✅ IndexedDB para offline
- ✅ Lazy loading de fotos
- ✅ API responses cacheadas

### Mejoras planeadas
- [ ] Compression middleware
- [ ] Image optimization (WebP)
- [ ] Redis cache
- [ ] CDN para assets

---

## 📞 Soporte y Mantenimiento

### Troubleshooting común

**App no sincroniza**
```bash
# Verificar servidor
curl http://localhost:5000/api/health

# Verificar logs
npm start

# Limpiar cache
# F12 → Application → Service Workers → Unregister
```

**Dashboard lento**
```bash
# Verificar cantidad de incidencias
curl http://localhost:5000/api/stats

# Si >10,000: Implementar paginación
```

---

## 🎓 Para Abel: Roadmap Personal

### Corto plazo (1-2 meses)
1. ✅ Implementar la solución actual
2. Entrenar equipo de inspección
3. Recopilar feedback

### Mediano plazo (3-6 meses)
1. Integración con drones (DJI SDK)
2. Análisis de imágenes con IA (TensorFlow.js)
3. Reportes automáticos

### Largo plazo (6-12 meses)
1. Sistema de predicción (ML)
2. Integración ERP
3. Plataforma SaaS

---

## 📚 Recursos

- [Express.js](https://expressjs.com/)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Leaflet.js](https://leafletjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Heroku Deploy](https://devcenter.heroku.com/)

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
**Mantener**: Abel - Navarra, España
