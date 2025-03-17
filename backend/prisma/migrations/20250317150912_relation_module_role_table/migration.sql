/*
  Warnings:

  - You are about to drop the column `userId` on the `UserModule` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `UserModule` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[UserModule] DROP CONSTRAINT [UserModule_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[UserModule] DROP COLUMN [userId];
ALTER TABLE [dbo].[UserModule] ADD [roleId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[UserModule] ADD CONSTRAINT [UserModule_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
