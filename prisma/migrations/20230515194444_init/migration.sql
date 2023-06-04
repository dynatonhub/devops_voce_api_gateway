/*
  Warnings:

  - You are about to drop the column `name` on the `permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scope,action]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `permissions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "permissions_name_key";

-- DropIndex
DROP INDEX "permissions_name_scope_key";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "name",
ADD COLUMN     "action" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permissions_scope_action_key" ON "permissions"("scope", "action");
