-- CreateEnum
CREATE TYPE "hit_target_type" AS ENUM ('DOCUMENT', 'LINK');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('UnderWriter', 'BusinessAnalyst', 'ActuarialAnalyst', 'ExcelOperator', 'BusinessOperator');

-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('Administrator', 'UnderWriter', 'BusinessAnalyst', 'ActuarialAnalyst', 'ExcelOperator', 'BusinessOperator');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('not_started', 'in_progress', 'needs_review', 'done', 'expired');

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
    "email" TEXT,
    "favorites" INTEGER[],
    "favorite_links" TEXT[],
    "roles" "UserRoles"[] DEFAULT ARRAY[]::"UserRoles"[],
    "unreadNotif" BOOLEAN NOT NULL DEFAULT false,
    "newUser" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "creatorId" TEXT,
    "employeeId" UUID,
    "public" BOOLEAN DEFAULT false,
    "targetRoles" "UserRoles"[] DEFAULT ARRAY[]::"UserRoles"[],

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
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
    "url" TEXT,
    "name" TEXT NOT NULL,
    "bucketId" UUID NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "expiration_warn" BOOLEAN NOT NULL DEFAULT false,
    "mime_type" TEXT NOT NULL DEFAULT 'text/plain',
    "document_status" "Status" NOT NULL DEFAULT 'not_started',
    "document_type" TEXT DEFAULT '',
    "assigned_role" "UserRoles",
    "content_owner" TEXT,
    "favorite" BOOLEAN DEFAULT false,
    "lock" TEXT DEFAULT 'none',
    "meta_tags" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Links" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "link_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "owner" TEXT,
    "lock" TEXT,
    "meta_tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarEvents" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "all_day" BOOLEAN,
    "emp_id" TEXT,
    "lock" TEXT DEFAULT 'none',
    "doc_id" INTEGER DEFAULT -1,
    "color" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalendarEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hit_counts" (
    "target_type" "hit_target_type" NOT NULL,
    "target_id" TEXT NOT NULL,
    "hit_date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hit_counts_pkey" PRIMARY KEY ("target_type","target_id","hit_date")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_id_key" ON "Employee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_clerkUserId_key" ON "Employee"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_uname_key" ON "Employee"("uname");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BucketMeta_id_key" ON "BucketMeta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BucketMeta_employeeId_key" ON "BucketMeta"("employeeId");

-- CreateIndex
CREATE INDEX "hit_counts_hit_date_idx" ON "hit_counts"("hit_date");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketMeta" ADD CONSTRAINT "BucketMeta_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
