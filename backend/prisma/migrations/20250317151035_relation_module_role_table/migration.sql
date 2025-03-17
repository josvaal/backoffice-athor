/*
  Warnings:

  - You are about to drop the `UserModule` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[UserModule] DROP CONSTRAINT [UserModule_moduleId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[UserModule] DROP CONSTRAINT [UserModule_roleId_fkey];

-- DropTable
DROP TABLE [dbo].[UserModule];

-- CreateTable
CREATE TABLE [dbo].[RoleModule] (
    [id] INT NOT NULL IDENTITY(1,1),
    [roleId] INT NOT NULL,
    [moduleId] INT NOT NULL,
    CONSTRAINT [RoleModule_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[RoleModule] ADD CONSTRAINT [RoleModule_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RoleModule] ADD CONSTRAINT [RoleModule_moduleId_fkey] FOREIGN KEY ([moduleId]) REFERENCES [dbo].[Module]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
