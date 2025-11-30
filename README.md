# 📦 StockFast

> **Gestión de inventario inteligente para negocios en línea y tiendas físicas**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/PHP-8.3+-blue.svg)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-11+-red.svg)](https://laravel.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)

---

## 🚀 Visión General

**StockFast** es una aplicación web full-stack de gestión de inventario diseñada para vendedores de second-hand, emprendedores y pequeños negocios que necesitan controlar stock, ventas y estadísticas en tiempo real.

Con una interfaz intuitiva y funcionalidades poderosas, StockFast te permite:
- 📊 Monitorear tu inventario en tiempo real
- 💰 Registrar ventas y generar reportes
- 📈 Analizar tendencias de venta
- 🔐 Gestionar acceso con autenticación segura

**Demo en vivo:** [https://stockfast.vercel.app](https://stockfast.vercel.app)

---

## ✨ Características Principales

### 📋 Gestión de Inventario
- Crear, editar y eliminar productos
- Organizar por categorías y etiquetas
- Seguimiento de stock en tiempo real

### 💳 Registro de Ventas
- Interfaz intuitiva para registrar ventas diarias
- Historial completo de transacciones
- Detalles de venta: cantidad, precio, cliente, fecha
- Edición y eliminación de registros
- Filtrado y búsqueda avanzada

### 📊 Análisis y Reportes
- Dashboard con estadísticas clave (KPIs)
- Gráficos de ingresos por período
- Productos más vendidos
- Análisis de tendencias

### 🔒 Seguridad
- Autenticación JWT (JSON Web Tokens)
- Control de acceso basado en roles
- Contraseñas hasheadas (bcrypt)
- Validación de entrada en frontend y backend
- CORS configurado para máxima seguridad

### 📱 Responsive Design
- Diseño completamente responsivo
- Funciona perfectamente en desktop, tablet y móvil
- UI oscura moderna y atractiva
- Navegación intuitiva

---

## 🛠 Stack Tecnológico

### Backend
- **Framework:** Laravel
- **Lenguaje:** PHP
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT (tymon/jwt-auth)
- **API:** RESTful con validación completa

### Frontend
- **Framework:** Angular
- **Lenguaje:** TypeScript
- **Estilos:** CSS3 + diseño personalizado
- **HTTP Client:** RxJS + HttpClientModule

### DevOps & Deployment
- **Backend:** Railway + Docker
- **Frontend:** Vercel
- **Database:** PostgreSQL en Railway
- **Versionado:** Git & GitHub
- **Monorepo:** Estructura modular

---

## 🚀 Demo en Vivo

**Prueba la aplicación ahora sin instalar nada:**

👉 [**Abrir StockFast**](https://stockfast.vercel.app)

**Credenciales de prueba:**
- Email: `johndoe@gmail.com`
- Contraseña: `St@ckfast19`

---

## 📖 Documentación de API

### Autenticación
Todos los endpoints requieren token JWT en el header:
Authorization: Bearer {token}

### Endpoints Principales

**Autenticación:**
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Refrescar token

**Productos:**
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

**Ventas:**
- `GET /api/sales` - Listar ventas
- `POST /api/sales` - Registrar venta
- `PUT /api/sales/{id}` - Editar venta
- `DELETE /api/sales/{id}` - Eliminar venta

**Dashboard:**
- `GET /api/dashboard/stats` - Estadísticas principales
- `GET /api/dashboard/sales-chart` - Datos para gráfico de ventas

---

## 🎯 Decisiones Arquitectónicas

### Backend (Laravel)
- **API RESTful:** Siguiendo best practices de REST
- **Validación en capas:** Frontend + Backend
- **JWT over Sessions:** Mejor para aplicaciones móviles y SPAs

### Frontend (Angular)
- **Services para lógica:** Separación de concerns
- **Guards de rutas:** Protección de páginas autenticadas

---

## 👨‍💻 Autor

**Alex Candela** - Desarrollador Full Stack
- GitHub: [@alexcandela](https://github.com/alexcandela)
- LinkedIn: [Alex Candela](https://linkedin.com/in/alexcandela)
- Email: alex.candelaa@gmail.com

