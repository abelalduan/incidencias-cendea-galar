# 📊 Sistema de Gestión de Incidencias - Documentación Completa

## 🎯 Características

### App Móvil (PWA)
- ✅ Captura de incidencias (foto + ubicación)
- ✅ Almacenamiento offline con IndexedDB
- ✅ Sincronización automática con servidor
- ✅ Instalable en cualquier dispositivo

### Dashboard Administrativo
- ✅ Tabla interactiva de incidencias
- ✅ Edición en línea (observaciones, urgencia, estado)
- ✅ Mapa interactivo con ubicaciones (Leaflet)
- ✅ Filtros avanzados
- ✅ Exportación CSV y PDF
- ✅ Estadísticas en tiempo real

### Backend API
- ✅ REST API completa
- ✅ Almacenamiento persistente
- ✅ CORS habilitado para acceso desde cualquier origen
- ✅ Endpoints para estadísticas y exportación

---

## 🚀 Instalación Rápida (Local)

### 1. Requisitos previos
- Node.js 14+ instalado
- npm o yarn

### 2. Descargar los archivos
```bash
# Clonar o descargar el repositorio
cd incidencias-app
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Iniciar el servidor
```bash
npm start
# O en desarrollo con auto-reload:
npm run dev
```

Verás:
```
🚀 Servidor de incidencias corriendo en http://localhost:5000
📊 Dashboard: http://localhost:5000/admin
📡 API: http://localhost:5000/api
```

### 5. Acceder a las interfaces

**Dashboard Administrativo:**
```
http://localhost:5000/admin
```

**App Móvil (PWA):**
```
http://localhost:5000/app
```

---

## 📱 Usar la App Móvil

### En el navegador (cualquier dispositivo)
1. Abrir `http://localhost:5000/app` en el navegador
2. Permitir permisos de cámara y ubicación
3. Capturar foto y ubicación
4. Completar observaciones, urgencia y estado
5. Guardar - se sincroniza automáticamente con el servidor

### Instalar como app nativa
1. En Chrome/Edge mobile: Menu → "Instalar aplicación"
2. Funciona completamente offline
3. Los datos se sincronizan cuando hay conexión

---

## 📊 Dashboard Administrativo

### Vista Tabla
- Click en cualquier campo para editar
- Botones de acción para eliminar
- Filtros por urgencia y estado
- Búsqueda de texto libre

### Vista Mapa
- Círculos de color según urgencia:
  - 🟢 Verde = Urgencia Baja
  - 🟠 Naranja = Urgencia Media
  - 🔴 Rojo = Urgencia Alta
- Click en marcador para ver detalles
- Zoom automático al área con incidencias

### Exportación
- **CSV**: Compatible con Excel, Google Sheets
- **PDF**: Tabla formateada para impresión

### Estadísticas
- Total de incidencias
- Distribución por urgencia
- Estado de ejecución

---

## 🔌 API REST - Endpoints

### Incidencias
```
GET    /api/incidents                 - Listar todas
GET    /api/incidents?urgency=alta     - Filtrar por urgencia
GET    /api/incidents?execution=pendiente - Filtrar por estado
GET    /api/incidents/:id             - Obtener una
POST   /api/incidents                 - Crear nueva
PUT    /api/incidents/:id             - Actualizar
DELETE /api/incidents/:id             - Eliminar
```

### Otros
```
GET    /api/stats                     - Estadísticas
GET    /api/export/csv                - Exportar CSV
GET    /api/export/locations          - Datos de ubicaciones (JSON)
GET    /api/health                    - Estado del servidor
```

### Ejemplo de POST (crear incidencia)
```javascript
fetch('http://localhost:5000/api/incidents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    photo: "data:image/jpeg;base64,...",
    latitude: 42.8125,
    longitude: -1.6458,
    observations: "Daño en estructura",
    urgency: "alta",
    execution: "pendiente"
  })
})
```

---

## 🗄️ Base de Datos

### Almacenamiento Local (Desarrollo)
- Los datos se guardan en `incidents.json`
- Perfecta para desarrollo y pruebas
- Se persisten entre reinicios del servidor

### Para Producción (MongoDB)
1. Crear cuenta en https://www.mongodb.com/cloud/atlas (gratuita)
2. Crear una base de datos
3. Obtener la cadena de conexión
4. Modificar `server.js`:
```javascript
// Descomentar y usar MongoDB en lugar de JSON
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
```

---

## 📁 Estructura de Archivos

```
incidencias-app/
├── server.js                 # Backend Express
├── package.json             # Dependencias
├── admin-dashboard.html     # Panel administrativo
├── app-movil.html          # App móvil PWA
├── incidents.json          # Base de datos (generada automáticamente)
└── README.md               # Este archivo
```

---

## 🔒 Consideraciones de Seguridad

### Para Producción
1. **Autenticación**: Añadir JWT/OAuth
   ```javascript
   // Proteger endpoints con middleware de auth
   app.get('/api/incidents', authenticateToken, (req, res) => { ... });
   ```

2. **CORS**: Especificar orígenes permitidos
   ```javascript
   app.use(cors({
     origin: 'https://tudominio.com'
   }));
   ```

3. **Validación**: Validar todos los inputs
   ```javascript
   if (!photo || !latitude || !longitude) {
     return res.status(400).json({ error: 'Campos requeridos' });
   }
   ```

4. **Rate Limiting**: Prevenir abuso
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use('/api/', limiter);
   ```

5. **HTTPS**: Usar certificados SSL/TLS

---

## 🚢 Despliegue en Producción

### Opción 1: Heroku (Recomendado para empezar)
```bash
# Instalar Heroku CLI
# Crear app
heroku create incidencias-app
# Desplegar
git push heroku main
# Ver logs
heroku logs --tail
```

### Opción 2: Railway / Render
- Conectar repositorio Git
- Auto-deploy en cada push
- Gratis para pequeñas aplicaciones

### Opción 3: VPS (DigitalOcean, Linode)
```bash
# SSH al servidor
ssh root@tu-servidor

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar repo y iniciar
git clone tu-repo
cd incidencias-app
npm install
npm start
```

---

## 🆘 Troubleshooting

### La app no sincroniza
- Verificar que el servidor esté corriendo: `http://localhost:5000/api/health`
- Verificar la consola del navegador (F12)
- Revisar que CORS esté configurado

### Dashboard no carga datos
- Abrir DevTools (F12) → Network
- Ver si la petición a `/api/incidents` responde correctamente
- Verificar que el servidor no tiene errores

### Fotos no se guardan
- Verificar permisos de cámara
- Revisar que `incidents.json` es escribible
- Comprobar espacio en disco

### Mapa no aparece
- Verificar conexión a internet (necesita OpenStreetMap)
- Comprobar que Leaflet está cargado
- Revisar coordenadas (deben ser números válidos)

---

## 📞 Variables de Entorno

Crear archivo `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/incidencias
JWT_SECRET=tu-clave-secreta-super-segura
```

---

## 📈 Roadmap Futuro

- [ ] Autenticación de usuarios
- [ ] Diferentes roles (admin, inspector, gestor)
- [ ] Notificaciones en tiempo real (Socket.io)
- [ ] Análisis con IA (detección de anomalías)
- [ ] Integración con drones para inspección automática
- [ ] Reportes automáticos por email
- [ ] Sincronización con sistemas ERP

---

## 📄 Licencia

MIT - Libre para uso comercial y privado

---

## 💡 Notas para Abel

Esta solución está diseñada para ser:
- **Escalable**: Fácil de crecer desde desarrollo a producción
- **Modular**: Componentes independientes
- **Offline-first**: Funciona sin internet
- **GDPR-friendly**: Datos locales controlados

Para integraciones futuras (drones IA, análisis de imágenes, etc.), 
la arquitectura API permite conectar servicios externos fácilmente.

¡Cualquier duda, estoy para ayudarte! 🚀
