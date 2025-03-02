# BackOffice Athor

**All open**

José Valentino Masías Castillo

03/02/2025 07:33 AM

**All open**

1. [**Backend Base 2**](#_page2_x0.00_y60.00)
1. [**Backend Avanzado 3**](#_page3_x0.00_y60.00)
1. [**Frontend Base (React) 4**](#_page4_x0.00_y60.00)
1. [**Frontend Avanzado 5**](#_page5_x0.00_y60.00)
1. [**Integración Final 7**](#_page7_x0.00_y60.00)
1. [**Despliegue y Documentación 8**](#_page8_x0.00_y60.00)
1. [**Análisis de la arquitectura del sistema (Frontend y Backend) de Athor 9**](#_page9_x0.00_y605.77)

<a name="_page2_x0.00_y60.00"></a>**1. Backend Base**



|**ID**|[41](http://localhost:8080/work_packages/41)|**TYPE**|Task|
| - | - | - | - |
|**STATUS**|New|**ASSIGNEE**|José Valentino Masías Castillo|
|**PRIORITY**|High|**AUTHOR**|José Valentino Masías Castillo|
|**DURATION**|11 d|**START DATE**|03/03/2025|
|**FINISH DATE**|03/17/2025|||
**Description**

**Objetivo:** API funcional con autenticación y CRUD básico

1. **Configuración Inicial**
- Proyecto Node.js/Express con TypeScript
- Conexión a SQL Server con Prisma (modelos completos)
- Variables de entorno y scripts básicos
2. **Autenticación JWT**
- Endpoints: /auth/register, /auth/login, /auth/me
- Middleware de autenticación
- Sistema de roles básico (User, Admin, SuperAdmin)
3. **CRUD Esencial**
- Usuarios: GET/PUT/DELETE /users
- Dispositivos: POST/GET/PUT/DELETE /devices
- Relaciones usuario-dispositivo
4. **Herramientas de Desarrollo**
- Postman Collection básica
- Swagger/OpenAPI inicial
- Docker-compose para SQL Server

![](/assets/Aspose.Words.a0e15626-ba5e-4e53-b264-0afe8bf6a56a.005.png)

<a name="_page3_x0.00_y60.00"></a>**2. Backend Avanzado**



|**ID**|[42](http://localhost:8080/work_packages/42)|**TYPE**|Task|
| - | - | - | - |
|**STATUS**|New|**ASSIGNEE**|José Valentino Masías Castillo|
|**PRIORITY**|Normal|**AUTHOR**|José Valentino Masías Castillo|
|**DURATION**|11 d|**START DATE**|03/18/2025|
|**FINISH DATE**|04/01/2025|||
**Description**

**Objetivo:** Funcionalidades complejas y seguridad

1. **Gestión de Eventos**
- POST /devices/{id}/events con validación de datos
- GET /devices/{id}/events con filtros temporales
- WebSocket para notificaciones en tiempo real
2. **Seguridad Reforzada**
- Rate limiting (express-rate-limit)
- Validación de requests con Zod
- CORS configurado
- Helmet para headers de seguridad
3. **Endpoints Específicos**
- ATHOR Security: Control de puertas/estados
- ATHOR Home: Gestión de relays
- Historiales con paginación

![](/assets/Aspose.Words.a0e15626-ba5e-4e53-b264-0afe8bf6a56a.006.png)

<a name="_page4_x0.00_y60.00"></a>**3. Frontend Base (React)**



|**ID**|[43](http://localhost:8080/work_packages/43)|**TYPE**|Task|
| - | - | - | - |
|**STATUS**|New|**ASSIGNEE**|José Valentino Masías Castillo|
|**PRIORITY**|Normal|**AUTHOR**|José Valentino Masías Castillo|
|**DURATION**|11 d|**START DATE**|04/02/2025|
|**FINISH DATE**|04/16/2025|||
**Description**

**Objetivo:** Sistema de autenticación y navegación

1. **Configuración Inicial**
- React + TypeScript + Vite
- Material UI + React Router
- Estructura de carpetas (feature-based)
2. **Autenticación**
- Páginas de Login/Registro
- Contexto de autenticación con JWT
- Protección de rutas
3. **Vistas Esenciales**
- Dashboard principal
- Listado de dispositivos (tabla paginada)
- Perfil de usuario
4. **Integración API**
- Axios Client con interceptores
- Manejo de errores global
- Loaders y estados de carga

![](/assets/Aspose.Words.a0e15626-ba5e-4e53-b264-0afe8bf6a56a.007.png)

<a name="_page5_x0.00_y60.00"></a>**4. Frontend Avanzado**



|**ID**|[44](http://localhost:8080/work_packages/44)|**TYPE**|Task|
| - | - | - | - |
|**STATUS**|New|**ASSIGNEE**|José Valentino Masías Castillo|
|**PRIORITY**|Normal|**AUTHOR**|José Valentino Masías Castillo|
|**DURATION**|11 d|**START DATE**|04/17/2025|
|**FINISH DATE**|05/01/2025|||
**Description**

**Objetivo:** Funcionalidades específicas y UI compleja

1. **Gestión de Dispositivos**
- Formulario CRUD dispositivos
- Asociación usuarios-dispositivo
- Tarjetas de estado en tiempo real
2. **ATHOR Security UI**
- Panel de control de puertas
- Gráfico histórico de eventos
- Detección de movimiento (notificaciones push)
3. **ATHOR Home UI**
- Interfaz tipo interruptores para relays
- Programador horario visual
- Sistema de alertas por estado
4. **Optimizaciones**
- Lazy loading de rutas
- Memoización de componentes
- Internacionalización básica (i18n)

![](/assets/Aspose.Words.a0e15626-ba5e-4e53-b264-0afe8bf6a56a.008.png)

5. **Integración<a name="_page7_x0.00_y60.00"></a> Final**



|**ID**|[45](http://localhost:8080/work_packages/45)|**TYPE**|Task|
| - | - | - | - |
|**STATUS**|New|**ASSIGNEE**|José Valentino Masías Castillo|
|**PRIORITY**|Normal|**AUTHOR**|José Valentino Masías Castillo|
|**DURATION**|6 d|**START DATE**|05/12/2025|
|**FINISH DATE**|05/19/2025|||
**Description**

**Objetivo:** Conectar backend-frontend y ajustes finales

1. **Conexión WebSocket**
- Actualizaciones en tiempo real
- Notificaciones toast para eventos
2. **Testing E2E**
- Cypress: Flujos críticos (login, CRUD dispositivos)
- React Testing Library: Componentes clave
3. **Ajustes UI/UX**
- Dark mode
- Animaciones básicas
- Responsive design (mobile-first)

![](/assets/Aspose.Words.a0e15626-ba5e-4e53-b264-0afe8bf6a56a.009.png)

<a name="_page8_x0.00_y60.00"></a>**6. Despliegue y Documentación**



|**ID**|[46](http://localhost:8080/work_packages/46)|**TYPE**|Task|
| - | - | - | - |
|**STATUS**|New|**ASSIGNEE**|José Valentino Masías Castillo|
|**PRIORITY**|Normal|**AUTHOR**|José Valentino Masías Castillo|
|**DURATION**|6 d|**START DATE**|05/02/2025|
|**FINISH DATE**|05/09/2025|||
**Description**

**Objetivo:** Sistema en producción y docs completos

1. **Despliegue**
- Backend: Por definir (Servidor propio)
- Frontend: Vercel/Netlify o en Servidor propio
- Dominio personalizado (opcional)
2. **Documentación**
- Swagger público con ejemplos
- Guía de instalación local (README.md)
- Postman Collection completa
3. **Entrega Final**
- Video demo de 5 minutos
- Repositorio GitHub organizado
- Checklist de funcionalidades completadas

![](/assets/Aspose.Words.a0e15626-ba5e-4e53-b264-0afe8bf6a56a.010.png)

<a name="_page9_x0.00_y605.77"></a>**7. Análisis de la arquitectura del sistema (Frontend y Backend) de Athor**



|**ID**|[47](http://localhost:8080/work_packages/47)|**TYPE**|Phase|
| - | - | - | - |
|**STATUS**|New|**ASSIGNEE**|José Valentino Masías Castillo|
|**PRIORITY**|Normal|**AUTHOR**|José Valentino Masías Castillo|
|**DURATION**||**START DATE**||
|**FINISH DATE**||||
**Description**

![](/assets/Aspose.Words.a0e15626-ba5e-4e53-b264-0afe8bf6a56a.011.png)
03/02/2025 07:33 AM 10/10 All open
