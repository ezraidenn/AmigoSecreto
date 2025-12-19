-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "budgetMax" INTEGER,
ADD COLUMN     "budgetMin" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "eventDate" TIMESTAMP(3),
ADD COLUMN     "location" TEXT;
