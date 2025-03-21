USE bo_athor_db;

BEGIN TRY
    -- Iniciar una transacción
    BEGIN TRANSACTION;

    INSERT INTO [dbo].[RolePermission] (roleId, permissionId)
    VALUES
        (3, 60)

    -- Confirmar la transacción si todo está bien
    COMMIT TRANSACTION;
    PRINT 'Todos los roles se han insertado correctamente.';
END TRY
BEGIN CATCH
    -- Revertir la transacción en caso de error
    ROLLBACK TRANSACTION;
    PRINT 'Error: No se pudo insertar el permiso. Se ha realizado un ROLLBACK.';

    -- Mostrar detalles del error
    SELECT
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage;
END CATCH;
