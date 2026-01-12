# Frontend Dashboard de Finanzas

Interfaz React que consume las APIs de autenticación y finanzas.

## Stack

- React + TypeScript + Vite
- Sass (sin UI externas)
- Recharts para gráficos
- Axios para API calls

## Instalación Desarrollo

1. **Instalar dependencias**: `npm install`
2. **Configurar .env** (opcional):
   ```env
   VITE_AUTH_API_URL=http://localhost:3001
   VITE_FINANZAS_API_URL=http://localhost:3002
   ```
3. **Ejecutar**: `npm run dev`

## Producción - Netlify

**URL Deploy**: https://finanzas-dashboard.netlify.app/

```bash
npm run build
# Subir dist/ a Netlify
# Variables de entorno configuradas:
# VITE_AUTH_API_URL=https://backend-auth-drizzle-magg.onrender.com
# VITE_FINANZAS_API_URL=https://backend-finanzas-sequelize-wfdm.onrender.com
```

## Pruebas

### Desarrollo Local
1. **Ejecutar**: `npm run dev`
2. **Abrir navegador**: http://localhost:5173
3. **Flujo de prueba**:
   - Registrarse en la app
   - Crear algunas ventas y gastos
   - Ver dashboard con métricas
   - Probar filtros por período
   - Importar datos JSON

### Producción (Netlify)
1. **Abrir**: https://finanzas-dashboard.netlify.app/
2. **Probar flujo completo** con backends reales en producción

## Características

- Autenticación con JWT
- Dashboard con métricas y gráficos
- CRUD de ventas y gastos
- Importación JSON
- Filtros por período
- Responsive design
