# 🖥️ Frontend Dashboard de Finanzas

Interfaz de usuario React para el sistema de gestión financiera, desarrollado con TypeScript, Vite, Sass y Recharts. Parte del proyecto de microservicios Dashboard de Finanzas.

## 📋 Descripción

Aplicación frontend que consume las APIs de los microservicios de autenticación y finanzas, proporcionando una interfaz intuitiva para:

- ✅ **Autenticación**: Registro e inicio de sesión de usuarios
- ✅ **Dashboard**: Visualización de métricas financieras y gráficos
- ✅ **Gestión de Datos**: CRUD completo de ventas y gastos
- ✅ **Importación**: Carga masiva de datos desde JSON
- ✅ **Filtros Avanzados**: Búsqueda por período y categoría

## 🏗️ Stack Tecnológico

- **React 18** + **TypeScript** + **Vite**
- **Sass** para estilos (sin librerías UI externas)
- **Recharts** para visualización de datos
- **Axios** para llamadas HTTP
- **Context API** para manejo de estado global
- **ESLint** + **TypeScript ESLint** para calidad de código

## 📁 Estructura del Proyecto

```
frontend-finanzas/
├── 📁 src/
│   ├── 📁 components/          # Componentes React
│   │   ├── Dashboard.tsx       # Dashboard principal con métricas
│   │   ├── VentasForm.tsx      # Formulario de ventas
│   │   ├── GastosForm.tsx      # Formulario de gastos
│   │   ├── LoginForm.tsx       # Formulario de autenticación
│   │   ├── DataManager.tsx     # Gestión de datos CRUD
│   │   ├── ImportData.tsx      # Importación JSON
│   │   └── Header.tsx          # Navegación y logout
│   ├── 📁 context/             # Contextos globales
│   │   ├── AuthContext.tsx     # Estado de autenticación
│   │   └── DataContext.tsx     # Estado de datos financieros
│   ├── 📁 services/            # Servicios API
│   │   └── api.ts              # Cliente HTTP para backends
│   ├── 📁 types/               # Definiciones TypeScript
│   │   └── index.ts            # Interfaces y tipos
│   ├── 📁 styles/              # Estilos Sass
│   │   └── main.scss           # Estilos globales
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Punto de entrada
├── 📄 package.json
├── 📄 vite.config.ts           # Configuración Vite
├── 📄 tsconfig.json            # Configuración TypeScript
├── 📄 .env.example             # Variables de entorno ejemplo
└── 📄 README.md                # Esta documentación
```

## 🚀 Guía de Instalación y Ejecución

### 📋 Prerrequisitos

- **Node.js** versión 18.0.0 o superior
- **npm** o **yarn** como gestor de paquetes
- **Git** para control de versiones
- Backends corriendo (ver documentación raíz del proyecto)

### 🔧 Configuración para Desarrollo

#### Paso 1: Clonar e Instalar
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd frontend-finanzas

# Instalar dependencias
npm install
```

#### Paso 2: Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env (opcional - por defecto usa localhost)
VITE_AUTH_API_URL=http://localhost:3001
VITE_FINANZAS_API_URL=http://localhost:3002
```

#### Paso 3: Ejecutar en Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# El frontend estará disponible en: http://localhost:5173
```

#### Paso 4: Verificar Instalación
- Abrir http://localhost:5173 en el navegador
- Verificar que los backends estén corriendo en los puertos 3001 y 3002
- Probar flujo completo: Login → Dashboard → Gestión de datos

### 🏭 Configuración para Producción - Deploy en Netlify

#### Opción 1: Deploy Automático desde Git (Recomendado)

1. **Crear cuenta en Netlify**
   - Ir a [netlify.com](https://netlify.com) y crear cuenta
   - Conectar con GitHub

2. **Configurar Deploy**
   - Seleccionar repositorio `frontend-finanzas`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18.x

3. **Configurar Variables de Entorno**
   ```
   VITE_AUTH_API_URL=https://tu-backend-auth-render.onrender.com
   VITE_FINANZAS_API_URL=https://tu-backend-finanzas-railway.up.railway.app
   ```

4. **Deploy**
   - Netlify detectará automáticamente los cambios en Git
   - Deploy automático al hacer push a la rama main

#### Opción 2: Deploy Manual con Build Local

```bash
# 1. Construir la aplicación
npm run build

# 2. El directorio dist/ contiene los archivos listos para deploy
# 3. Subir el contenido de dist/ a Netlify manualmente
# 4. Configurar variables de entorno en el panel de Netlify
```

#### Configuración Avanzada de Netlify

**netlify.toml** (opcional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor con hot reload (puerto 5173)
npm run build        # Construir para producción
npm run preview      # Vista previa del build local
npm run lint         # Ejecutar ESLint

# TypeScript
npm run type-check   # Verificar tipos (si configurado)
```

### 🔗 Integración con Backends

El frontend se comunica con dos APIs:

#### 🔐 Backend de Autenticación (Puerto 3001/Render)
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/me` - Obtener usuario actual

#### 💰 Backend de Finanzas (Puerto 3002/Railway)
- `GET /ventas` - Listar ventas con filtros
- `POST /ventas` - Crear venta
- `PUT /ventas/:id` - Actualizar venta
- `DELETE /ventas/:id` - Eliminar venta
- `GET /gastos` - Listar gastos con filtros
- `POST /gastos` - Crear gasto
- `PUT /gastos/:id` - Actualizar gasto
- `DELETE /gastos/:id` - Eliminar gasto
- `GET /dashboard/line-chart` - Datos para gráficos
- `POST /import-json` - Importar datos JSON

### 🎨 Características de la Interfaz

#### Autenticación
- ✅ Formulario de login/registro
- ✅ Persistencia de sesión con localStorage
- ✅ Protección de rutas

#### Dashboard
- ✅ Métricas financieras en tiempo real
- ✅ Gráfico de líneas con tendencias
- ✅ Balance general (ingresos - egresos)
- ✅ Formato de moneda argentino

#### Gestión de Datos
- ✅ Tablas responsivas con paginación
- ✅ Formularios modales para CRUD
- ✅ Filtros por período (día, semana, mes, año)
- ✅ Validación de formularios

#### Importación
- ✅ Upload de archivos JSON
- ✅ Editor de texto integrado
- ✅ Validación de estructura
- ✅ Feedback visual del progreso

### 🔒 Seguridad

- ✅ **Variables de entorno** para URLs de APIs
- ✅ **Validación de formularios** en frontend
- ✅ **Protección XSS** con sanitización
- ✅ **CORS** manejado por backends
- ✅ **JWT** gestionado por backends

### 📱 Responsive Design

- ✅ **Mobile-first** approach
- ✅ Diseño adaptativo para tablets y móviles
- ✅ Navegación intuitiva
- ✅ Componentes accesibles

### 🧪 Testing

#### Testing Manual
1. **Autenticación**: Registrar usuario → Login → Verificar persistencia
2. **Dashboard**: Ver métricas → Verificar gráficos → Probar filtros
3. **CRUD**: Crear venta/gasto → Editar → Eliminar → Verificar cambios
4. **Importación**: Subir JSON → Verificar datos importados
5. **Responsive**: Probar en diferentes dispositivos

#### Testing Automático (Futuro)
```bash
# Configuración recomendada para testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### 🤝 Contribución

1. **Fork** el proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Agrega nueva funcionalidad'`
4. **Push**: `git push origin feature/nueva-funcionalidad`
5. Abrir **Pull Request**

### 📞 Soporte y Troubleshooting

#### Problemas Comunes

**Error de conexión con backends:**
```bash
# Verificar que los backends estén corriendo
curl http://localhost:3001/auth/me
curl http://localhost:3002/ventas

# Verificar variables de entorno
cat .env
```

**Build fallido:**
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Errores de TypeScript:**
```bash
# Verificar tipos
npx tsc --noEmit

# ESLint
npm run lint
```

### 📋 Checklist de Deploy en Netlify

- [ ] Repositorio conectado a Netlify
- [ ] Build command configurado: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Variables de entorno configuradas
- [ ] Backends desplegados y accesibles
- [ ] Dominio personalizado (opcional)
- [ ] HTTPS habilitado automáticamente

### 🎉 Conclusión

Este frontend proporciona una interfaz completa y profesional para el sistema de Dashboard de Finanzas, cumpliendo con los requisitos técnicos de la prueba. La arquitectura modular y las buenas prácticas implementadas lo hacen mantenible y escalable.

**¡Listo para desarrollo local y deploy automático en Netlify!**

---

**Desarrollado con ❤️ como parte del sistema de microservicios Dashboard de Finanzas**
