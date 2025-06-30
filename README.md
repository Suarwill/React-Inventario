# React-Inventario

## 📦 Descripción del Proyecto

**React-Inventario** es una aplicación Full Stack diseñada para la **gestión de inventarios**. Incluye un frontend desarrollado en **React** y un backend en **Node.js con Express**, conectados a una base de datos **PostgreSQL**.  
Permite realizar operaciones como:

- Clasificación de productos
- Gestión de usuarios
- Envíos y recepciones
- Mermas de inventario

---

## 🚀 Características Principales

### 🖥️ Frontend (React)

- **Interfaz dinámica y modular**
- **Componentes destacados**:
  - **Navbar y Sidebar**: Navegación intuitiva
  - **Dashboard**: Panel principal con módulos
  - **Clasificación de Sobrestock**: Categorías como `Antiguos`, `Vigente` y `Nuevo`
  - **Recepciones**: Verificación de envíos y cálculo de diferencias
  - **Mermas**: Registro de productos dañados o dados de baja

### 🛠️ Backend (Node.js + Express)

- API REST estructurada y escalable
- **Base de datos PostgreSQL** para:
  - Usuarios
  - Productos
  - Movimientos
  - Envíos
- **Servicios separados**:
  - `user.service.js`, `product.service.js`, `envio.service.js`
- **Autenticación JWT** para sesiones seguras
- **Controladores por entidad**:
  - `user.controller.js`, `envio.controller.js`, etc.

---

