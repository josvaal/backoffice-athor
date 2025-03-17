En base a la API proporcionada, los **módulos** que se pueden identificar para el frontend y los **permisos** asociados a cada uno son los siguientes:

---

### **Módulos y Permisos**

#### 1. **Auth (Autenticación)**

- **Descripción**: Módulo para gestionar la autenticación de usuarios (inicio de sesión, registro y perfil).
- **Rutas**:
  - `/auth/login`
  - `/auth/register`
  - `/auth/me` (GET y PUT)
- **Permisos**:
  - No se especifican permisos para estas rutas, lo que sugiere que son accesibles sin restricciones.

---

#### 2. **Users (Usuarios)**

- **Descripción**: Módulo para gestionar usuarios (listar, crear, actualizar, eliminar).
- **Rutas**:
  - `/users/list`
  - `/users/update/{id}`
  - `/users/create`
  - `/users/{id}`
  - `/users/delete/{id}`
- **Permisos**:
  - `users:all`: Permiso global para todas las operaciones de usuarios.
  - `users:list`: Permiso para listar usuarios.
  - `users:create`: Permiso para crear usuarios.
  - `users:update`: Permiso para actualizar usuarios.
  - `users:show`: Permiso para ver detalles de un usuario.
  - `users:delete`: Permiso para eliminar usuarios.

---

#### 3. **Roles (Roles)**

- **Descripción**: Módulo para gestionar roles (listar, crear, actualizar, asignar, desasignar y eliminar).
- **Rutas**:
  - `/roles/list`
  - `/roles/{id}`
  - `/roles/create`
  - `/roles/update/{id}`
  - `/roles/assign/user/{userId}/role/{roleId}`
  - `/roles/deassign/user/{userId}/role/{roleId}`
  - `/roles/delete/{id}`
- **Permisos**:
  - `roles:all`: Permiso global para todas las operaciones de roles.
  - `roles:list`: Permiso para listar roles.
  - `roles:create`: Permiso para crear roles.
  - `roles:update`: Permiso para actualizar roles.
  - `roles:assign`: Permiso para asignar roles a usuarios.
  - `roles:deassign`: Permiso para desasignar roles de usuarios.
  - `roles:delete`: Permiso para eliminar roles.

---

#### 4. **Devices (Dispositivos)**

- **Descripción**: Módulo para gestionar dispositivos (listar, crear, actualizar, eliminar, asignar, desasignar y registrar eventos).
- **Rutas**:
  - `/devices/list`
  - `/devices/{id}`
  - `/devices/macESP32/{mac}`
  - `/devices/serial/{serial}`
  - `/devices/batch/{batch}`
  - `/devices/create`
  - `/devices/update/{id}`
  - `/devices/delete/{id}`
  - `/devices/assign/user/{userId}/device/{deviceId}`
  - `/devices/deassign/user/{userId}/device/{deviceId}`
  - `/devices/{deviceId}/event/{eventTypeId}`
- **Permisos**:
  - `devices:all`: Permiso global para todas las operaciones de dispositivos.
  - `devices:list`: Permiso para listar dispositivos.
  - `devices:create`: Permiso para crear dispositivos.
  - `devices:update`: Permiso para actualizar dispositivos.
  - `devices:delete`: Permiso para eliminar dispositivos.
  - `devices:assign`: Permiso para asignar dispositivos a usuarios.
  - `devices:deassign`: Permiso para desasignar dispositivos de usuarios.
  - `devices:register_event`: Permiso para registrar eventos en dispositivos.
  - `devices:show_mac_esp32`: Permiso para ver dispositivos por MAC del ESP32.
  - `devices:show_serial`: Permiso para ver dispositivos por número de serie.
  - `devices:show_batch`: Permiso para ver dispositivos por lote.

---

#### 5. **EventType (Tipos de Evento)**

- **Descripción**: Módulo para gestionar tipos de eventos (listar, crear, actualizar y eliminar).
- **Rutas**:
  - `/event-type/list`
  - `/event-type/{id}`
  - `/event-type/create`
  - `/event-type/update/{id}`
  - `/event-type/delete/{id}`
- **Permisos**:
  - `event_types:all`: Permiso global para todas las operaciones de tipos de eventos.
  - `event_types:list`: Permiso para listar tipos de eventos.
  - `event_types:create`: Permiso para crear tipos de eventos.
  - `event_types:update`: Permiso para actualizar tipos de eventos.
  - `event_types:delete`: Permiso para eliminar tipos de eventos.

---

#### 6. **DeviceModel (Modelos de Dispositivo)**

- **Descripción**: Módulo para gestionar modelos de dispositivos (listar, crear, actualizar y eliminar).
- **Rutas**:
  - `/device-model/list`
  - `/device-model/{id}`
  - `/device-model/create`
  - `/device-model/update/{id}`
  - `/device-model/delete/{id}`
- **Permisos**:
  - `device_models:all`: Permiso global para todas las operaciones de modelos de dispositivos.
  - `device_models:list`: Permiso para listar modelos de dispositivos.
  - `device_models:create`: Permiso para crear modelos de dispositivos.
  - `device_models:update`: Permiso para actualizar modelos de dispositivos.
  - `device_models:delete`: Permiso para eliminar modelos de dispositivos.

---

#### 7. **DeviceStatus (Estados de Dispositivo)**

- **Descripción**: Módulo para gestionar estados de dispositivos (listar, crear, actualizar y eliminar).
- **Rutas**:
  - `/device-status/list`
  - `/device-status/{id}`
  - `/device-status/create`
  - `/device-status/update/{id}`
  - `/device-status/delete/{id}`
- **Permisos**:
  - `device_statuses:all`: Permiso global para todas las operaciones de estados de dispositivos.
  - `device_statuses:list`: Permiso para listar estados de dispositivos.
  - `device_statuses:create`: Permiso para crear estados de dispositivos.
  - `device_statuses:update`: Permiso para actualizar estados de dispositivos.
  - `device_statuses:delete`: Permiso para eliminar estados de dispositivos.

---

#### 8. **Events (Eventos)**

- **Descripción**: Módulo para gestionar eventos (listar y eliminar).
- **Rutas**:
  - `/events/list`
  - `/events/{id}`
  - `/events/delete/{id}`
- **Permisos**:
  - `events:all`: Permiso global para todas las operaciones de eventos.
  - `events:list`: Permiso para listar eventos.
  - `events:delete`: Permiso para eliminar eventos.

---

#### 9. **UserDevices (Relaciones Usuario-Dispositivo)**

- **Descripción**: Módulo para gestionar relaciones entre usuarios y dispositivos (listar).
- **Rutas**:
  - `/user-devices/list`
- **Permisos**:
  - `user_devices:all`: Permiso global para todas las operaciones de relaciones usuario-dispositivo.
  - `user_devices:list`: Permiso para listar relaciones usuario-dispositivo.

---

#### 10. **DeviceHistory (Historial de Dispositivos)**

- **Descripción**: Módulo para gestionar el historial de dispositivos (listar).
- **Rutas**:
  - `/device-history/list`
- **Permisos**:
  - `device_histories:all`: Permiso global para todas las operaciones de historial de dispositivos.
  - `device_histories:list`: Permiso para listar historial de dispositivos.

---

#### 11. **Permission (Permisos)**

- **Descripción**: Módulo para gestionar permisos (listar, asignar y desasignar).
- **Rutas**:
  - `/module/list`
  - `/module/{id}`
  - `/module/assign/permission/{permissionId}/role/{roleId}`
  - `/module/deassign/permission/{permissionId}/role/{roleId}`
- **Permisos**:
  - `permissions:all`: Permiso global para todas las operaciones de permisos.
  - `permissions:list`: Permiso para listar permisos.
  - `permissions:assign`: Permiso para asignar permisos a roles.
  - `permissions:deassign`: Permiso para desasignar permisos de roles.

---

### Resumen de Módulos y Permisos

| **Módulo**        | **Permisos**                                                                                                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**          | Sin permisos específicos.                                                                                                                                                                                                  |
| **Users**         | `users:all`, `users:list`, `users:create`, `users:update`, `users:show`, `users:delete`                                                                                                                                    |
| **Roles**         | `roles:all`, `roles:list`, `roles:create`, `roles:update`, `roles:assign`, `roles:deassign`, `roles:delete`                                                                                                                |
| **Devices**       | `devices:all`, `devices:list`, `devices:create`, `devices:update`, `devices:delete`, `devices:assign`, `devices:deassign`, `devices:register_event`, `devices:show_mac_esp32`, `devices:show_serial`, `devices:show_batch` |
| **EventType**     | `event_types:all`, `event_types:list`, `event_types:create`, `event_types:update`, `event_types:delete`                                                                                                                    |
| **DeviceModel**   | `device_models:all`, `device_models:list`, `device_models:create`, `device_models:update`, `device_models:delete`                                                                                                          |
| **DeviceStatus**  | `device_statuses:all`, `device_statuses:list`, `device_statuses:create`, `device_statuses:update`, `device_statuses:delete`                                                                                                |
| **Events**        | `events:all`, `events:list`, `events:delete`                                                                                                                                                                               |
| **UserDevices**   | `user_devices:all`, `user_devices:list`                                                                                                                                                                                    |
| **DeviceHistory** | `device_histories:all`, `device_histories:list`                                                                                                                                                                            |
| **Permission**    | `permissions:all`, `permissions:list`, `permissions:assign`, `permissions:deassign`                                                                                                                                        |

---

### Notas:

- Los permisos con el sufijo `:all` son permisos globales que permiten acceder a todas las operaciones dentro de un módulo.
- Las rutas de autenticación (`/auth`) no tienen permisos asociados, lo que sugiere que son accesibles sin restricciones.
- Cada módulo tiene permisos específicos para operaciones como listar, crear, actualizar, eliminar, etc.
