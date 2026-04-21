/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('UnderWriter', 'BusinessAnalyst');

-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('Administrator', 'UnderWriter', 'BusinessAnalyst');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('not_started', 'in_progress', 'needs_review', 'done', 'expired');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "ServiceRequests" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_at" TIMESTAMP(3),
    "assigned_id" UUID,
    "creator_id" UUID,
    "description" TEXT NOT NULL DEFAULT 'no description',

    CONSTRAINT "ServiceRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clerkUserId" TEXT,
    "uname" TEXT NOT NULL DEFAULT 'uname',
    "first_name" TEXT NOT NULL DEFAULT 'fname',
    "last_name" TEXT NOT NULL DEFAULT 'lname',
    "roles" "UserRoles"[],
    "email" TEXT,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketMeta" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "public" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'STANDARD',
    "file_size_limit" INTEGER NOT NULL DEFAULT 10485760,
    "allowed_mime_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "employeeId" UUID NOT NULL,

    CONSTRAINT "BucketMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentContent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "content_owner" TEXT NOT NULL,
    "assigned_role" "UserRoles" NOT NULL,
    "bucketId" UUID NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "mime_type" TEXT NOT NULL DEFAULT 'text/plain',
    "document_status" "Status" NOT NULL DEFAULT 'not_started',

    CONSTRAINT "documentContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Links" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "link_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "owner" TEXT,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_id_key" ON "Employee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_uname_key" ON "Employee"("uname");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BucketMeta_id_key" ON "BucketMeta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BucketMeta_employeeId_key" ON "BucketMeta"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "documentContent_id_key" ON "documentContent"("id");

-- AddForeignKey
ALTER TABLE "BucketMeta" ADD CONSTRAINT "BucketMeta_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentContent" ADD CONSTRAINT "documentContent_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "BucketMeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
