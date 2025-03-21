USE bo_athor_db;

BEGIN TRY
    -- Iniciar una transacción
    BEGIN TRANSACTION;

    -- Insertar roles predeterminados
    INSERT INTO [dbo].[Role] (name, description, createdAt, updatedAt)
    VALUES
        ('usuario', 'Rol básico de usuario', GETDATE(), GETDATE()),
        ('admin', 'Rol que contiene mas permisos en el sistema', GETDATE(), GETDATE()),
        ('superadmin', 'Rol que tiene todos los permisos existentes del sistema', GETDATE(), GETDATE());

    -- Confirmar la transacción si todo está bien
    COMMIT TRANSACTION;
    PRINT 'Todos los roles se han insertado correctamente.';
END TRY
BEGIN CATCH
    -- Revertir la transacción en caso de error
    ROLLBACK TRANSACTION;
    PRINT 'Error: No se pudieron insertar los roles. Se ha realizado un ROLLBACK.';

    -- Mostrar detalles del error
    SELECT
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage;
END CATCH;
