/*
  Warnings:

  - You are about to drop the column `chapterLeaderId` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `clubId` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `clubLeaderId` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `ownerType` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `clubId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `ownerType` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `homeClubId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leadingChapterId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leadingClubId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `membershipType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ChapterLeader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Club` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubLeader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Complaint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpgradeRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_allClubs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `active` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Made the column `chapterId` on table `Announcement` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `chapterId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `chapterId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'GROUP';

-- AlterEnum
ALTER TYPE "FranchiseType" ADD VALUE 'CHAPTER_FRANCHISE';

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_chapterLeaderId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_clubLeaderId_fkey";

-- DropForeignKey
ALTER TABLE "ChapterLeader" DROP CONSTRAINT "ChapterLeader_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "ChapterLeader" DROP CONSTRAINT "ChapterLeader_chapterLeaderId_fkey";

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_CLcreatorId_fkey";

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_FAcreatorId_fkey";

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeader" DROP CONSTRAINT "ClubLeader_chapterLeaderId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeader" DROP CONSTRAINT "ClubLeader_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_adminComplainantId_fkey";

-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_adminRespondentId_fkey";

-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_franchiseComplainantId_fkey";

-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_franchiseRespondentId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "UpgradeRequest" DROP CONSTRAINT "UpgradeRequest_franchiseId_fkey";

-- DropForeignKey
ALTER TABLE "UpgradeRequest" DROP CONSTRAINT "UpgradeRequest_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "UpgradeRequest" DROP CONSTRAINT "UpgradeRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_homeClubId_fkey";

-- DropForeignKey
ALTER TABLE "_allClubs" DROP CONSTRAINT "_allClubs_A_fkey";

-- DropForeignKey
ALTER TABLE "_allClubs" DROP CONSTRAINT "_allClubs_B_fkey";

-- DropIndex
DROP INDEX "User_leadingChapterId_key";

-- DropIndex
DROP INDEX "User_leadingClubId_key";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "chapterLeaderId",
DROP COLUMN "clubId",
DROP COLUMN "clubLeaderId",
DROP COLUMN "ownerType",
ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "chapterId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "chapterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "clubId",
DROP COLUMN "ownerType",
ALTER COLUMN "chapterId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "homeClubId",
DROP COLUMN "leadingChapterId",
DROP COLUMN "leadingClubId",
DROP COLUMN "membershipType";

-- DropTable
DROP TABLE "ChapterLeader";

-- DropTable
DROP TABLE "Club";

-- DropTable
DROP TABLE "ClubLeader";

-- DropTable
DROP TABLE "Complaint";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "UpgradeRequest";

-- DropTable
DROP TABLE "_allClubs";

-- DropEnum
DROP TYPE "AnnouncementOwnerType";

-- DropEnum
DROP TYPE "ChapterLeaderRole";

-- DropEnum
DROP TYPE "ComplaintStatus";

-- DropEnum
DROP TYPE "EntityType";

-- DropEnum
DROP TYPE "EventOwnerType";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "UserMembershipType";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
