/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userTypeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2 NOT NULL,
[userTypeId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[UserType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [typeUser] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [UserType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UserType_typeUser_key] UNIQUE NONCLUSTERED ([typeUser])
);

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_userTypeId_fkey] FOREIGN KEY ([userTypeId]) REFERENCES [dbo].[UserType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
