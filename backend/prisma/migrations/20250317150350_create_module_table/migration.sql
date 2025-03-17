BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [lastname] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Device] (
    [id] INT NOT NULL IDENTITY(1,1),
    [superAdminId] INT NOT NULL,
    [macESP32] NVARCHAR(1000) NOT NULL,
    [macBluetooth] NVARCHAR(1000) NOT NULL,
    [modelId] INT NOT NULL,
    [serialNumber] NVARCHAR(1000) NOT NULL,
    [batch] NVARCHAR(1000) NOT NULL,
    [version] NVARCHAR(1000) NOT NULL,
    [relayQuantity] INT NOT NULL,
    [statusId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Device_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Device_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Device_serialNumber_key] UNIQUE NONCLUSTERED ([serialNumber])
);

-- CreateTable
CREATE TABLE [dbo].[DeviceModel] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DeviceModel_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [DeviceModel_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DeviceModel_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[DeviceStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DeviceStatus_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DeviceStatus_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[UserDevice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [deviceId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserDevice_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [UserDevice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DeviceHistory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [deviceId] INT NOT NULL,
    [eventId] INT NOT NULL,
    [triggered] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DeviceHistory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [DeviceHistory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Event] (
    [id] INT NOT NULL IDENTITY(1,1),
    [eventTypeId] INT NOT NULL,
    [status] BIT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Event_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Event_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EventType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [EventType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [EventType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Role_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[UserRole] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [roleId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserRole_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [UserRole_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Module] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [path] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Module_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Module_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Module_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [Module_path_key] UNIQUE NONCLUSTERED ([path])
);

-- CreateTable
CREATE TABLE [dbo].[UserModule] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [moduleId] INT NOT NULL,
    CONSTRAINT [UserModule_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_superAdminId_fkey] FOREIGN KEY ([superAdminId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_modelId_fkey] FOREIGN KEY ([modelId]) REFERENCES [dbo].[DeviceModel]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_statusId_fkey] FOREIGN KEY ([statusId]) REFERENCES [dbo].[DeviceStatus]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserDevice] ADD CONSTRAINT [UserDevice_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserDevice] ADD CONSTRAINT [UserDevice_deviceId_fkey] FOREIGN KEY ([deviceId]) REFERENCES [dbo].[Device]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DeviceHistory] ADD CONSTRAINT [DeviceHistory_deviceId_fkey] FOREIGN KEY ([deviceId]) REFERENCES [dbo].[Device]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DeviceHistory] ADD CONSTRAINT [DeviceHistory_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_eventTypeId_fkey] FOREIGN KEY ([eventTypeId]) REFERENCES [dbo].[EventType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserModule] ADD CONSTRAINT [UserModule_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserModule] ADD CONSTRAINT [UserModule_moduleId_fkey] FOREIGN KEY ([moduleId]) REFERENCES [dbo].[Module]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
