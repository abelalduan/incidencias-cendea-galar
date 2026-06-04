# 🚀 DESPLIEGUE EN RAILWAY

## ¿Qué necesitas?

1. Una cuenta en **Railway.app** (gratuita)
2. Una cuenta en **GitHub** (gratuita)

---

## PASO 1: Subir a GitHub

### 1.1 Crear repositorio en GitHub
- Ve a https://github.com/new
- Nombre: `incidencias-cendea-galar`
- Descripción: `Sistema de gestión de incidencias`
- Público o Privado (como prefieras)
- Click en **"Create repository"**

### 1.2 Subir el código
```bash
cd incidencias-cendea-galar
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/incidencias-cendea-galar.git
git push -u origin main
```

---

## PASO 2: Desplegar en Railway

### 2.1 Conectar Railway con GitHub
- Ve a https://railway.app
- Haz click en **"New Project"**
- Selecciona **"Deploy from GitHub"**
- Autoriza a Railway acceder a tu GitHub
- Busca y selecciona `incidencias-cendea-galar`

### 2.2 Configurar el proyecto
- Railway detectará automáticamente que es Node.js
- Haz click en **"Deploy"**

### 2.3 Esperar despliegue
- Espera a que termine (2-3 minutos)
- Verás la URL pública cuando esté listo

---

## PASO 3: Usar la aplicación

Una vez desplegado, obtendrás una URL como:
```
https://incidencias-cendea-galar-prod.up.railway.app
```

### Accesos:
- **App Móvil**: `https://incidencias-cendea-galar-prod.up.railway.app/app`
- **Dashboard**: `https://incidencias-cendea-galar-prod.up.railway.app/admin`
- **API**: `https://incidencias-cendea-galar-prod.up.railway.app/api/incidents`

---

## 📱 En iPhone

Simplemente abre en Safari:
```
https://incidencias-cendea-galar-prod.up.railway.app/app
```

(Cambia la URL según la que te dé Railway)

---

## ⚠️ Notas importantes

1. **Los datos se guardan en el servidor** - Si necesitas hacer backup, descarga el JSON
2. **Si cambias algo en el código**, haz un nuevo `git push` y Railway se redeploya automáticamente
3. **La app es responsive** - Funciona en móvil, tablet y PC

---

## 🔧 Solución de problemas

### "No funciona la ubicación en iPhone"
La app tiene entrada manual de coordenadas, no hay problema.

### "No puedo conectarme al servidor"
- Verifica que la URL sea correcta
- Espera 5 minutos después del despliegue

### "Perdí los datos"
- Los datos están en `incidents.json`
- Si necesitas hacer backup, descargalos del dashboard

---

¡Listo! 🎉
