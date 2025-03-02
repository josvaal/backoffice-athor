/*
  Warnings:

  - Added the required column `userTypeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[UserRole] DROP CONSTRAINT [UserRole_userTypeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[User] ADD [userTypeId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[UserRole] ALTER COLUMN [userTypeId] INT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_userTypeId_fkey] FOREIGN KEY ([userTypeId]) REFERENCES [dbo].[UserType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_userTypeId_fkey] FOREIGN KEY ([userTypeId]) REFERENCES [dbo].[UserType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
