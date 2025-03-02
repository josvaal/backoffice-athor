/*
  Warnings:

  - You are about to drop the column `userTypeId` on the `User` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_userTypeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [userTypeId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
