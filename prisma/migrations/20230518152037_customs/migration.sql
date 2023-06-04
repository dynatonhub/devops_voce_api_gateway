/*
  Warnings:

  - You are about to drop the column `updated_at` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- DropForeignKey
ALTER TABLE "reset_passwords" DROP CONSTRAINT "reset_passwords_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users_on_groups" DROP CONSTRAINT "users_on_groups_group_id_fkey";

-- DropForeignKey
ALTER TABLE "users_on_groups" DROP CONSTRAINT "users_on_groups_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_on_permissions" DROP CONSTRAINT "users_on_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "users_on_permissions" DROP CONSTRAINT "users_on_permissions_user_id_fkey";

-- DropIndex
DROP INDEX "roles_name_key";

-- DropIndex
DROP INDEX "sessions_token_key";

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "updated_at",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "description",
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "token",
ALTER COLUMN "ip" DROP NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");
