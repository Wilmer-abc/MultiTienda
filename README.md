# MultiTienda OS

MultiTienda es un sistema de Punto de Venta (POS), inventario y administración multi-sucursal diseñado para el modelo Software as a Service (SaaS).

## 🚀 Cómo probar la aplicación en tu Teléfono (Túnel Pinggy)

Para probar la plataforma en un dispositivo móvil con soporte para cámara (HTTPS), utilizamos **Pinggy** junto con un **Proxy Inverso de Angular**. Sigue estos 3 pasos (requiere 3 terminales):

---

### Paso 1: Iniciar la Base de Datos (Backend)
Abre una terminal, ingresa a la carpeta del backend y ejecuta el servidor de NestJS:
```bash
cd backend
npm run start:dev
```

### Paso 2: Iniciar la Aplicación Visual con Proxy (Frontend)
Abre una SEGUNDA terminal, ingresa a la carpeta del frontend y ejecuta Angular permitiendo conexiones externas. Esto usará automáticamente `proxy.conf.json` para enrutar el tráfico al backend:
```bash
cd frontend
npm start -- --host 0.0.0.0 --allowed-hosts
```

### Paso 3: Conectar a Internet mediante Pinggy (Túnel Seguro)
Abre una TERCERA terminal (en la raíz o en cualquier carpeta) y ejecuta el túnel SSH de Pinggy apuntando al puerto de Angular:
```bash
ssh -p 443 -R0:127.0.0.1:4200 qr@a.pinggy.io
```
*(Si te pregunta si confías en el host, escribe `yes` y da Enter. La terminal generará un Código QR gigante y te dará un enlace como `https://rnkxx-190-...a.pinggy.link`).*

---

### 📱 ¡A probar en el teléfono!

Escanea el código QR que generó el Paso 3 o escribe el enlace en tu navegador móvil (Chrome o Safari).

> **Nota para evitar bloqueos:** Pinggy mostrará una pantalla de advertencia ("Caution: Make sure you trust this website..."). Para pasar, simplemente haz clic en el botón que dice **"Enter site"**.

**Credenciales de Prueba:**
- Cajero: `cajerozona14@elahorro.com` / `password123`
- SuperAdmin: `superadmin@multitienda.com` / `superadmin123`

---

## 🛠️ Tecnologías Implementadas Recientemente (Para Desarrolladores)

Este proyecto ha sido optimizado y configurado recientemente con las siguientes integraciones. Si eres desarrollador, ten en cuenta esta arquitectura:

### Frontend (Angular 17+)
* **`html5-qrcode`**: Librería instalada para habilitar el escaneo nativo de códigos de barras mediante la cámara del celular. (Implementado en `PosTerminalComponent`).
* **Proxy Inverso (`proxy.conf.json`)**: Configurado para enrutar internamente cualquier petición que vaya a `/api` o `/usuarios` hacia el puerto local `3000`. Esto elimina los problemas de CORS y la necesidad de levantar un segundo túnel para el backend.
* **UI/UX (Glassmorphism)**: Diseño no tradicional basado en TailwindCSS, enfocado en "Mobile-First" (adaptable a dispositivos móviles sin perder la estética premium de escritorio).

### Backend (NestJS + Prisma MySQL)
* **Arquitectura SaaS Multi-Tenant**: Las peticiones de inventario y ventas se filtran por `empresa_id` interceptando el token JWT (`@GetUser()`).
* **Seeder de Roles**: Prisma genera el rol `dueño` como `due_o` para sortear restricciones de MySQL. (Revisar `prisma/seed.ts`).
* **Integración API Externa (Open Food Facts)**: Si un código de barras no existe en la base de datos, el backend consulta automáticamente la API global de Open Food Facts para autocompletar el nombre y la foto del producto.

---







## 🗄️ Actualización de Base de Datos (Cuando modificas tablas o campos)

Si como desarrollador realizas cambios en el archivo `backend/prisma/schema.prisma` (por ejemplo: agregas una nueva tabla, agregas una columna nueva, quitas campos o modificas relaciones), debes "compilar" esos cambios y enviarlos a la base de datos MySQL.

Para hacerlo, sigue estos pasos:

1. Abre una terminal y navega a la carpeta del backend:
```bash
cd backend
```

2. Ejecuta el comando de empuje de Prisma. Esto leerá tu archivo `schema.prisma` y modificará la base de datos MySQL real para que coincida con tus tablas:
```bash
npx prisma db push
```

3. (Opcional pero recomendado BACKEND) Genera nuevamente los tipos de TypeScript para que el autocompletado de código funcione con los nuevos campos:
```bash
npx prisma generate
```

> **Nota:** Si ejecutas estos comandos desde la carpeta raíz (`MultiTienda`), fallarán porque Prisma no encontrará el archivo `schema.prisma`. **¡Siempre asegúrate de estar dentro de la carpeta `backend`!**
