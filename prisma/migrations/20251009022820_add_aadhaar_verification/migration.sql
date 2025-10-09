/*
  Warnings:

  - A unique constraint covering the columns `[aadhaarNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "aadhaarNumber" TEXT,
ADD COLUMN     "isAadhaarVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."SocialShare" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievement_type" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "shared_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "points_awarded" INTEGER NOT NULL DEFAULT 10,
    "template_used" TEXT,
    "content_preview" TEXT,

    CONSTRAINT "SocialShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SocialPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "post_type" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location" JSONB,
    "is_public" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PostLike" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PostComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PostShare" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LostFoundItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "contact_email" TEXT,
    "contact_address" TEXT,
    "image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "location_coordinates" JSONB,

    CONSTRAINT "LostFoundItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrimeReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "crime_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "incident_date" TIMESTAMP(3),
    "contact_name" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "contact_email" TEXT,
    "contact_address" TEXT,
    "image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'reported',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "location_coordinates" JSONB,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CrimeReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_postId_userId_key" ON "public"."PostLike"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostShare_postId_userId_platform_key" ON "public"."PostShare"("postId", "userId", "platform");

-- CreateIndex
CREATE INDEX "LostFoundItem_type_status_idx" ON "public"."LostFoundItem"("type", "status");

-- CreateIndex
CREATE INDEX "LostFoundItem_category_idx" ON "public"."LostFoundItem"("category");

-- CreateIndex
CREATE INDEX "LostFoundItem_location_idx" ON "public"."LostFoundItem"("location");

-- CreateIndex
CREATE INDEX "CrimeReport_crime_type_status_idx" ON "public"."CrimeReport"("crime_type", "status");

-- CreateIndex
CREATE INDEX "CrimeReport_severity_idx" ON "public"."CrimeReport"("severity");

-- CreateIndex
CREATE INDEX "CrimeReport_location_idx" ON "public"."CrimeReport"("location");

-- CreateIndex
CREATE UNIQUE INDEX "User_aadhaarNumber_key" ON "public"."User"("aadhaarNumber");

-- AddForeignKey
ALTER TABLE "public"."SocialShare" ADD CONSTRAINT "SocialShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SocialPost" ADD CONSTRAINT "SocialPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostLike" ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostComment" ADD CONSTRAINT "PostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostShare" ADD CONSTRAINT "PostShare_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostShare" ADD CONSTRAINT "PostShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LostFoundItem" ADD CONSTRAINT "LostFoundItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrimeReport" ADD CONSTRAINT "CrimeReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
