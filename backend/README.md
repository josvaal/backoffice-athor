# Permisos por Módulo

## Auth

`No requiere ningún permiso especial`

## Users

- **users:all**: Permite acceder a todas las operaciones de usuarios.
- **users:list**: Permite listar todos los usuarios.
- **users:show**: Permite visualizar un usuario por ID.
- **users:create**: Permite crear un nuevo usuario.
- **users:update**: Permite actualizar un usuario.
- **users:delete**: Permite eliminar un usuario.

## Roles

- **roles:all**: Permite acceder a todas las operaciones de roles.
- **roles:list**: Permite listar todos los roles.
- **roles:show**: Permite ver un rol por ID.
- **roles:create**: Permite crear un nuevo rol.
- **roles:update**: Permite actualizar un rol.
- **roles:assign**: Permite asignar un rol a un usuario.
- **roles:deassign**: Permite desasignar un rol de un usuario.
- **roles:delete**: Permite eliminar un rol.

## Devices

- **devices:all**: Permite acceder a todas las operaciones de dispositivos.
- **devices:list**: Permite listar todos los dispositivos.
- **devices:show**: Permite mostrar un dispositivo por ID.
- **devices:show_mac_esp32**: Permite mostrar un dispositivo por la MAC del ESP32.
- **devices:show_serial**: Permite mostrar un dispositivo por su número de serie.
- **devices:show_batch**: Permite mostrar dispositivos por lote.
- **devices:create**: Permite crear un nuevo dispositivo.
- **devices:update**: Permite actualizar un dispositivo.
- **devices:delete**: Permite eliminar un dispositivo.
- **devices:assign**: Permite asignar un dispositivo a un usuario.
- **devices:deassign**: Permite desasignar un dispositivo de un usuario.
- **devices:register_event**: Permite registrar eventos por dispositivo.

## EventType

- **event_types:all**: Permite acceder a todas las operaciones de tipos de eventos.
- **event_types:list**: Permite listar todos los tipos de eventos.
- **event_types:show**: Permite mostrar un tipo de evento por ID.
- **event_types:create**: Permite crear un nuevo tipo de evento.
- **event_types:update**: Permite actualizar un tipo de evento.
- **event_types:delete**: Permite eliminar un tipo de evento.

## DeviceModel

- **device_models:all**: Permite acceder a todas las operaciones de modelos de dispositivos.
- **device_models:list**: Permite listar todos los modelos de dispositivos.
- **device_models:show**: Permite mostrar un modelo de dispositivo por ID.
- **device_models:create**: Permite crear un nuevo modelo de dispositivo.
- **device_models:update**: Permite actualizar un modelo de dispositivo.
- **device_models:delete**: Permite eliminar un modelo de dispositivo.

## DeviceStatus

- **device_statuses:all**: Permite acceder a todas las operaciones de estados de dispositivos.
- **device_statuses:list**: Permite listar todos los estados de dispositivos.
- **device_statuses:show**: Permite mostrar un estado de dispositivo por ID.
- **device_statuses:create**: Permite crear un nuevo estado de dispositivo.
- **device_statuses:update**: Permite actualizar un estado de dispositivo.
- **device_statuses:delete**: Permite eliminar un estado de dispositivo.

## Events

- **events:all**: Permite acceder a todas las operaciones de eventos.
- **events:list**: Permite listar todos los eventos.
- **events:show**: Permite obtener un evento por ID.
- **events:delete**: Permite eliminar un evento.

## UserDevices

- **user_devices:all**: Permite acceder a todas las operaciones de relaciones usuario-dispositivo.
- **user_devices:list**: Permite listar todas las relaciones usuario-dispositivo.

## DeviceHistory

- **device_histories:all**: Permite acceder a todas las operaciones de historiales de dispositivos.
- **device_histories:list**: Permite listar los historiales de dispositivos.

## Permission

- **permissions:all**: Permite acceder a todas las operaciones de permisos.
- **permissions:list**: Permite listar todos los permisos.
- **permissions:show**: Permite ver un permiso por ID.
- **permissions:assign**: Permite asignar un rol a un permiso.
- **permissions:deassign**: Permite desasignar un rol de un permiso.
