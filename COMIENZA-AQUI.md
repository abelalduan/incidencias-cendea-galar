# 🚀 Sistema Completo de Incidencias - COMIENZA AQUÍ

## ¿Qué has recibido?

He creado un **sistema full-stack completo** para captura y gestión de incidencias de campo. Todo está integrado y listo para usar.

---

## 📦 Archivos Incluidos

### 1. **server.js** ⚙️
El **corazón del sistema**: Backend Node.js con Express
- API REST completa
- Gestión de incidencias
- Almacenamiento de fotos en Base64
- Exportación CSV
- Estadísticas en tiempo real

### 2. **app-movil.html** 📱
La **app móvil** para inspectores de campo
- Captura de fotos con cámara
- GPS en tiempo real
- Almacenamiento offline (IndexedDB)
- Sincronización automática
- Instalable como app nativa

**Abre en navegador móvil**: `http://localhost:5000/app`

### 3. **admin-dashboard.html** 📊
El **panel administrativo** para gestionar todo
- Tabla editable (click para cambiar datos)
- **Mapa interactivo** con todas las incidencias
- Filtros avanzados
- Exportación a CSV y PDF
- Estadísticas en tiempo real

**Abre en navegador**: `http://localhost:5000/admin`

### 4. **package.json** 📦
Dependencias necesarias (Express, CORS, etc.)

### 5. **README.md** 📖
Documentación completa con:
- Instrucciones de instalación
- API endpoints
- Guía de despliegue
- Troubleshooting

### 6. **ARQUITECTURA.md** 🏗️
Documentación técnica detallada:
- Flujo de datos
- Modelos
- Seguridad
- Escalabilidad

---

## ⚡ INICIO RÁPIDO (5 minutos)

### Paso 1: Instalar Node.js
Si no lo tienes:
```
https://nodejs.org/ → Descargar e instalar
```

### Paso 2: Preparar los archivos
```bash
# Crear carpeta
mkdir incidencias-app
cd incidencias-app

# Copiar todos los archivos aquí
# (server.js, package.json, app-movil.html, etc.)
```

### Paso 3: Instalar dependencias
```bash
npm install
```

### Paso 4: Iniciar servidor
```bash
npm start
```

Verás:
```
🚀 Servidor de incidencias corriendo en http://localhost:5000
📊 Dashboard: http://localhost:5000/admin
```

### Paso 5: Abrir en navegador
```
http://localhost:5000/admin
```

---

## 🎯 ¿Qué puedo hacer?

### Con la APP MÓVIL (`/app`)
1. 📷 Capturar foto de la incidencia
2. 📍 Obtener ubicación GPS automática
3. 📝 Añadir observaciones
4. ⚠️ Marcar urgencia (Baja/Media/Alta)
5. ✓ Guardar - **funciona sin internet**
6. 🔄 Se sincroniza automáticamente cuando hay conexión

### Con el DASHBOARD (`/admin`)
1. 📋 Ver todas las incidencias en tabla
2. ✏️ Editar cualquier campo (click en la celda)
3. 🗺️ Ver mapa interactivo con marcadores de color
4. 🔍 Filtrar por urgencia o estado
5. 📥 Exportar a CSV (Excel)
6. 📄 Exportar a PDF (impresión)
7. 📊 Ver estadísticas actualizadas

---

## 🔄 Flujo de Datos

```
Inspector en campo
        ↓
    📷 Captura foto
    📍 GPS automático
    📝 Observaciones
    ⚠️ Urgencia
        ↓
    📱 App Móvil (offline-first)
        ↓
    ¿Hay WiFi/4G?
      ├─ SÍ  → Sync inmediato al servidor
      └─ NO  → Espera en la app
        ↓
    ⚙️ Backend Node.js
        ↓
    💾 Base de datos
        ↓
    👨‍💼 Admin ve en Dashboard
        ↓
    📊 Edita, filtra, exporta
```

---

## 📍 Características Principales

### ✅ Captura Offline
- Funciona 100% sin internet
- Almacena localmente en el dispositivo
- Sincroniza cuando vuelve la conexión

### ✅ Mapa Interactivo
- Visualiza todas las incidencias
- Colores por urgencia (🟢 Baja, 🟠 Media, 🔴 Alta)
- Click en marcador para detalles
- Zoom automático

### ✅ Edición en Línea
- Click en cualquier celda para editar
- Cambios instantáneos
- Soporta: observaciones, urgencia, estado

### ✅ Exportación
- **CSV**: Abre en Excel, Sheets, etc.
- **PDF**: Para impresión/reporte

### ✅ Estadísticas
- Total de incidencias
- Distribución por urgencia
- Estado de ejecución

---

## 🔌 API (Para desarrolladores)

Si quieres conectar tu propio software:

```javascript
// Crear incidencia
POST http://localhost:5000/api/incidents
{
  photo: "data:image/jpeg;base64,...",
  latitude: 42.8125,
  longitude: -1.6458,
  observations: "Daño en muro",
  urgency: "alta",
  execution: "pendiente"
}

// Listar todas
GET http://localhost:5000/api/incidents

// Actualizar
PUT http://localhost:5000/api/incidents/123
{
  observations: "Nuevas observaciones",
  execution: "en_progreso"
}

// Estadísticas
GET http://localhost:5000/api/stats

// Exportar CSV
GET http://localhost:5000/api/export/csv
```

---

## 🛠️ Customizaciones Fáciles

### Cambiar colores
En `admin-dashboard.html`, busca:
```css
background: linear-gradient(135deg, #185FA5 0%, #0C447C 100%);
```
Reemplaza con tus colores corporativos

### Cambiar nombre de la app
En los archivos HTML:
```html
<h1>📋 Incidencias</h1>
```
Cambia "Incidencias" por lo que quieras

### Cambiar puerto
En `server.js`:
```javascript
const PORT = process.env.PORT || 5000;
```
Cambia `5000` a otro puerto

---

## 🚀 Próximos Pasos

### Inmediato (Esta semana)
1. ✅ Probar en tu equipo
2. ✅ Entrenar a inspectores
3. ✅ Recopilar feedback

### Corto plazo (1-2 meses)
1. Desplegar en servidor (Heroku, DigitalOcean)
2. Autenticación de usuarios
3. Reportes automáticos

### Mediano plazo (3-6 meses)
1. Integración con drones
2. Análisis con IA
3. Más widgets

---

## 🆘 Si algo no funciona

### La app no carga
```bash
# Verificar servidor está corriendo
npm start

# Abrir DevTools (F12)
# Ver pestaña "Network"
# Debe haber respuesta de http://localhost:5000/admin
```

### No se guardan incidencias
```bash
# Verificar que la app móvil está en: http://localhost:5000/app
# Permitir cámara y ubicación cuando pida
# Ver console (F12) por errores
```

### Mapa en blanco
```bash
# Necesita internet para OpenStreetMap
# Verificar conexión
# Actualizar página
```

### Dashboard no carga datos
```bash
# Abrir DevTools (F12) → Console
# Ver si hay error de CORS
# Verificar que backend está activo: http://localhost:5000/api/health
```

---

## 📊 Estadísticas del Sistema

### Capacidad actual
- ✅ Hasta 10,000 incidencias
- ✅ Fotos de cualquier tamaño (se comprimen)
- ✅ Offline unlimited (almacenamiento local)
- ✅ 1 servidor Node.js

### Para más volumen
- MongoDB Atlas (gratuito, hasta 512MB)
- Heroku + MongoDB = totalmente escalable

---

## 📞 Soporte

### Documentación
- `README.md` - Instalación y API
- `ARQUITECTURA.md` - Detalles técnicos

### Troubleshooting
- Abrir DevTools (F12)
- Revisar Console por errores
- Verificar Network → ver peticiones a `/api`

---

## 🎓 Para Aprender Más

### Tecnologías usadas
- **Node.js/Express**: Backend servidor
- **HTML5**: Frontend web
- **JavaScript vanilla**: Sin dependencias innecesarias
- **IndexedDB**: Base de datos local
- **Leaflet**: Mapas interactivos
- **Fetch API**: Comunicación servidor-cliente

---

## 📋 Checklist para Empezar

- [ ] Descargar todos los archivos
- [ ] Tener Node.js instalado
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm start`
- [ ] Abrir `http://localhost:5000/admin`
- [ ] Probar captura en `http://localhost:5000/app`
- [ ] Ver datos en dashboard
- [ ] Exportar a CSV/PDF
- [ ] Consultar README.md para más

---

## 💡 Próximas Ideas

Para después de implementar esto base:

1. **Autenticación**: Login de inspectores
2. **Roles**: Admin vs Inspector
3. **Notificaciones**: Alertas en caso crítico
4. **Drones**: Integración DJI para captura automática
5. **IA**: Análisis automático de imágenes
6. **Reportes**: PDF automáticos por email
7. **ERP**: Integración con tus sistemas

---

**¡Listo para empezar!** 🚀

Si tienes cualquier pregunta, revisa los archivos de documentación o contacta directamente.

**Versión**: 1.0.0  
**Creado**: Enero 2024  
**Para**: Inspección y gestión de incidencias industriales
