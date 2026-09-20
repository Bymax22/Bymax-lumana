ALTER TABLE "User" ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'APPROVED';
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;
UPDATE "User" SET "emailVerified" = true;

CREATE TYPE "UserApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "User" ALTER COLUMN "approvalStatus" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "approvalStatus" TYPE "UserApprovalStatus" USING "approvalStatus"::"UserApprovalStatus";
ALTER TABLE "User" ALTER COLUMN "approvalStatus" SET DEFAULT 'APPROVED';