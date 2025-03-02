BEGIN TRY

BEGIN TRAN;

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

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_superAdminId_fkey] FOREIGN KEY ([superAdminId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_modelId_fkey] FOREIGN KEY ([modelId]) REFERENCES [dbo].[DeviceModel]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_statusId_fkey] FOREIGN KEY ([statusId]) REFERENCES [dbo].[DeviceStatus]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
