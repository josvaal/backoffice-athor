BEGIN TRY
    -- Iniciar una transacción
    BEGIN TRANSACTION;

    -- Insertar permisos en la tabla Permission
    INSERT INTO Permission (name, groupName, description, path, createdAt, updatedAt)
    VALUES
        ('users:all', 'users', 'Permiso global para todas las operaciones de usuarios', '/users', GETDATE(), GETDATE()),
        ('users:list', 'users', 'Permiso para listar usuarios', '/users', GETDATE(), GETDATE()),
        ('users:create', 'users', 'Permiso para crear usuarios', '/users', GETDATE(), GETDATE()),
        ('users:update', 'users', 'Permiso para actualizar usuarios', '/users', GETDATE(), GETDATE()),
        ('users:show', 'users', 'Permiso para ver detalles de un usuario', '/users', GETDATE(), GETDATE()),
        ('users:delete', 'users', 'Permiso para eliminar usuarios', '/users', GETDATE(), GETDATE()),
        ('roles:all', 'roles', 'Permiso global para todas las operaciones de roles', '/roles', GETDATE(), GETDATE()),
        ('roles:list', 'roles', 'Permiso para listar roles', '/roles', GETDATE(), GETDATE()),
        ('roles:create', 'roles', 'Permiso para crear roles', '/roles', GETDATE(), GETDATE()),
        ('roles:update', 'roles', 'Permiso para actualizar roles', '/roles', GETDATE(), GETDATE()),
        ('roles:assign', 'roles', 'Permiso para asignar roles a usuarios', '/roles', GETDATE(), GETDATE()),
        ('roles:deassign', 'roles', 'Permiso para desasignar roles de usuarios', '/roles', GETDATE(), GETDATE()),
        ('roles:delete', 'roles', 'Permiso para eliminar roles', '/roles', GETDATE(), GETDATE()),
        ('devices:all', 'devices', 'Permiso global para todas las operaciones de dispositivos', '/devices', GETDATE(), GETDATE()),
        ('devices:list', 'devices', 'Permiso para listar dispositivos', '/devices', GETDATE(), GETDATE()),
        ('devices:create', 'devices', 'Permiso para crear dispositivos', '/devices', GETDATE(), GETDATE()),
        ('devices:update', 'devices', 'Permiso para actualizar dispositivos', '/devices', GETDATE(), GETDATE()),
        ('devices:delete', 'devices', 'Permiso para eliminar dispositivos', '/devices', GETDATE(), GETDATE()),
        ('devices:assign', 'devices', 'Permiso para asignar dispositivos a usuarios', '/devices', GETDATE(), GETDATE()),
        ('devices:deassign', 'devices', 'Permiso para desasignar dispositivos de usuarios', '/devices', GETDATE(), GETDATE()),
        ('devices:register_event', 'devices', 'Permiso para registrar eventos en dispositivos', '/devices', GETDATE(), GETDATE()),
        ('devices:show_mac_esp32', 'devices', 'Permiso para ver dispositivos por MAC del ESP32', '/devices', GETDATE(), GETDATE()),
        ('devices:show_serial', 'devices', 'Permiso para ver dispositivos por número de serie', '/devices', GETDATE(), GETDATE()),
        ('devices:show_batch', 'devices', 'Permiso para ver dispositivos por lote', '/devices', GETDATE(), GETDATE()),
        ('event_types:all', 'event_types', 'Permiso global para todas las operaciones de tipos de eventos', '/event-types', GETDATE(), GETDATE()),
        ('event_types:list', 'event_types', 'Permiso para listar tipos de eventos', '/event-types', GETDATE(), GETDATE()),
        ('event_types:create', 'event_types', 'Permiso para crear tipos de eventos', '/event-types', GETDATE(), GETDATE()),
        ('event_types:update', 'event_types', 'Permiso para actualizar tipos de eventos', '/event-types', GETDATE(), GETDATE()),
        ('event_types:delete', 'event_types', 'Permiso para eliminar tipos de eventos', '/event-types', GETDATE(), GETDATE()),
        ('device_models:all', 'device_models', 'Permiso global para todas las operaciones de modelos de dispositivos', '/device-models', GETDATE(), GETDATE()),
        ('device_models:list', 'device_models', 'Permiso para listar modelos de dispositivos', '/device-models', GETDATE(), GETDATE()),
        ('device_models:create', 'device_models', 'Permiso para crear modelos de dispositivos', '/device-models', GETDATE(), GETDATE()),
        ('device_models:update', 'device_models', 'Permiso para actualizar modelos de dispositivos', '/device-models', GETDATE(), GETDATE()),
        ('device_models:delete', 'device_models', 'Permiso para eliminar modelos de dispositivos', '/device-models', GETDATE(), GETDATE()),
        ('device_statuses:all', 'device_statuses', 'Permiso global para todas las operaciones de estados de dispositivos', '/device-statuses', GETDATE(), GETDATE()),
        ('device_statuses:list', 'device_statuses', 'Permiso para listar estados de dispositivos', '/device-statuses', GETDATE(), GETDATE()),
        ('device_statuses:create', 'device_statuses', 'Permiso para crear estados de dispositivos', '/device-statuses', GETDATE(), GETDATE()),
        ('device_statuses:update', 'device_statuses', 'Permiso para actualizar estados de dispositivos', '/device-statuses', GETDATE(), GETDATE()),
        ('device_statuses:delete', 'device_statuses', 'Permiso para eliminar estados de dispositivos', '/device-statuses', GETDATE(), GETDATE()),
        ('events:all', 'events', 'Permiso global para todas las operaciones de eventos', '/events', GETDATE(), GETDATE()),
        ('events:list', 'events', 'Permiso para listar eventos', '/events', GETDATE(), GETDATE()),
        ('events:delete', 'events', 'Permiso para eliminar eventos', '/events', GETDATE(), GETDATE()),
        ('user_devices:all', 'user_devices', 'Permiso global para todas las operaciones de relaciones usuario-dispositivo', '/user-devices', GETDATE(), GETDATE()),
        ('user_devices:list', 'user_devices', 'Permiso para listar relaciones usuario-dispositivo', '/user-devices', GETDATE(), GETDATE()),
        ('device_histories:all', 'device_histories', 'Permiso global para todas las operaciones de historial de dispositivos', '/device-histories', GETDATE(), GETDATE()),
        ('device_histories:list', 'device_histories', 'Permiso para listar historial de dispositivos', '/device-histories', GETDATE(), GETDATE()),
        ('permissions:all', 'permissions', 'Permiso global para todas las operaciones de permisos', '/permissions', GETDATE(), GETDATE()),
        ('permissions:list', 'permissions', 'Permiso para listar permisos', '/permissions', GETDATE(), GETDATE()),
        ('permissions:list_by_role_id', 'permissions', 'Permiso para listar permisos en base a un id de rol', '/permissions', GETDATE(), GETDATE()),
        ('permissions:assign', 'permissions', 'Permiso para asignar permisos a roles', '/permissions', GETDATE(), GETDATE()),
        ('permissions:deassign', 'permissions', 'Permiso para desasignar permisos de roles', '/permissions', GETDATE(), GETDATE());

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
