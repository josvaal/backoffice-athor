BEGIN TRY
    -- Iniciar una transacción
    BEGIN TRANSACTION;

    -- Insertar permisos en la tabla Permission con paths más específicos
    INSERT INTO Permission (name, groupName, description, path, createdAt, updatedAt)
    VALUES
        -- Permisos para usuarios
        ('users:all', 'users', 'Permiso global para todas las operaciones de usuarios', '/users', GETDATE(), GETDATE()),
        ('users:list', 'users', 'Permiso para listar usuarios', '/users/list', GETDATE(), GETDATE()),
        ('users:create', 'users', 'Permiso para crear un nuevo usuario', '/users/create', GETDATE(), GETDATE()),
        ('users:show', 'users', 'Permiso para ver detalles de un usuario', '/users/show', GETDATE(), GETDATE()),
        ('users:edit', 'users', 'Permiso para editar un usuario', '/users/edit', GETDATE(), GETDATE()),
        ('users:delete', 'users', 'Permiso para eliminar un usuario', '/users/delete', GETDATE(), GETDATE()),

        -- Permisos para roles
        ('roles:all', 'roles', 'Permiso global para todas las operaciones de roles', '/roles', GETDATE(), GETDATE()),
        ('roles:list', 'roles', 'Permiso para listar roles', '/roles/list', GETDATE(), GETDATE()),
        ('roles:create', 'roles', 'Permiso para crear un nuevo rol', '/roles/create', GETDATE(), GETDATE()),
        ('roles:update', 'roles', 'Permiso para actualizar un rol', '/roles/edit', GETDATE(), GETDATE()),
        ('roles:assign', 'roles', 'Permiso para asignar roles a usuarios', '/roles/assign', GETDATE(), GETDATE()),
        ('roles:deassign', 'roles', 'Permiso para desasignar roles de usuarios', '/roles/deassign', GETDATE(), GETDATE()),
        ('roles:delete', 'roles', 'Permiso para eliminar un rol', '/roles/delete', GETDATE(), GETDATE()),

        -- Permisos para dispositivos
        ('devices:all', 'devices', 'Permiso global para todas las operaciones de dispositivos', '/devices', GETDATE(), GETDATE()),
        ('devices:list', 'devices', 'Permiso para listar dispositivos', '/devices/list', GETDATE(), GETDATE()),
        ('devices:create', 'devices', 'Permiso para crear un nuevo dispositivo', '/devices/create', GETDATE(), GETDATE()),
        ('devices:update', 'devices', 'Permiso para actualizar un dispositivo', '/devices/edit', GETDATE(), GETDATE()),
        ('devices:delete', 'devices', 'Permiso para eliminar un dispositivo', '/devices/delete', GETDATE(), GETDATE()),
        ('devices:assign', 'devices', 'Permiso para asignar dispositivos a usuarios', '/devices/assign', GETDATE(), GETDATE()),
        ('devices:deassign', 'devices', 'Permiso para desasignar dispositivos de usuarios', '/devices/deassign', GETDATE(), GETDATE()),
        ('devices:register_event', 'devices', 'Permiso para registrar eventos en dispositivos', '/devices/register_event', GETDATE(), GETDATE()),
        ('devices:show_mac_esp32', 'devices', 'Permiso para ver dispositivos por MAC del ESP32', '/devices/show_mac_esp32', GETDATE(), GETDATE()),
        ('devices:show_serial', 'devices', 'Permiso para ver dispositivos por número de serie', '/devices/show_serial', GETDATE(), GETDATE()),
        ('devices:show_batch', 'devices', 'Permiso para ver dispositivos por lote', '/devices/show_batch', GETDATE(), GETDATE()),

        -- Permisos para tipos de eventos
        ('event_types:all', 'event_types', 'Permiso global para todas las operaciones de tipos de eventos', '/event-types', GETDATE(), GETDATE()),
        ('event_types:list', 'event_types', 'Permiso para listar tipos de eventos', '/event-types/list', GETDATE(), GETDATE()),
        ('event_types:create', 'event_types', 'Permiso para crear un nuevo tipo de evento', '/event-types/create', GETDATE(), GETDATE()),
        ('event_types:update', 'event_types', 'Permiso para actualizar un tipo de evento', '/event-types/edit', GETDATE(), GETDATE()),
        ('event_types:delete', 'event_types', 'Permiso para eliminar un tipo de evento', '/event-types/delete', GETDATE(), GETDATE()),

        -- Permisos para modelos de dispositivos
        ('device_models:all', 'device_models', 'Permiso global para todas las operaciones de modelos de dispositivos', '/device-models', GETDATE(), GETDATE()),
        ('device_models:list', 'device_models', 'Permiso para listar modelos de dispositivos', '/device-models/list', GETDATE(), GETDATE()),
        ('device_models:create', 'device_models', 'Permiso para crear un nuevo modelo de dispositivo', '/device-models/create', GETDATE(), GETDATE()),
        ('device_models:update', 'device_models', 'Permiso para actualizar un modelo de dispositivo', '/device-models/edit', GETDATE(), GETDATE()),
        ('device_models:delete', 'device_models', 'Permiso para eliminar un modelo de dispositivo', '/device-models/delete', GETDATE(), GETDATE()),

        -- Permisos para estados de dispositivos
        ('device_statuses:all', 'device_statuses', 'Permiso global para todas las operaciones de estados de dispositivos', '/device-statuses', GETDATE(), GETDATE()),
        ('device_statuses:list', 'device_statuses', 'Permiso para listar estados de dispositivos', '/device-statuses/list', GETDATE(), GETDATE()),
        ('device_statuses:create', 'device_statuses', 'Permiso para crear un nuevo estado de dispositivo', '/device-statuses/create', GETDATE(), GETDATE()),
        ('device_statuses:update', 'device_statuses', 'Permiso para actualizar un estado de dispositivo', '/device-statuses/edit', GETDATE(), GETDATE()),
        ('device_statuses:delete', 'device_statuses', 'Permiso para eliminar un estado de dispositivo', '/device-statuses/delete', GETDATE(), GETDATE()),

        -- Permisos para eventos
        ('events:all', 'events', 'Permiso global para todas las operaciones de eventos', '/events', GETDATE(), GETDATE()),
        ('events:list', 'events', 'Permiso para listar eventos', '/events/list', GETDATE(), GETDATE()),
        ('events:delete', 'events', 'Permiso para eliminar eventos', '/events/delete', GETDATE(), GETDATE()),

        -- Permisos para relaciones usuario-dispositivo
        ('user_devices:all', 'user_devices', 'Permiso global para todas las operaciones de relaciones usuario-dispositivo', '/user-devices', GETDATE(), GETDATE()),
        ('user_devices:list', 'user_devices', 'Permiso para listar relaciones usuario-dispositivo', '/user-devices/list', GETDATE(), GETDATE()),

        -- Permisos para historial de dispositivos
        ('device_histories:all', 'device_histories', 'Permiso global para todas las operaciones de historial de dispositivos', '/device-histories', GETDATE(), GETDATE()),
        ('device_histories:list', 'device_histories', 'Permiso para listar historial de dispositivos', '/device-histories/list', GETDATE(), GETDATE()),

        -- Permisos para permisos
        ('permissions:all', 'permissions', 'Permiso global para todas las operaciones de permisos', '/permissions', GETDATE(), GETDATE()),
        ('permissions:list', 'permissions', 'Permiso para listar permisos', '/permissions/list', GETDATE(), GETDATE()),
        ('permissions:list_by_role_id', 'permissions', 'Permiso para listar permisos en base a un id de rol', '/permissions/list_by_role_id', GETDATE(), GETDATE()),
        ('permissions:list_by_user_id', 'permissions', 'Permiso para listar permisos en base a un id de usuario', '/permissions/list_by_user_id', GETDATE(), GETDATE()),
        ('permissions:assign', 'permissions', 'Permiso para asignar permisos a roles', '/permissions/assign', GETDATE(), GETDATE()),
        ('permissions:deassign', 'permissions', 'Permiso para desasignar permisos de roles', '/permissions/deassign', GETDATE(), GETDATE());

    -- Confirmar la transacción si todo está bien
    COMMIT TRANSACTION;
    PRINT 'Todos los permisos se han insertado correctamente.';
END TRY
BEGIN CATCH
    -- Revertir la transacción en caso de error
    ROLLBACK TRANSACTION;
    PRINT 'Error: No se pudieron insertar los permisos. Se ha realizado un ROLLBACK.';

    -- Mostrar detalles del error
    SELECT
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage;
END CATCH;
